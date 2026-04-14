export const languages = {
  en: { label: 'English', flag: '🇬🇧', dir: 'ltr' as const },
  zh: { label: '中文', flag: '🇨🇳', dir: 'ltr' as const },
  ru: { label: 'Русский', flag: '🇷🇺', dir: 'ltr' as const },
  fr: { label: 'Français', flag: '🇫🇷', dir: 'ltr' as const },
  es: { label: 'Español', flag: '🇪🇸', dir: 'ltr' as const },
  ar: { label: 'العربية', flag: '🇸🇦', dir: 'rtl' as const },
};

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const locales = Object.keys(languages) as Lang[];
