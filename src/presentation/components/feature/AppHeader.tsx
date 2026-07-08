"use client";

import { LanguageToggle } from "@/presentation/components/ui/LanguageToggle";
import { ThemeToggle } from "@/presentation/components/ui/ThemeToggle";
import { useTranslations } from "@/presentation/i18n/useTranslations";

export function AppHeader() {
  const t = useTranslations();

  return (
    <header className="mb-4 flex shrink-0 items-start justify-between gap-4">
      <div>
        <h1 className="text-lg font-black tracking-tight text-foreground sm:text-2xl">
          {t.app.title}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-muted">{t.app.tagline}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
