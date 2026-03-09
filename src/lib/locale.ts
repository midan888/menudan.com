export type Locale = 'en' | 'ru';

export function getLocale(): Locale {
  const locale = process.env.NEXT_PUBLIC_LOCALE;
  if (locale === 'ru') return 'ru';
  return 'en';
}

export function isRussian(): boolean {
  return getLocale() === 'ru';
}
