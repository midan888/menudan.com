"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Item } from "@/types";

interface SortableItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability: (itemId: string, isAvailable: boolean) => void;
}

export function SortableItem({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const badges = (item.badges as string[]) || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
        !item.isAvailable ? "opacity-50" : ""
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded p-1 text-gray-300 hover:text-gray-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Item image thumbnail */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-10 w-10 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-gray-900">
            {item.name}
          </span>
          {badges.length > 0 && (
            <div className="flex gap-1">
              {badges.slice(0, 3).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        {item.description && (
          <p className="truncate text-xs text-gray-500">{item.description}</p>
        )}
      </div>

      {/* Price */}
      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
        {item.currency} {Number(item.price).toFixed(2)}
      </span>

      {/* Availability toggle */}
      <button
        onClick={() => onToggleAvailability(item.id, !item.isAvailable)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          item.isAvailable ? "bg-green-500" : "bg-gray-300"
        }`}
        title={item.isAvailable ? "Available" : "Unavailable"}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            item.isAvailable ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>

      {/* Edit */}
      <button
        onClick={() => onEdit(item)}
        className="rounded p-1 text-gray-400 hover:text-gray-600"
        title="Edit item"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={() => {
          if (confirm(`Delete "${item.name}"?`)) onDelete(item.id);
        }}
        className="rounded p-1 text-gray-400 hover:text-red-600"
        title="Delete item"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
