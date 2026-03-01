"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Category, Item } from "@/types";
import { SortableItem } from "./SortableItem";

interface CategoryCardProps {
  category: Category;
  items: Item[];
  onUpdateCategory: (id: string, data: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onAddItem: (categoryId: string) => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleAvailability: (itemId: string, isAvailable: boolean) => void;
  onReorderItems: (categoryId: string, activeId: string, overId: string) => void;
}

export function CategoryCard({
  category,
  items,
  onUpdateCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
  onReorderItems,
}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [collapsed, setCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const itemSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleSaveName() {
    setIsEditing(false);
    if (name.trim() && name !== category.name) {
      onUpdateCategory(category.id, { name: name.trim() });
    } else {
      setName(category.name);
    }
  }

  function handleItemDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorderItems(category.id, active.id as string, over.id as string);
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-gray-200 bg-white">
      {/* Category header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-1 text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 text-gray-400 hover:text-gray-600"
        >
          <svg
            className={`h-4 w-4 transition-transform ${collapsed ? "-rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") {
                setName(category.name);
                setIsEditing(false);
              }
            }}
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm font-semibold focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 text-left text-sm font-semibold text-gray-900 hover:text-gray-700"
          >
            {category.name}
          </button>
        )}

        <span className="text-xs text-gray-400">{items.length} items</span>

        <button
          onClick={() => onAddItem(category.id)}
          className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          + Add Item
        </button>

        <button
          onClick={() => {
            if (confirm(`Delete "${category.name}" and all its items?`)) {
              onDeleteCategory(category.id);
            }
          }}
          className="rounded p-1 text-gray-400 hover:text-red-600"
          title="Delete category"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Items */}
      {!collapsed && (
        <div className="divide-y divide-gray-50">
          <DndContext
            sensors={itemSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleItemDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                  onToggleAvailability={onToggleAvailability}
                />
              ))}
            </SortableContext>
          </DndContext>

          {items.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-gray-400">
                No items yet. Click &quot;+ Add Item&quot; to add one.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
