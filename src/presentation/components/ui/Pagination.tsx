"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations } from "@/presentation/i18n/useTranslations";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations();
  const inputId = useId();
  const [draft, setDraft] = useState(String(page));
  const [lastPage, setLastPage] = useState(page);

  if (page !== lastPage) {
    setLastPage(page);
    setDraft(String(page));
  }

  const goTo = (value: number) => {
    const clamped = Math.min(Math.max(value, 1), totalPages);
    if (clamped !== page) onPageChange(clamped);
    setDraft(String(clamped));
  };

  const commitDraft = () => {
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(page));
      return;
    }
    goTo(parsed);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label={t.columns.previous}
        className={buttonClass}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          commitDraft();
        }}
        className="flex items-center gap-1.5 text-sm text-muted"
      >
        <label htmlFor={inputId} className="sr-only">
          {t.columns.pageInputLabel}
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
          onBlur={commitDraft}
          className="h-9 w-12 cursor-text rounded-md border border-border bg-surface text-center tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <span className="whitespace-nowrap tabular-nums">{t.columns.pageTotal(totalPages)}</span>
        <span className="sr-only" aria-live="polite">
          {t.columns.page(page, totalPages)}
        </span>
      </form>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label={t.columns.next}
        className={buttonClass}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
