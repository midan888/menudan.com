import type { Tenant, Menu, Category, Item, Translation } from "@/types";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

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

/** Format price with currency symbol */
export function formatPrice(price: string | number, currencyCode: string): string {
  const cur = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = cur?.symbol || currencyCode;
  return `${symbol}${Number(price).toFixed(2)}`;
}

/** Format all prices from the prices map, falling back to single price+currency */
export function formatPrices(item: Item): string {
  const pricesMap = (item.prices as Record<string, string>) || {};
  const entries = Object.entries(pricesMap).filter(([, v]) => v && v.trim() !== "");
  if (entries.length > 0) {
    return entries.map(([code, val]) => formatPrice(val, code)).join(" / ");
  }
  return formatPrice(item.price, item.currency);
}
