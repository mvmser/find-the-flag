// Language context for app-wide language state

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { setLanguage as setI18nLanguage } from '../i18n';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'find-the-flag-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to 'en'
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') {
      setI18nLanguage(stored);
      return stored;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setI18nLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Sync i18n on mount
  useEffect(() => {
    setI18nLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
