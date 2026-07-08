"use client";

import { Users } from "lucide-react";
import { CharacterCard } from "@/presentation/components/feature/CharacterCard";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { Pagination } from "@/presentation/components/ui/Pagination";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useCharacters } from "@/presentation/hooks/useCharacters";
import { errorMessageFor } from "@/presentation/lib/errorMessage";
import { strings } from "@/presentation/strings";

interface CharacterColumnProps {
  title: string;
  page: number;
  selectedId: number | null;
  /** The id selected in the OTHER column — disabled here to avoid self-compare. */
  disabledId: number | null;
  onSelect: (id: number) => void;
  onPageChange: (page: number) => void;
}

export function CharacterColumn({
  title,
  page,
  selectedId,
  disabledId,
  onSelect,
  onPageChange,
}: CharacterColumnProps) {
  const { data, isPending, isError, error, refetch } = useCharacters(page);

  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Users className="h-5 w-5 text-primary" aria-hidden="true" />
        {title}
      </h2>

      {isError ? (
        <ErrorState message={errorMessageFor(error)} onRetry={() => void refetch()} />
      ) : isPending ? (
        <ColumnSkeleton />
      ) : data.items.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title={strings.columns.empty} />
      ) : (
        <ul className="flex flex-col gap-2" data-testid="character-list">
          {data.items.map((character) => (
            <li key={character.id}>
              <CharacterCard
                character={character}
                selected={selectedId === character.id}
                disabled={disabledId === character.id}
                onToggle={() => onSelect(character.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {data ? (
        <Pagination
          page={page}
          totalPages={data.info.pages}
          hasPrev={page > 1}
          hasNext={page < data.info.pages}
          onPrev={() => onPageChange(page - 1)}
          onNext={() => onPageChange(page + 1)}
        />
      ) : null}
    </section>
  );
}

function ColumnSkeleton() {
  return (
    <ul className="flex flex-col gap-2" aria-hidden="true">
      {[...Array(6).keys()].map((row) => (
        <li
          key={row}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
        >
          <Skeleton className="h-14 w-14 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </li>
      ))}
    </ul>
  );
}
