export const RESERVED_SLUGS = [
  'app',
  'api',
  'admin',
  'dashboard',
  'login',
  'register',
  'settings',
  'www',
  'menu',
  'help',
  'support',
  'pricing',
  'about',
  'privacy',
];

export const PLAN_LIMITS = {
  free: {
    maxMenus: 3,
    maxItemImages: 20,
    maxAiUploads: 1,
    customDomain: false,
    removeBranding: false,
  },
  pro: {
    maxMenus: 5,
    maxItemImages: 200,
    maxAiUploads: Infinity,
    customDomain: true,
    removeBranding: true,
  },
  business: {
    maxMenus: Infinity,
    maxItemImages: Infinity,
    maxAiUploads: Infinity,
    customDomain: true,
    removeBranding: true,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

import { isRussian } from '@/lib/locale';

const ALL_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
] as const;

const RU_LANGUAGES = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
] as const;

export const SUPPORTED_LANGUAGES = isRussian() ? RU_LANGUAGES : ALL_LANGUAGES;

export const BADGES = [
  'vegan',
  'vegetarian',
  'gluten-free',
  'spicy',
  'new',
  'chef_pick',
  'popular',
] as const;

export const ALLERGENS = [
  'gluten',
  'dairy',
  'nuts',
  'eggs',
  'soy',
  'fish',
  'shellfish',
] as const;

const ALL_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
] as const;

const RU_CURRENCIES = [
  { code: 'RUB', name: 'Российский рубль', symbol: '₽' },
] as const;

export const SUPPORTED_CURRENCIES = isRussian() ? RU_CURRENCIES : ALL_CURRENCIES;

export const THEMES = [
  { id: 'classic', name: 'Classic', description: 'Editorial, warm, sophisticated' },
  { id: 'modern', name: 'Modern', description: 'Clean, contemporary, minimal' },
  { id: 'dark', name: 'Dark', description: 'Moody, bold, premium' },
  { id: 'bistro', name: 'Bistro', description: 'Traditional, charming, European' },
  { id: 'nordic', name: 'Nordic', description: 'Minimalist, Scandinavian, airy' },
  { id: 'neon', name: 'Neon', description: 'Electric, cyberpunk, bold' },
  { id: 'rustic', name: 'Rustic', description: 'Warm, farmhouse, handcrafted' },
  { id: 'zen', name: 'Zen', description: 'Japanese-inspired, calm, refined' },
  { id: 'luxe', name: 'Luxe', description: 'Ultra-premium, black & gold' },
  { id: 'vibra', name: 'Vibra', description: 'Vibrant, street food, bold & fun' },
] as const;
