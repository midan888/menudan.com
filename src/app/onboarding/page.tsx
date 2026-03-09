"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/constants";
import { t } from "@/lib/translations";

const i18n = t();

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [themeId, setThemeId] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const s1 = i18n.onboarding.step1;
  const s2 = i18n.onboarding.step2;
  const s3 = i18n.onboarding.step3;

  async function handleComplete(redirectTo: string) {
    if (!name.trim()) {
      setError(s1.error);
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

      router.push(redirectTo);
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
            {[1, 2, 3].map((s) => (
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
              <h1 className="text-2xl font-bold text-gray-900">{s1.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{s1.subtitle}</p>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={s1.placeholder}
                className="mt-6 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                autoFocus
              />

              <button
                onClick={() => {
                  if (!name.trim()) {
                    setError(s1.error);
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                {s1.continue}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{s2.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{s2.subtitle}</p>

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
                    <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{theme.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {s2.back}
                </button>
                <button
                  onClick={() => {
                    setError("");
                    setStep(3);
                  }}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  {s2.continue}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>

                <h1 className="mt-5 text-2xl font-bold text-gray-900">{s3.title}</h1>
                <p className="mt-2 text-sm text-gray-600">{s3.subtitle}</p>
              </div>

              <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-4">
                {s3.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handleComplete("/upload")}
                  disabled={loading}
                  className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? s3.settingUp : s3.uploadPhoto}
                </button>
                <button
                  onClick={() => handleComplete("/menu")}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {s3.addManually}
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {s3.back}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
