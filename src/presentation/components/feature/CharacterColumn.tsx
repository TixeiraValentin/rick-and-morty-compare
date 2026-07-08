"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { CharacterCard } from "@/presentation/components/feature/CharacterCard";
import { CharacterFilterBar } from "@/presentation/components/feature/CharacterFilterBar";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { Pagination } from "@/presentation/components/ui/Pagination";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useCharacters } from "@/presentation/hooks/useCharacters";
import { useTranslations } from "@/presentation/i18n/useTranslations";
import { errorMessageFor } from "@/presentation/lib/errorMessage";

interface CharacterColumnProps {
  title: string;
  testId: string;
  page: number;
  selectedId: number | null;
  disabledId: number | null;
  onSelect: (id: number) => void;
  onPageChange: (page: number) => void;
}

export function CharacterColumn({
  title,
  testId,
  page,
  selectedId,
  disabledId,
  onSelect,
  onPageChange,
}: CharacterColumnProps) {
  const t = useTranslations();
  const [filters, setFilters] = useState<CharacterFilters>({});
  const { data, isPending, isError, error, refetch } = useCharacters(page, filters);

  const handleFilters = (next: CharacterFilters) => {
    setFilters(next);
    onPageChange(1);
  };

  return (
    <section
      aria-label={title}
      data-testid={testId}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-3 lg:min-h-0"
    >
      <div className="flex shrink-0 flex-col gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          {title}
        </h2>
        <CharacterFilterBar value={filters} onChange={handleFilters} />
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {isError ? (
          <ErrorState message={errorMessageFor(error, t)} onRetry={() => void refetch()} />
        ) : isPending ? (
          <ColumnSkeleton />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Users className="h-6 w-6" />} title={t.columns.empty} />
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="character-list">
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
      </div>

      {data && data.info.pages > 0 ? (
        <div className="shrink-0">
          <Pagination
            page={page}
            totalPages={data.info.pages}
            hasPrev={page > 1}
            hasNext={page < data.info.pages}
            onPrev={() => onPageChange(page - 1)}
            onNext={() => onPageChange(page + 1)}
          />
        </div>
      ) : null}
    </section>
  );
}

function ColumnSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-hidden="true">
      {[...Array(6).keys()].map((row) => (
        <li
          key={row}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5"
        >
          <Skeleton className="h-13 w-13 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </li>
      ))}
    </ul>
  );
}
