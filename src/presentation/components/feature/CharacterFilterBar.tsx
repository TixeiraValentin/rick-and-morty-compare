"use client";

import { useId } from "react";
import { Search, X } from "lucide-react";
import type { CharacterStatus } from "@/core/entities/Character";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { useTranslations } from "@/presentation/i18n/useTranslations";

const STATUSES: CharacterStatus[] = ["Alive", "Dead", "unknown"];
const SPECIES_SUGGESTIONS = [
  "Human",
  "Alien",
  "Humanoid",
  "Robot",
  "Animal",
  "Mythological Creature",
  "Poopybutthole",
  "Cronenberg",
  "Disease",
];

const controlClass =
  "h-9 rounded-md border border-border bg-surface px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

interface CharacterFilterBarProps {
  value: CharacterFilters;
  onChange: (filters: CharacterFilters) => void;
}

export function CharacterFilterBar({ value, onChange }: CharacterFilterBarProps) {
  const t = useTranslations();
  const speciesListId = useId();
  const hasFilters = Boolean(value.name || value.status || value.species);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-40 flex-1">
        <Search
          className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value.name ?? ""}
          onChange={(event) => onChange({ ...value, name: event.target.value || undefined })}
          placeholder={t.filters.searchPlaceholder}
          aria-label={t.filters.searchPlaceholder}
          className={`${controlClass} w-full pl-8`}
        />
      </div>

      <select
        value={value.status ?? ""}
        onChange={(event) =>
          onChange({ ...value, status: STATUSES.find((option) => option === event.target.value) })
        }
        aria-label={t.filters.status}
        className={`${controlClass} cursor-pointer`}
      >
        <option value="">{t.filters.statusAll}</option>
        {STATUSES.map((option) => (
          <option key={option} value={option}>
            {t.status[option]}
          </option>
        ))}
      </select>

      <input
        type="text"
        list={speciesListId}
        value={value.species ?? ""}
        onChange={(event) => onChange({ ...value, species: event.target.value || undefined })}
        placeholder={t.filters.speciesAll}
        aria-label={t.filters.species}
        className={`${controlClass} min-w-32 flex-1`}
      />
      <datalist id={speciesListId}>
        {SPECIES_SUGGESTIONS.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => onChange({})}
          aria-label={t.filters.clear}
          title={t.filters.clear}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
