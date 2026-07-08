"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useTranslations } from "@/presentation/i18n/useTranslations";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const t = useTranslations();

  return (
    <div
      role="alert"
      className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-6 py-10 text-center"
    >
      <TriangleAlert className="h-6 w-6 text-danger" aria-hidden="true" />
      <p className="text-sm text-foreground">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.errors.retry}
        </button>
      ) : null}
    </div>
  );
}
