"use client";

import { Sparkles, Users } from "lucide-react";
import { CharacterColumn } from "@/presentation/components/feature/CharacterColumn";
import { EpisodeSection } from "@/presentation/components/feature/EpisodeSection";
import { SelectionBar } from "@/presentation/components/feature/SelectionBar";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useCompareEpisodes } from "@/presentation/hooks/useCompareEpisodes";
import { useSelection } from "@/presentation/hooks/useSelection";
import { errorMessageFor } from "@/presentation/lib/errorMessage";
import { strings } from "@/presentation/strings";

/** The client board: two columns, the selection bar, and the gated comparison. */
export function CompareBoard() {
  const selection = useSelection();
  const compare = useCompareEpisodes();
  const { c1, c2, p1, p2 } = selection;

  return (
    <div className="flex flex-col gap-8">
      <SelectionBar
        first={compare.first}
        second={compare.second}
        onSwap={selection.swap}
        onClear={selection.clear}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CharacterColumn
          title={strings.columns.first}
          page={p1}
          selectedId={c1}
          disabledId={c2}
          onSelect={(id) => selection.selectFirst(c1 === id ? null : id)}
          onPageChange={selection.setPage1}
        />
        <CharacterColumn
          title={strings.columns.second}
          page={p2}
          selectedId={c2}
          disabledId={c1}
          onSelect={(id) => selection.selectSecond(c2 === id ? null : id)}
          onPageChange={selection.setPage2}
        />
      </div>

      <CompareResults compare={compare} oneSelected={(c1 !== null) !== (c2 !== null)} />
    </div>
  );
}

function CompareResults({
  compare,
  oneSelected,
}: {
  compare: ReturnType<typeof useCompareEpisodes>;
  oneSelected: boolean;
}) {
  // The required validation: no sections until BOTH are selected.
  if (!compare.isEnabled) {
    return (
      <EmptyState
        icon={<Sparkles className="h-7 w-7" />}
        title={strings.selection.prompt}
        description={oneSelected ? strings.selection.onlyOne : undefined}
      />
    );
  }
  if (compare.error) {
    return <ErrorState message={errorMessageFor(compare.error)} />;
  }
  if (compare.isLoading || compare.data === undefined) {
    return <CompareSkeleton />;
  }

  const { onlyFirst, shared, onlySecond } = compare.data;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3" data-testid="compare-results">
      <EpisodeSection
        title={strings.compare.onlyFirst}
        hint={strings.compare.onlyFirstHint}
        icon={<Users className="h-4 w-4" />}
        episodes={onlyFirst}
      />
      <EpisodeSection
        title={strings.compare.shared}
        hint={strings.compare.sharedHint}
        icon={<Sparkles className="h-4 w-4" />}
        episodes={shared}
      />
      <EpisodeSection
        title={strings.compare.onlySecond}
        hint={strings.compare.onlySecondHint}
        icon={<Users className="h-4 w-4" />}
        episodes={onlySecond}
      />
    </div>
  );
}

function CompareSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-hidden="true">
      {[...Array(3).keys()].map((col) => (
        <div
          key={col}
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
