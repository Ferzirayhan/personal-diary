"use client";

import { Language, TranslationKey, translations } from "@/lib/i18n";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type UIContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

const LANGUAGE_KEY = "ui-language";

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = window.localStorage.getItem(LANGUAGE_KEY) as Language | null;

    if (savedLang === "en" || savedLang === "id" || savedLang === "de") {
      setLanguage(savedLang);
    } else {
      const browser = navigator.language.toLowerCase();
      if (browser.startsWith("id")) setLanguage("id");
      else if (browser.startsWith("de")) setLanguage("de");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const value = useMemo<UIContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key] ?? translations.en[key],
    }),
    [language]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
