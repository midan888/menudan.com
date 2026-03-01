"use client";

import { useState, useRef } from "react";
import type { Tenant } from "@/types";
import { THEMES, SUPPORTED_LANGUAGES } from "@/lib/constants";

interface SettingsFormProps {
  tenant: Tenant;
}

const THEME_PREVIEWS: Record<string, { bg: string; text: string; accent: string }> = {
  classic: { bg: "#FDFBF7", text: "#2C2420", accent: "#8B4513" },
  modern: { bg: "#FFFFFF", text: "#111111", accent: "#111111" },
  dark: { bg: "#0A0A0A", text: "#F5F5F5", accent: "#C8A064" },
  bistro: { bg: "#F5EDE3", text: "#3D2E1E", accent: "#B8860B" },
};

export function SettingsForm({ tenant }: SettingsFormProps) {
  const [name, setName] = useState(tenant.name);
  const [description, setDescription] = useState(tenant.description || "");
  const [address, setAddress] = useState(tenant.address || "");
  const [phone, setPhone] = useState(tenant.phone || "");
  const [themeId, setThemeId] = useState(tenant.themeId);
  const [accentColor, setAccentColor] = useState(tenant.accentColor || "#111111");
  const [defaultLanguage, setDefaultLanguage] = useState(tenant.defaultLanguage || "en");
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(tenant.coverImageUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File, type: "logos" | "covers") {
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { imageUrl } = await res.json();
      if (type === "logos") setLogoUrl(imageUrl);
      else setCoverImageUrl(imageUrl);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          address: address.trim() || null,
          phone: phone.trim() || null,
          themeId,
          accentColor,
          defaultLanguage,
          logoUrl: logoUrl || null,
          coverImageUrl: coverImageUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-600">Saved</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-8">
        {/* Restaurant Info */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Restaurant Info</h2>
          <div className="mt-3 space-y-4">
            <div>
              <label htmlFor="s-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="s-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="s-desc" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="s-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="s-addr" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  id="s-addr"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              <div className="w-40">
                <label htmlFor="s-phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="s-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Images */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Images</h2>
          <div className="mt-3 flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="mt-1 flex items-center gap-3">
                {logoUrl ? (
                  <div className="relative">
                    <img src={logoUrl} alt="Logo" className="h-16 w-16 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading === "logos"}
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400"
                  >
                    {uploading === "logos" ? "..." : "+"}
                  </button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, "logos");
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="mt-1">
                {coverImageUrl ? (
                  <div className="relative">
                    <img src={coverImageUrl} alt="Cover" className="h-16 w-32 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl("")}
                      className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploading === "covers"}
                    className="flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400"
                  >
                    {uploading === "covers" ? "..." : "+ Upload"}
                  </button>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, "covers");
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Theme Selection */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Theme</h2>
          <p className="mt-1 text-xs text-gray-500">
            Choose how your public menu looks to guests.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {THEMES.map((theme) => {
              const preview = THEME_PREVIEWS[theme.id];
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-colors ${
                    themeId === theme.id
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Mini preview */}
                  <div
                    className="mb-2 flex h-20 flex-col items-center justify-center rounded-lg"
                    style={{ background: preview.bg }}
                  >
                    <div
                      className="text-xs font-bold"
                      style={{ color: preview.text }}
                    >
                      {theme.name}
                    </div>
                    <div
                      className="mt-1 h-0.5 w-8 rounded"
                      style={{ background: preview.accent }}
                    />
                    <div className="mt-2 space-y-0.5">
                      <div
                        className="h-1 w-16 rounded"
                        style={{ background: `${preview.text}20` }}
                      />
                      <div
                        className="h-1 w-12 rounded"
                        style={{ background: `${preview.text}15` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {theme.description}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Accent Color */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Accent Color</h2>
          <p className="mt-1 text-xs text-gray-500">
            Used for highlights and emphasis in your menu theme.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
              maxLength={7}
            />
          </div>
        </section>

        {/* Default Language */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Default Language</h2>
          <p className="mt-1 text-xs text-gray-500">
            The language your menu content is written in. Manage translations in the Languages page.
          </p>
          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            className="mt-3 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </section>

        {/* Public Menu Link */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Public Menu Link</h2>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-sm text-gray-700">
              {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/{tenant.slug}
            </span>
            <a
              href={`/r/${tenant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-gray-900 hover:underline"
            >
              Preview
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
