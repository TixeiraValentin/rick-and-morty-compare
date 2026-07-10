"use client";

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { CharacterStatus } from "@/core/entities/Character";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";

const statuses: CharacterStatus[] = ["Alive", "Dead", "unknown"];

export function useColumnFilters(column: 1 | 2) {
  const [state, setState] = useQueryStates(
    {
      name: parseAsString.withDefault(""),
      status: parseAsStringLiteral(statuses),
      species: parseAsString.withDefault(""),
    },
    {
      urlKeys: {
        name: `name${column}`,
        status: `status${column}`,
        species: `species${column}`,
      },
    },
  );

  const filters: CharacterFilters = {
    name: state.name || undefined,
    status: state.status ?? undefined,
    species: state.species || undefined,
  };

  const setFilters = (next: CharacterFilters) =>
    setState({
      name: next.name ?? "",
      status: next.status ?? null,
      species: next.species ?? "",
    });

  return { filters, setFilters };
}
