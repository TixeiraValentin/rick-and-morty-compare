"use client";

import type { CharacterStatus } from "@/core/entities/Character";
import { useTranslations } from "@/presentation/i18n/useTranslations";
import { statusDotClassName } from "@/presentation/theme/tokens";

export function StatusDot({ status }: { status: CharacterStatus }) {
  const t = useTranslations();

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDotClassName[status]}`}
        aria-hidden="true"
      />
      {t.status[status]}
    </span>
  );
}
