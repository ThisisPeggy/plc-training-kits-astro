import { type Lang, defaultLang, languages } from './config';
import { en } from './translations/en';
import { zh } from './translations/zh';
import { ru } from './translations/ru';
import { fr } from './translations/fr';
import { es } from './translations/es';
import { ar } from './translations/ar';

const translations: Record<Lang, Record<string, any>> = { en, zh, ru, fr, es, ar };

function getNestedValue(obj: Record<string, any>, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) as string ?? path;
}

export function t(lang: Lang, key: string): string {
  return getNestedValue(translations[lang], key) || getNestedValue(translations[defaultLang], key) || key;
}

export function getLocalizedPath(lang: Lang, path: string = '/'): string {
  const cleanPath = path.replace(/^\/(en|zh|ru|fr|es|ar)/, '');
  return `/${lang}${cleanPath || '/'}`;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getDir(lang: Lang): 'ltr' | 'rtl' {
  return languages[lang].dir;
}
