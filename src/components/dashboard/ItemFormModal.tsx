"use client";

import { useState, useRef } from "react";
import type { Item } from "@/types";
import { BADGES, ALLERGENS, SUPPORTED_CURRENCIES } from "@/lib/constants";

interface ItemFormModalProps {
  item: Item | null;
  onSave: (data: Partial<Item>) => Promise<void>;
  onClose: () => void;
  enabledCurrencies?: string[];
  defaultCurrency?: string;
}

export function ItemFormModal({ item, onSave, onClose, enabledCurrencies, defaultCurrency }: ItemFormModalProps) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const currencyOptions = enabledCurrencies && enabledCurrencies.length > 0 ? enabledCurrencies : ["USD"];
  const primaryCurrency = defaultCurrency || currencyOptions[0];

  // Initialize prices from item.prices (multi-currency map) or fall back to single price+currency
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const existingPrices = (item?.prices as Record<string, string>) || {};
    if (Object.keys(existingPrices).length > 0) return existingPrices;
    if (item?.price) return { [item.currency || primaryCurrency]: String(item.price) };
    return {};
  });

  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  const [badges, setBadges] = useState<string[]>(
    (item?.badges as string[]) || []
  );
  const [allergens, setAllergens] = useState<string[]>(
    (item?.allergens as string[]) || []
  );
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "items");

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
        return;
      }

      const { imageUrl: url } = await res.json();
      setImageUrl(url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    // At least the primary currency must have a valid price
    const primaryPrice = prices[primaryCurrency];
    if (!primaryPrice || isNaN(Number(primaryPrice)) || Number(primaryPrice) < 0) {
      setError(`Price in ${primaryCurrency} is required`);
      return;
    }

    // Validate all entered prices
    for (const [code, val] of Object.entries(prices)) {
      if (val && (isNaN(Number(val)) || Number(val) < 0)) {
        setError(`Invalid price for ${code}`);
        return;
      }
    }

    // Clean prices: remove empty entries
    const cleanPrices: Record<string, string> = {};
    for (const [code, val] of Object.entries(prices)) {
      if (val && val.trim() !== "") {
        cleanPrices[code] = val;
      }
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
        price: primaryPrice,
        currency: primaryCurrency,
        prices: cleanPrices,
        isAvailable,
        badges,
        allergens,
        imageUrl: imageUrl || null,
      } as Partial<Item>);
    } catch {
      setError("Save failed");
      setSaving(false);
    }
  }

  function toggleBadge(badge: string) {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }

  function toggleAllergen(allergen: string) {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {item ? "Edit Item" : "Add Item"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Item"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
                >
                  {uploading ? (
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="item-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="e.g. Margherita Pizza"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="item-desc" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="item-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Fresh tomatoes, mozzarella, basil..."
            />
            <p className="mt-1 text-xs text-gray-400">
              {description.length}/500
            </p>
          </div>

          {/* Prices */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {currencyOptions.length > 1 ? "Prices" : "Price"} <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 space-y-2">
              {currencyOptions.map((code) => {
                const cur = SUPPORTED_CURRENCIES.find((c) => c.code === code);
                const isPrimary = code === primaryCurrency;
                return (
                  <div key={code} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-sm font-medium text-gray-500">
                      {cur?.symbol || code} {code}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required={isPrimary}
                      value={prices[code] || ""}
                      onChange={(e) =>
                        setPrices((prev) => ({ ...prev, [code]: e.target.value }))
                      }
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder={isPrimary ? "12.50" : "Optional"}
                    />
                    {isPrimary && (
                      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        default
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Available
            </label>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isAvailable ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isAvailable ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Badges
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => toggleBadge(badge)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    badges.includes(badge)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {badge.replace(/_/g, " ").replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allergens
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleAllergen(allergen)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    allergens.includes(allergen)
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
