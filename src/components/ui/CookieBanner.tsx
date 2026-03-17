"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { t } from "@/lib/translations";

const i18n = t();

const CONSENT_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("cookie-consent-update"));
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    window.dispatchEvent(new Event("cookie-consent-update"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm text-gray-600">
          {i18n.cookie.message}{" "}
          <Link
            href="/privacy"
            className="text-indigo-600 underline hover:text-indigo-700"
          >
            {i18n.cookie.learnMore}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {i18n.cookie.decline}
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            {i18n.cookie.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
