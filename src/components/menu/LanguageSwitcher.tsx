"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguageSwitcherProps {
  enabledLanguages: string[];
  currentLanguage: string;
  currentMenuId: string | null;
}

export function LanguageSwitcher({
  enabledLanguages,
  currentLanguage,
  currentMenuId,
}: LanguageSwitcherProps) {
  if (enabledLanguages.length <= 1) return null;

  const languages = SUPPORTED_LANGUAGES.filter((l) =>
    enabledLanguages.includes(l.code)
  );

  return (
    <div className="flex justify-center gap-2 px-6 py-3">
      {languages.map((lang) => (
        <a
          key={lang.code}
          href={`?${currentMenuId ? `menu=${currentMenuId}&` : ""}lang=${lang.code}`}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity ${
            lang.code === currentLanguage
              ? "bg-black/10 opacity-100"
              : "opacity-40 hover:opacity-70"
          }`}
        >
          {lang.nativeName}
        </a>
      ))}
    </div>
  );
}
