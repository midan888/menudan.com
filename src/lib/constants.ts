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
];

export const PLAN_LIMITS = {
  free: {
    maxMenus: 1,
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

export const SUPPORTED_LANGUAGES = [
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

export const THEMES = [
  { id: 'classic', name: 'Classic', description: 'Editorial, warm, sophisticated' },
  { id: 'modern', name: 'Modern', description: 'Clean, contemporary, minimal' },
  { id: 'dark', name: 'Dark', description: 'Moody, bold, premium' },
  { id: 'bistro', name: 'Bistro', description: 'Traditional, charming, European' },
] as const;
