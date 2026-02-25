"use client";

import * as React from "react";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

export type Language = "en" | "es";

export type Direction = "ltr" | "rtl";

export type Translations<
  T extends Record<string, string> = Record<string, string>
> = Record<
  Language,
  {
    dir: Direction;
    locale?: string;
    values: T;
  }
>;

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
] as const;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: {
  children: React.ReactNode;
  defaultLanguage?: Language;
}) {
  const [language, setLanguage] = React.useState<Language>(defaultLanguage);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = React.useContext(LanguageContext);
  return context;
}

export function useTranslation<T extends Record<string, string>>(
  translations: Translations<T>,
  defaultLanguage: Language = "en"
) {
  const context = useLanguageContext();
  const [localLanguage, setLocalLanguage] =
    React.useState<Language>(defaultLanguage);

  const language = context?.language ?? localLanguage;

  const setLanguage = context?.setLanguage ?? setLocalLanguage;
  console.log(language);
  const { dir, locale, values: t } = translations[language];

  return { language, setLanguage, dir, locale, t };
}

export interface LanguageSelectorProps {
  value: Language;
  onValueChange: (value: Language) => void;
}

export function LanguageSelector({
  value,
  onValueChange,
  className,
}: LanguageSelectorProps & {
  className?: string;
}) {
  return (
    <ToggleGroup
      type="single"
      className={className}
      value={value}
      onValueChange={(val) => {
        if (!val) return;
        onValueChange(val as Language);
      }}
      dir="ltr"
    >
      {languageOptions.map((lang) => (
        <ToggleGroupItem
          variant="outline"
          size="sm"
          key={lang.value}
          value={lang.value}
          data-name="language-selector"
          className="uppercase text-xs font-medium"
        >
          {lang.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
