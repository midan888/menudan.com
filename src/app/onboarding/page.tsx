"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/constants";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [themeId, setThemeId] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleComplete() {
    if (!name.trim()) {
      setError("Please enter your restaurant name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), themeId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/menu");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Progress indicator */}
          <div className="mb-8 flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  s <= step ? "bg-gray-900" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Name your restaurant
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                This will be displayed on your menu page.
              </p>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Le Petit Jardin"
                className="mt-6 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                autoFocus
              />

              <button
                onClick={() => {
                  if (!name.trim()) {
                    setError("Please enter your restaurant name");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Choose your style
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Pick a design theme for your menu page. You can change this later.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`rounded-lg border-2 p-4 text-left transition-colors ${
                      themeId === theme.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {theme.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {theme.description}
                    </p>
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Setting up..." : "Create Menu"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
