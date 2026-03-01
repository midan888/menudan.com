"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Menu, Category, Item } from "@/types";
import { CategoryCard } from "./CategoryCard";
import { ItemFormModal } from "./ItemFormModal";

interface MenuBuilderProps {
  initialMenus: Menu[];
  initialCategories: Category[];
  initialItems: Item[];
}

export function MenuBuilder({
  initialMenus,
  initialCategories,
  initialItems,
}: MenuBuilderProps) {
  const [menuList, setMenuList] = useState(initialMenus);
  const [selectedMenuId, setSelectedMenuId] = useState(
    initialMenus[0]?.id || ""
  );
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [itemList, setItemList] = useState(initialItems);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");

  // Item editing modal
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [addingToCategoryId, setAddingToCategoryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const menuCategories = categoryList
    .filter((c) => c.menuId === selectedMenuId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const getItemsForCategory = useCallback(
    (categoryId: string) =>
      itemList
        .filter((i) => i.categoryId === categoryId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [itemList]
  );

  // ── Save helpers ──

  async function apiCall(url: string, options: RequestInit) {
    setSaveStatus("saving");
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
      return data;
    } catch {
      setSaveStatus("idle");
      throw new Error("Save failed");
    }
  }

  // ── Menu actions ──

  async function handleAddMenu() {
    const menu = await apiCall("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Menu" }),
    });
    setMenuList((prev) => [...prev, menu]);
    setSelectedMenuId(menu.id);
  }

  async function handleDeleteMenu(menuId: string) {
    await apiCall(`/api/menus/${menuId}`, { method: "DELETE" });
    setMenuList((prev) => prev.filter((m) => m.id !== menuId));
    setCategoryList((prev) => prev.filter((c) => c.menuId !== menuId));
    // Also remove items belonging to deleted categories
    const deletedCatIds = categoryList
      .filter((c) => c.menuId === menuId)
      .map((c) => c.id);
    setItemList((prev) =>
      prev.filter((i) => !deletedCatIds.includes(i.categoryId))
    );
    if (selectedMenuId === menuId) {
      const remaining = menuList.filter((m) => m.id !== menuId);
      setSelectedMenuId(remaining[0]?.id || "");
    }
  }

  async function handleRenameMenu(menuId: string, name: string) {
    await apiCall(`/api/menus/${menuId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setMenuList((prev) =>
      prev.map((m) => (m.id === menuId ? { ...m, name } : m))
    );
  }

  // ── Category actions ──

  async function handleAddCategory() {
    const category = await apiCall("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuId: selectedMenuId, name: "New Category" }),
    });
    setCategoryList((prev) => [...prev, category]);
  }

  async function handleUpdateCategory(
    categoryId: string,
    data: Partial<Category>
  ) {
    await apiCall(`/api/categories/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setCategoryList((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...data } : c))
    );
  }

  async function handleDeleteCategory(categoryId: string) {
    await apiCall(`/api/categories/${categoryId}`, { method: "DELETE" });
    setCategoryList((prev) => prev.filter((c) => c.id !== categoryId));
    setItemList((prev) => prev.filter((i) => i.categoryId !== categoryId));
  }

  // ── Category reorder ──

  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategoryList((prev) => {
      const filtered = prev.filter((c) => c.menuId === selectedMenuId);
      const rest = prev.filter((c) => c.menuId !== selectedMenuId);
      const oldIndex = filtered.findIndex((c) => c.id === active.id);
      const newIndex = filtered.findIndex((c) => c.id === over.id);
      const reordered = arrayMove(filtered, oldIndex, newIndex).map(
        (c, i) => ({ ...c, sortOrder: i })
      );

      // Persist to API
      fetch("/api/categories/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((c) => ({ id: c.id, sortOrder: c.sortOrder })),
        }),
      });

      return [...rest, ...reordered];
    });
  }

  // ── Item actions ──

  async function handleAddItem(categoryId: string) {
    setAddingToCategoryId(categoryId);
    setEditingItem(null);
  }

  async function handleSaveItem(data: Partial<Item> & { categoryId?: string }) {
    if (editingItem) {
      // Update existing
      const updated = await apiCall(`/api/items/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setItemList((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...updated } : i))
      );
    } else if (addingToCategoryId) {
      // Create new
      const item = await apiCall("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, categoryId: addingToCategoryId }),
      });
      setItemList((prev) => [...prev, item]);
    }
    setEditingItem(null);
    setAddingToCategoryId(null);
  }

  async function handleDeleteItem(itemId: string) {
    await apiCall(`/api/items/${itemId}`, { method: "DELETE" });
    setItemList((prev) => prev.filter((i) => i.id !== itemId));
  }

  async function handleToggleAvailability(itemId: string, isAvailable: boolean) {
    await apiCall(`/api/items/${itemId}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable }),
    });
    setItemList((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isAvailable } : i))
    );
  }

  async function handleReorderItems(
    categoryId: string,
    activeId: string,
    overId: string
  ) {
    setItemList((prev) => {
      const catItems = prev
        .filter((i) => i.categoryId === categoryId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const rest = prev.filter((i) => i.categoryId !== categoryId);
      const oldIndex = catItems.findIndex((i) => i.id === activeId);
      const newIndex = catItems.findIndex((i) => i.id === overId);
      const reordered = arrayMove(catItems, oldIndex, newIndex).map(
        (item, i) => ({ ...item, sortOrder: i })
      );

      fetch("/api/items/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((i) => ({ id: i.id, sortOrder: i.sortOrder })),
        }),
      });

      return [...rest, ...reordered];
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu Builder</h1>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && (
            <span className="text-xs text-gray-500">Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-green-600">Saved</span>
          )}
        </div>
      </div>

      {/* Menu selector */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {menuList.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setSelectedMenuId(menu.id)}
              onDoubleClick={() => {
                const name = prompt("Menu name:", menu.name);
                if (name && name !== menu.name) handleRenameMenu(menu.id, name);
              }}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedMenuId === menu.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {menu.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddMenu}
          className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Menu
        </button>
        {menuList.length > 1 && selectedMenuId && (
          <button
            onClick={() => {
              if (confirm("Delete this menu and all its categories/items?")) {
                handleDeleteMenu(selectedMenuId);
              }
            }}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Delete menu"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Categories + Items */}
      {selectedMenuId ? (
        <div className="mt-6 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCategoryDragEnd}
          >
            <SortableContext
              items={menuCategories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {menuCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  items={getItemsForCategory(category.id)}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onAddItem={handleAddItem}
                  onEditItem={(item) => {
                    setEditingItem(item);
                    setAddingToCategoryId(null);
                  }}
                  onDeleteItem={handleDeleteItem}
                  onToggleAvailability={handleToggleAvailability}
                  onReorderItems={handleReorderItems}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={handleAddCategory}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>

          {menuCategories.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <h3 className="text-sm font-semibold text-gray-900">
                No categories yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a category like &quot;Appetizers&quot; or &quot;Mains&quot; to get started.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h3 className="text-sm font-semibold text-gray-900">No menus yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Click &quot;Add Menu&quot; to create your first menu.
          </p>
        </div>
      )}

      {/* Item form modal */}
      {(editingItem || addingToCategoryId) && (
        <ItemFormModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => {
            setEditingItem(null);
            setAddingToCategoryId(null);
          }}
        />
      )}
    </div>
  );
}
