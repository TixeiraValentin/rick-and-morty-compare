"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "@/presentation/i18n/useTranslations";

function resolveIsDark(): boolean {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark") return true;
  if (attr === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const t = useTranslations();

  const handleClick = () => {
    const next = resolveIsDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.theme.toggle}
      title={t.theme.toggle}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Sun className="theme-icon--dark h-5 w-5" aria-hidden="true" />
      <Moon className="theme-icon--light h-5 w-5" aria-hidden="true" />
    </button>
  );
}
