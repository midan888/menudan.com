"use client";

import { useState, useRef } from "react";
import type { Menu } from "@/types";

interface ExtractedItem {
  name: string;
  description: string;
  price: number;
}

interface ExtractedCategory {
  name: string;
  items: ExtractedItem[];
}

interface ExtractionResult {
  categories: ExtractedCategory[];
  currency: string;
  notes: string;
}

interface AIUploadViewProps {
  menus: Menu[];
  plan: string;
  aiUploadsUsed: number;
}

type Step = "upload" | "extracting" | "review" | "saving" | "done";

export function AIUploadView({ menus, plan, aiUploadsUsed }: AIUploadViewProps) {
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [targetMenuId, setTargetMenuId] = useState<string>("");
  const [newMenuName, setNewMenuName] = useState("Uploaded Menu");
  const [savedInfo, setSavedInfo] = useState<{ menuId: string; categoriesCreated: number; itemsCreated: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFreeLimited = plan === "free" && aiUploadsUsed >= 1;

  async function handleFileSelect(file: File) {
    setError("");
    setPreview(file.type === "application/pdf" ? null : URL.createObjectURL(file));
    setStep("extracting");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/menu-photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Extraction failed");
      }

      const data: ExtractionResult = await res.json();
      setResult(data);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
      setStep("upload");
    }
  }

  function updateCategory(catIdx: number, field: "name", value: string) {
    if (!result) return;
    const updated = { ...result };
    updated.categories = [...updated.categories];
    updated.categories[catIdx] = { ...updated.categories[catIdx], [field]: value };
    setResult(updated);
  }

  function removeCategory(catIdx: number) {
    if (!result) return;
    const updated = { ...result };
    updated.categories = updated.categories.filter((_, i) => i !== catIdx);
    setResult(updated);
  }

  function updateItem(catIdx: number, itemIdx: number, field: keyof ExtractedItem, value: string | number) {
    if (!result) return;
    const updated = { ...result };
    updated.categories = [...updated.categories];
    updated.categories[catIdx] = {
      ...updated.categories[catIdx],
      items: [...updated.categories[catIdx].items],
    };
    updated.categories[catIdx].items[itemIdx] = {
      ...updated.categories[catIdx].items[itemIdx],
      [field]: value,
    };
    setResult(updated);
  }

  function removeItem(catIdx: number, itemIdx: number) {
    if (!result) return;
    const updated = { ...result };
    updated.categories = [...updated.categories];
    updated.categories[catIdx] = {
      ...updated.categories[catIdx],
      items: updated.categories[catIdx].items.filter((_, i) => i !== itemIdx),
    };
    setResult(updated);
  }

  function addItem(catIdx: number) {
    if (!result) return;
    const updated = { ...result };
    updated.categories = [...updated.categories];
    updated.categories[catIdx] = {
      ...updated.categories[catIdx],
      items: [
        ...updated.categories[catIdx].items,
        { name: "New Item", description: "", price: 0 },
      ],
    };
    setResult(updated);
  }

  async function handleSave() {
    if (!result) return;
    setStep("saving");
    setError("");

    try {
      const res = await fetch("/api/upload/menu-photo/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuId: targetMenuId || undefined,
          menuName: targetMenuId ? undefined : newMenuName,
          currency: result.currency,
          categories: result.categories,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      const data = await res.json();
      setSavedInfo(data);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setStep("review");
    }
  }

  function handleReset() {
    setStep("upload");
    setResult(null);
    setPreview(null);
    setError("");
    setSavedInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Menu Upload</h1>
      <p className="mt-2 text-sm text-gray-500">
        Upload a photo or PDF of your menu and our AI will extract all items automatically.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="mt-8">
          {isFreeLimited ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="text-4xl">🔒</div>
              <p className="mt-3 text-sm font-medium text-gray-900">
                Free plan limit reached
              </p>
              <p className="mt-1 text-xs text-gray-500">
                You&apos;ve used your 1 free AI upload. Upgrade to Pro for unlimited uploads.
              </p>
            </div>
          ) : (
            <label className="group flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400">
              <svg
                className="h-12 w-12 text-gray-300 group-hover:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-gray-900">
                Click to upload a menu photo or PDF
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG, WebP, or PDF up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </label>
          )}

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-900">Tips for best results</h3>
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
              <li>Take a clear, well-lit photo of the full menu</li>
              <li>Avoid shadows and glare on the menu</li>
              <li>Include all pages if the menu spans multiple pages</li>
              <li>The AI works best with printed menus (handwritten may have lower accuracy)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Step: Extracting */}
      {step === "extracting" && (
        <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          {preview && (
            <img
              src={preview}
              alt="Menu preview"
              className="h-64 w-auto rounded-lg border border-gray-200 object-contain shadow-sm"
            />
          )}
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-900">
              Analyzing your menu...
            </p>
            <p className="text-xs text-gray-500">
              This usually takes 10-20 seconds
            </p>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && result && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Extracted {result.categories.length} categories,{" "}
                {result.categories.reduce((sum, c) => sum + c.items.length, 0)} items
              </p>
              {result.notes && (
                <p className="mt-1 text-xs text-amber-600">
                  AI notes: {result.notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Currency:</span>
              <input
                type="text"
                value={result.currency}
                onChange={(e) => setResult({ ...result, currency: e.target.value.toUpperCase() })}
                className="w-16 rounded border border-gray-300 px-2 py-1 text-sm font-mono"
                maxLength={3}
              />
            </div>
          </div>

          {/* Save target */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-700">
              Save to
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <select
                value={targetMenuId}
                onChange={(e) => setTargetMenuId(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Create new menu</option>
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {!targetMenuId && (
                <input
                  type="text"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="Menu name"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              )}
            </div>
          </div>

          {/* Editable categories & items */}
          <div className="space-y-4">
            {result.categories.map((cat, catIdx) => (
              <div
                key={catIdx}
                className="rounded-xl border border-gray-200 bg-white"
              >
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => updateCategory(catIdx, "name", e.target.value)}
                    className="flex-1 border-none bg-transparent text-sm font-semibold text-gray-900 outline-none"
                  />
                  <span className="text-xs text-gray-400">
                    {cat.items.length} items
                  </span>
                  <button
                    onClick={() => removeCategory(catIdx)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-start gap-3 px-4 py-2.5"
                    >
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(catIdx, itemIdx, "name", e.target.value)
                          }
                          className="block w-full border-none bg-transparent text-sm font-medium text-gray-900 outline-none"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(
                              catIdx,
                              itemIdx,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description (optional)"
                          className="block w-full border-none bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-300"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              catIdx,
                              itemIdx,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          step="0.01"
                          className="w-20 rounded border border-gray-200 px-2 py-1 text-right text-sm font-mono"
                        />
                        <button
                          onClick={() => removeItem(catIdx, itemIdx)}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addItem(catIdx)}
                  className="w-full border-t border-gray-100 px-4 py-2 text-xs text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                >
                  + Add item
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Save to Menu
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Step: Saving */}
      {step === "saving" && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">Saving to menu...</p>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && savedInfo && (
        <div className="mt-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Menu saved successfully!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {savedInfo.categoriesCreated} categories and {savedInfo.itemsCreated} items added.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href={`/menu/${savedInfo.menuId}`}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              View in Menu Builder
            </a>
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
