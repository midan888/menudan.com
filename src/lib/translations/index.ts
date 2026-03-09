import { getLocale } from '@/lib/locale';
import en from './en';
import ru from './ru';
import type { Translations } from './en';

const translations: Record<string, Translations> = { en, ru };

export function t(): Translations {
  return translations[getLocale()] || en;
}

export type { Translations };
export { en, ru };
