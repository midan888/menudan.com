import type { Tenant, Menu, Category, Item, Translation } from "@/types";

export interface ThemeProps {
  tenant: Tenant;
  menus: Menu[];
  categories: Category[];
  items: Item[];
  translations: Translation[];
  currentLanguage: string;
  currentMenuId: string | null;
}

/** Get translated value or fallback to original */
export function t(
  translations: Translation[],
  entityType: string,
  entityId: string,
  field: string,
  fallback: string,
  language: string
): string {
  if (language === "en") return fallback;
  const trans = translations.find(
    (tr) =>
      tr.entityType === entityType &&
      tr.entityId === entityId &&
      tr.field === field &&
      tr.language === language
  );
  return trans?.value || fallback;
}
