"use client";

import { useState } from "react";
import Link from "next/link";
import { t } from "@/lib/translations";

const i18n = t();

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const l = i18n.auth.forgotPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setError(data.error || l.tooManyAttempts);
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(l.somethingWrong);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{l.checkEmail}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {l.checkEmailDesc} <span className="font-medium text-gray-900">{email}</span>, {l.checkEmailDesc2}
        </p>
        <p className="mt-2 text-sm text-gray-500">{l.linkExpires}</p>
        <Link
          href="/login"
          className="mt-6 block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 text-center"
        >
          {l.backToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">{l.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{l.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">{l.email}</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder={l.emailPlaceholder} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
          {loading ? l.sending : l.sendLink}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {l.rememberPassword}{" "}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">{l.signIn}</Link>
      </p>
    </div>
  );
}
