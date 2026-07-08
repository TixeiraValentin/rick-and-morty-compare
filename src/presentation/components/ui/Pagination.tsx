"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { strings } from "@/presentation/strings";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const buttonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label={strings.columns.previous}
        className={buttonClass}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="text-sm text-muted tabular-nums" aria-live="polite">
        {strings.columns.page(page, totalPages)}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label={strings.columns.next}
        className={buttonClass}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
