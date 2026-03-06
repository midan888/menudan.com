"use client";

import { useState, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import type { Tenant } from "@/types";
import { THEMES, SUPPORTED_LANGUAGES, SUPPORTED_CURRENCIES } from "@/lib/constants";

interface SettingsFormProps {
  tenant: Tenant;
}

const THEME_PREVIEWS: Record<string, { bg: string; text: string; accent: string }> = {
  classic: { bg: "#FDFBF7", text: "#2C2420", accent: "#8B4513" },
  modern: { bg: "#FFFFFF", text: "#111111", accent: "#111111" },
  dark: { bg: "#0A0A0A", text: "#F5F5F5", accent: "#C8A064" },
  bistro: { bg: "#F5EDE3", text: "#3D2E1E", accent: "#B8860B" },
  nordic: { bg: "#F7F7F5", text: "#1A1A1A", accent: "#4A7C59" },
  neon: { bg: "#0D0D0D", text: "#FFFFFF", accent: "#00FF88" },
  rustic: { bg: "#F2E8D9", text: "#3B2A1A", accent: "#8B5E3C" },
  zen: { bg: "#F5F3EE", text: "#2D2926", accent: "#7C6E5A" },
  luxe: { bg: "#0A0A0A", text: "#F0E6C8", accent: "#C9A84C" },
  vibra: { bg: "#FFFBF0", text: "#1A1A1A", accent: "#FF4D00" },
};

export function SettingsForm({ tenant }: SettingsFormProps) {
  const [name, setName] = useState(tenant.name);
  const [description, setDescription] = useState(tenant.description || "");
  const [address, setAddress] = useState(tenant.address || "");
  const [phone, setPhone] = useState(tenant.phone || "");
  const [themeId, setThemeId] = useState(tenant.themeId);
  const [accentColor, setAccentColor] = useState(tenant.accentColor || "#111111");
  const [defaultLanguage, setDefaultLanguage] = useState(tenant.defaultLanguage || "en");
  const [defaultCurrency, setDefaultCurrency] = useState(tenant.defaultCurrency || "USD");
  const [enabledCurrencies, setEnabledCurrencies] = useState<string[]>(
    (tenant.enabledCurrencies as string[]) || ["USD"]
  );
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
          defaultCurrency,
          enabledCurrencies,
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
            <div className="flex flex-col gap-4 sm:flex-row">
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
              <div className="sm:w-40">
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

        {/* Currencies */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900">Currencies</h2>
          <p className="mt-1 text-xs text-gray-500">
            Enable currencies you accept. The default currency is pre-selected when adding new items.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUPPORTED_CURRENCIES.map((cur) => {
              const isEnabled = enabledCurrencies.includes(cur.code);
              return (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => {
                    if (isEnabled) {
                      if (enabledCurrencies.length <= 1) return;
                      const updated = enabledCurrencies.filter((c) => c !== cur.code);
                      setEnabledCurrencies(updated);
                      if (defaultCurrency === cur.code) {
                        setDefaultCurrency(updated[0]);
                      }
                    } else {
                      setEnabledCurrencies([...enabledCurrencies, cur.code]);
                    }
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isEnabled
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cur.symbol} {cur.code}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <label htmlFor="s-default-currency" className="block text-sm font-medium text-gray-700">
              Default Currency
            </label>
            <select
              id="s-default-currency"
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {enabledCurrencies.map((code) => {
                const cur = SUPPORTED_CURRENCIES.find((c) => c.code === code);
                return (
                  <option key={code} value={code}>
                    {cur ? `${cur.symbol} ${cur.name} (${code})` : code}
                  </option>
                );
              })}
            </select>
          </div>
        </section>

        {/* Public Menu Link & Slug */}
        <SlugEditor tenant={tenant} />
        {/* Custom Domain */}
        <CustomDomainSection
          customDomain={tenant.customDomain}
          domainVerified={tenant.domainVerified ?? false}
          plan={tenant.plan}
        />

        {/* Danger Zone */}
        <DeleteAccountSection />
      </div>
    </div>
  );
}

function SlugEditor({ tenant }: { tenant: Tenant }) {
  const [slug, setSlug] = useState(tenant.slug);
  const [editing, setEditing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [currentSlug, setCurrentSlug] = useState(tenant.slug);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkAvailability = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSuggestions([]);
      setError("");

      if (!value || value === currentSlug) {
        setAvailable(null);
        setReason("");
        setChecking(false);
        return;
      }

      setChecking(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/slug/check?slug=${encodeURIComponent(value)}`
          );
          const data = await res.json();
          setAvailable(data.available ?? false);
          setReason(data.reason || "");
          if (data.current) setAvailable(null);
        } catch {
          setAvailable(null);
        } finally {
          setChecking(false);
        }
      }, 400);
    },
    [currentSlug]
  );

  function handleSlugChange(value: string) {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .slice(0, 60);
    setSlug(cleaned);
    checkAvailability(cleaned);
  }

  async function handleSuggest() {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/slug/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, restaurantName: tenant.name }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }

  function selectSuggestion(s: string) {
    setSlug(s);
    setSuggestions([]);
    checkAvailability(s);
  }

  async function handleSave() {
    if (!slug || slug === currentSlug) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save slug");
      }
      setCurrentSlug(slug);
      setEditing(false);
      setAvailable(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setSlug(currentSlug);
    setEditing(false);
    setAvailable(null);
    setReason("");
    setSuggestions([]);
    setError("");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-900">Public Menu Link</h2>

      {!editing ? (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-sm text-gray-700">
              {baseUrl}/r/{currentSlug}
            </span>
            <a
              href={`/r/${currentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-gray-900 hover:underline"
            >
              Preview
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              Change slug
            </button>
            {saved && <span className="text-xs text-green-600">Slug updated</span>}
          </div>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          <div>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
              <span className="shrink-0 pl-3 text-gray-400">{baseUrl}/r/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full border-0 bg-transparent py-2 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-0"
                placeholder="your-restaurant"
                autoFocus
              />
            </div>

            {/* Status indicator */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              {checking && (
                <span className="text-gray-400">Checking...</span>
              )}
              {!checking && available === true && (
                <span className="flex items-center gap-1 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Available
                </span>
              )}
              {!checking && available === false && (
                <span className="flex items-center gap-1 text-red-500">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {reason || "Not available"}
                </span>
              )}
            </div>
          </div>

          {/* AI suggestions when unavailable */}
          {available === false && (
            <div>
              {suggestions.length === 0 && !loadingSuggestions && (
                <button
                  type="button"
                  onClick={handleSuggest}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Suggest alternatives with AI
                </button>
              )}
              {loadingSuggestions && (
                <p className="text-xs text-gray-400">Generating suggestions...</p>
              )}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !available || slug === currentSlug}
              className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Slug"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function CustomDomainSection({
  customDomain: initialDomain,
  domainVerified: initialVerified,
  plan,
}: {
  customDomain: string | null;
  domainVerified: boolean;
  plan: string;
}) {
  const [domain, setDomain] = useState(initialDomain || "");
  const [verified, setVerified] = useState(initialVerified);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [hasDomain, setHasDomain] = useState(!!initialDomain);

  const isPaidPlan = plan === "pro" || plan === "business";

  async function handleSaveDomain() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save domain");
      }
      const data = await res.json();
      setVerified(data.verified);
      setHasDomain(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify() {
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/domains/verify", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Verification failed");
      }
      const data = await res.json();
      setVerified(data.verified);
      if (!data.verified && data.message) {
        setError(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  async function handleRemove() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/domains", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove domain");
      setDomain("");
      setVerified(false);
      setHasDomain(false);
    } catch {
      setError("Failed to remove domain");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-900">Custom Domain</h2>
      {!isPaidPlan ? (
        <div className="mt-2 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Custom domains are available on Pro and Business plans.
          </p>
          <a
            href="/billing"
            className="mt-2 inline-block text-xs font-medium text-gray-900 hover:underline"
          >
            Upgrade your plan
          </a>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="menu.myrestaurant.com"
              className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {!hasDomain || domain !== initialDomain ? (
              <button
                onClick={handleSaveDomain}
                disabled={saving || !domain.trim()}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            ) : !verified ? (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Verify"}
              </button>
            ) : null}
            {hasDomain && (
              <button
                onClick={handleRemove}
                disabled={saving}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>

          {hasDomain && verified && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Domain verified and active
            </div>
          )}

          {hasDomain && !verified && (
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              <p className="font-medium">DNS Setup Required</p>
              <p className="mt-1">
                Add a CNAME record pointing <code className="rounded bg-amber-100 px-1">{domain}</code> to{" "}
                <code className="rounded bg-amber-100 px-1">
                  {typeof window !== "undefined" ? window.location.hostname : "yourdomain.com"}
                </code>
              </p>
              <p className="mt-1 text-amber-500">
                DNS changes can take up to 48 hours to propagate.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function DeleteAccountSection() {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }
      signOut({ redirectTo: "/" });
    } catch {
      setError("Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <>
      <section className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h2 className="text-sm font-semibold text-red-900">Danger Zone</h2>
        <p className="mt-1 text-xs text-red-700">
          Permanently delete your account, restaurant, and all menu data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Account
        </button>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
            <p className="mt-2 text-sm text-gray-600">
              This will permanently delete your account, restaurant profile, all menus, items, images, translations, and analytics data.
            </p>
            <p className="mt-3 text-sm font-medium text-gray-900">
              Type <code className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">DELETE</code> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              autoFocus
            />

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmText("");
                  setError("");
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
