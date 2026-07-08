"use client";

import { Moon, Sun } from "lucide-react";
import { strings } from "@/presentation/strings";

/**
 * Theme toggle without hydration hazards: the effective theme is read from the
 * DOM at click time (no React state, so nothing to mismatch on hydration), and
 * which icon shows is decided purely in CSS from `<html data-theme>` +
 * prefers-color-scheme (see globals.css). Respects the system default until the
 * user opts in; the choice persists in localStorage via the no-FOUC script.
 */
function resolveIsDark(): boolean {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark") return true;
  if (attr === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const handleClick = () => {
    const next = resolveIsDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Ignore storage failures (private mode, disabled cookies, …).
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={strings.theme.toggle}
      title={strings.theme.toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Sun className="theme-icon--dark h-5 w-5" aria-hidden="true" />
      <Moon className="theme-icon--light h-5 w-5" aria-hidden="true" />
    </button>
  );
}
