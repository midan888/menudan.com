# Currency Management Feature — Implementation Plan

## Overview
Add a "Currencies" section to Settings where the user can set a default currency and add additional currencies. When creating/editing menu items, the currency dropdown only shows the currencies the tenant has enabled.

## Current State
- Items already have a per-item `currency` field in DB (varchar 3, default 'USD')
- ItemFormModal has a hardcoded currency dropdown (USD, EUR, GBP, AMD, RUB, CAD, AUD)
- Tenants table has no currency-related fields
- Themes display currency as `{item.currency} {price}`

## Changes

### 1. Add `SUPPORTED_CURRENCIES` constant to `src/lib/constants.ts`
- Add a comprehensive list of currencies with code, name, and symbol
- e.g. `{ code: 'USD', name: 'US Dollar', symbol: '$' }`, `{ code: 'EUR', name: 'Euro', symbol: '€' }`, etc.
- Include all 7 currently hardcoded + more common ones

### 2. DB Schema — Add currency fields to `tenants` table (`src/lib/db/schema.ts`)
- `defaultCurrency: varchar('default_currency', { length: 3 }).notNull().default('USD')` — the default currency for new items
- `enabledCurrencies: jsonb('enabled_currencies').default(['USD'])` — array of enabled currency codes

### 3. Generate and run DB migration
- `npm run db:generate` then `npm run db:migrate`

### 4. Update Settings API (`src/app/api/settings/route.ts`)
- Add `"defaultCurrency"` and `"enabledCurrencies"` to the `editableKeys` array

### 5. Update SettingsForm (`src/components/dashboard/SettingsForm.tsx`)
- Add a "Currencies" section (after Default Language)
- Show a multi-select of all supported currencies (toggle chips, similar to badges/allergens pattern)
- Add a "Default Currency" dropdown that only shows currencies from the enabled list
- When enabling/disabling currencies, ensure the default currency is always enabled
- Save both `defaultCurrency` and `enabledCurrencies` in the PATCH call

### 6. Update ItemFormModal (`src/components/dashboard/ItemFormModal.tsx`)
- Accept `enabledCurrencies` and `defaultCurrency` as props
- Replace the hardcoded currency `<select>` options with the tenant's enabled currencies
- When adding a new item (no `item` prop), default currency to `defaultCurrency`
- Import `SUPPORTED_CURRENCIES` for display names

### 7. Pass tenant currency data through MenuBuilder
- Update `MenuBuilder` to accept and pass `enabledCurrencies` and `defaultCurrency` props
- Update the dashboard menu page (`src/app/(dashboard)/menu/page.tsx`) to pass tenant data down

### 8. Update theme components for currency symbol display
- Update all 4 themes (ClassicTheme, ModernTheme, DarkTheme, BistroTheme) to show the currency symbol instead of the 3-letter code when displaying prices
- Look up the symbol from the `SUPPORTED_CURRENCIES` constant using the item's currency code
- Display as `$12.50` instead of `USD 12.50`

## Files Modified
1. `src/lib/constants.ts` — add SUPPORTED_CURRENCIES
2. `src/lib/db/schema.ts` — add defaultCurrency, enabledCurrencies to tenants
3. `src/app/api/settings/route.ts` — add to editableKeys
4. `src/components/dashboard/SettingsForm.tsx` — add Currencies section
5. `src/components/dashboard/ItemFormModal.tsx` — use enabled currencies + default
6. `src/components/dashboard/MenuBuilder.tsx` — pass currency props
7. `src/app/(dashboard)/menu/page.tsx` — pass tenant currency data
8. `src/components/menu/themes/ClassicTheme.tsx` — symbol display
9. `src/components/menu/themes/ModernTheme.tsx` — symbol display
10. `src/components/menu/themes/DarkTheme.tsx` — symbol display
11. `src/components/menu/themes/BistroTheme.tsx` — symbol display
12. New migration file (auto-generated)
