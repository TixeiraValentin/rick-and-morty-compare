"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { useCases } from "@/infrastructure/di/container";
import { queryKeys } from "@/presentation/hooks/queryKeys";

export function useCharacters(page: number, filters?: CharacterFilters) {
  return useQuery({
    queryKey: queryKeys.charactersPage(page, filters),
    queryFn: () => useCases.getCharacters().execute({ page, filters }),
    placeholderData: keepPreviousData,
  });
}
