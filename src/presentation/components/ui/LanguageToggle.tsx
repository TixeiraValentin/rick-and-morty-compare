"use client";

import { locales } from "@/presentation/i18n/dictionaries";
import { useLocale, useTranslations } from "@/presentation/i18n/useTranslations";

export function LanguageToggle() {
  const [locale, setLocale] = useLocale();
  const t = useTranslations();

  return (
    <div
      role="group"
      aria-label={t.language.toggle}
      className="inline-flex h-9 items-center gap-0.5 rounded-md border border-border bg-surface p-1"
    >
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={`h-7 cursor-pointer rounded px-2 text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            locale === option
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
