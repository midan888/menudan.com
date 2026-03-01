"use client";

import { useState } from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguagesViewProps {
  defaultLanguage: string;
  enabledLanguages: string[];
  translationCounts: Record<string, number>;
}

export function LanguagesView({
  defaultLanguage,
  enabledLanguages: initialEnabled,
  translationCounts: initialCounts,
}: LanguagesViewProps) {
  const [enabledLanguages, setEnabledLanguages] = useState(initialEnabled);
  const [translationCounts, setTranslationCounts] = useState(initialCounts);
  const [translating, setTranslating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editingLang, setEditingLang] = useState<string | null>(null);
  const [editTranslations, setEditTranslations] = useState<
    Array<{ id: string; entityType: string; entityId: string; field: string; value: string; isAutoTranslated: boolean }>
  >([]);
  const [loadingEdit, setLoadingEdit] = useState(false);

  async function toggleLanguage(code: string) {
    const newEnabled = enabledLanguages.includes(code)
      ? enabledLanguages.filter((l) => l !== code)
      : [...enabledLanguages, code];

    setEnabledLanguages(newEnabled);
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabledLanguages: newEnabled }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to update languages");
      setEnabledLanguages(enabledLanguages); // revert
    } finally {
      setSaving(false);
    }
  }

  async function triggerTranslation(langCode: string) {
    setTranslating(langCode);
    setError("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: langCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Translation failed");
      }

      const data = await res.json();
      setTranslationCounts((prev) => ({
        ...prev,
        [langCode]: (prev[langCode] || 0) + data.count,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setTranslating(null);
    }
  }

  async function openEditor(langCode: string) {
    setLoadingEdit(true);
    setEditingLang(langCode);
    setError("");

    try {
      const res = await fetch(`/api/translate?lang=${langCode}`);
      if (!res.ok) throw new Error("Failed to load translations");
      const data = await res.json();
      setEditTranslations(data);
    } catch {
      setError("Failed to load translations");
      setEditingLang(null);
    } finally {
      setLoadingEdit(false);
    }
  }

  async function saveTranslation(id: string, value: string) {
    try {
      const res = await fetch(`/api/translate/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error("Save failed");

      setEditTranslations((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, value, isAutoTranslated: false } : t
        )
      );
    } catch {
      setError("Failed to save translation");
    }
  }

  const enabledLangs = SUPPORTED_LANGUAGES.filter(
    (l) => enabledLanguages.includes(l.code) && l.code !== defaultLanguage
  );

  const availableLangs = SUPPORTED_LANGUAGES.filter(
    (l) => !enabledLanguages.includes(l.code)
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Languages</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage translations for your menu. Enable languages and auto-translate with AI.
          </p>
        </div>
        {saved && <span className="text-xs text-green-600">Saved</span>}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Translation Editor Modal */}
      {editingLang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Translations —{" "}
                {SUPPORTED_LANGUAGES.find((l) => l.code === editingLang)?.nativeName}
              </h2>
              <button
                onClick={() => setEditingLang(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {loadingEdit ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="h-6 w-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : editTranslations.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No translations yet. Click &quot;Translate&quot; to auto-translate.
                </p>
              ) : (
                <div className="space-y-3">
                  {editTranslations.map((t) => (
                    <div key={t.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 uppercase">
                          {t.entityType}
                        </span>
                        <span className="text-xs text-gray-400">{t.field}</span>
                        {t.isAutoTranslated && (
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                            AI
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={t.value}
                        onChange={(e) =>
                          setEditTranslations((prev) =>
                            prev.map((tr) =>
                              tr.id === t.id
                                ? { ...tr, value: e.target.value }
                                : tr
                            )
                          )
                        }
                        onBlur={(e) => saveTranslation(t.id, e.target.value)}
                        className="block w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Default language */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
            {defaultLanguage.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {SUPPORTED_LANGUAGES.find((l) => l.code === defaultLanguage)?.name} — Default
            </p>
            <p className="text-xs text-gray-500">
              Your menu content is written in this language
            </p>
          </div>
        </div>
      </div>

      {/* Enabled languages */}
      {enabledLangs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900">Active Translations</h2>
          <div className="mt-3 space-y-2">
            {enabledLangs.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600">
                    {lang.code.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lang.name}{" "}
                      <span className="text-gray-400">({lang.nativeName})</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {translationCounts[lang.code] || 0} translations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditor(lang.code)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => triggerTranslation(lang.code)}
                    disabled={translating === lang.code}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {translating === lang.code ? "Translating..." : "Translate"}
                  </button>
                  <button
                    onClick={() => toggleLanguage(lang.code)}
                    disabled={saving}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add languages */}
      {availableLangs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900">Add Language</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {availableLangs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="text-xs font-medium text-gray-400">
                  {lang.code.toUpperCase()}
                </span>
                <span className="text-gray-700">{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">How it works</h3>
        <ul className="mt-2 space-y-1 text-xs text-gray-500">
          <li>Enable a language to make it available on your public menu</li>
          <li>Click &quot;Translate&quot; to auto-translate all menu content using AI</li>
          <li>Click &quot;Edit&quot; to review and manually adjust any translation</li>
          <li>Manual edits are preserved — AI won&apos;t overwrite your changes</li>
          <li>Re-translate anytime to pick up new menu items</li>
        </ul>
      </div>
    </div>
  );
}
