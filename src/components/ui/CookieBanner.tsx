"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { t } from "@/lib/translations";

const i18n = t();

const STORAGE_KEY = "cookie-notice-dismissed";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          {i18n.cookie.message}{" "}
          <Link href="/privacy" className="text-indigo-600 underline hover:text-indigo-700">
            {i18n.cookie.learnMore}
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          {i18n.cookie.gotIt}
        </button>
      </div>
    </div>
  );
}
