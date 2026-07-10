"use client";

import { ArrowLeftRight, Sparkles, Users, X } from "lucide-react";
import { CharacterColumn } from "@/presentation/components/feature/CharacterColumn";
import { EpisodeSection } from "@/presentation/components/feature/EpisodeSection";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import type { Dictionary } from "@/presentation/i18n/dictionaries";
import { useTranslations } from "@/presentation/i18n/useTranslations";
import { useCompareEpisodes } from "@/presentation/hooks/useCompareEpisodes";
import { useSelection } from "@/presentation/hooks/useSelection";
import { errorMessageFor } from "@/presentation/lib/errorMessage";

const iconButtonClass =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function CompareBoard() {
  const t = useTranslations();
  const selection = useSelection();
  const compare = useCompareEpisodes();
  const { c1, c2, p1, p2 } = selection;
  const hasAnySelection = c1 !== null || c2 !== null;

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:min-h-0 lg:flex-[1.3]">
        <CharacterColumn
          testId="column-1"
          column={1}
          title={t.columns.first}
          page={p1}
          selectedId={c1}
          disabledId={c2}
          onSelect={(id) => selection.selectFirst(c1 === id ? null : id)}
          onPageChange={selection.setPage1}
        />
        <CharacterColumn
          testId="column-2"
          column={2}
          title={t.columns.second}
          page={p2}
          selectedId={c2}
          disabledId={c1}
          onSelect={(id) => selection.selectSecond(c2 === id ? null : id)}
          onPageChange={selection.setPage2}
        />
      </div>

      <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
        {hasAnySelection ? (
          <div className="flex shrink-0 items-center justify-end gap-2">
            <button type="button" onClick={selection.swap} className={iconButtonClass}>
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
              {t.selection.swap}
            </button>
            <button type="button" onClick={selection.clear} className={iconButtonClass}>
              <X className="h-4 w-4" aria-hidden="true" />
              {t.selection.clear}
            </button>
          </div>
        ) : null}

        <div className="lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <CompareResults compare={compare} oneSelected={(c1 !== null) !== (c2 !== null)} t={t} />
        </div>
      </div>
    </div>
  );
}

function CompareResults({
  compare,
  oneSelected,
  t,
}: {
  compare: ReturnType<typeof useCompareEpisodes>;
  oneSelected: boolean;
  t: Dictionary;
}) {
  if (!compare.isEnabled) {
    return (
      <EmptyState
        icon={<Sparkles className="h-7 w-7" />}
        title={t.selection.prompt}
        description={oneSelected ? t.selection.onlyOne : undefined}
      />
    );
  }
  if (compare.error) {
    return <ErrorState message={errorMessageFor(compare.error, t)} />;
  }
  if (compare.isLoading || compare.data === undefined) {
    return <CompareSkeleton />;
  }

  const { onlyFirst, shared, onlySecond } = compare.data;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:h-full" data-testid="compare-results">
      <EpisodeSection
        title={t.compare.onlyFirst}
        hint={t.compare.onlyFirstHint}
        icon={<Users className="h-4 w-4" />}
        episodes={onlyFirst}
      />
      <EpisodeSection
        title={t.compare.shared}
        hint={t.compare.sharedHint}
        icon={<Sparkles className="h-4 w-4" />}
        episodes={shared}
      />
      <EpisodeSection
        title={t.compare.onlySecond}
        hint={t.compare.onlySecondHint}
        icon={<Users className="h-4 w-4" />}
        episodes={onlySecond}
      />
    </div>
  );
}

function CompareSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:h-full" aria-hidden="true">
      {[...Array(3).keys()].map((column) => (
        <div
          key={column}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4"
        >
          <Skeleton className="h-5 w-40" />
          {[...Array(3).keys()].map((row) => (
            <Skeleton key={row} className="h-12 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
