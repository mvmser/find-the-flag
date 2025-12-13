// Simple i18n implementation

import { Language } from '../types';
import { en, TranslationKeys } from './en';
import { fr } from './fr';

const translations: Record<Language, TranslationKeys> = {
  en,
  fr,
};

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<TranslationKeys>;

export function t(key: TranslationKey, language: Language): string {
  const keys = key.split('.');
  let value: unknown = translations[language];

  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
      break;
    }
  }
  return typeof value === 'string' ? value : key;
}

export type { Language };
