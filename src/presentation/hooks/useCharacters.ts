"use client";

import { useEffect } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { useCases } from "@/infrastructure/di/container";
import { queryKeys } from "@/presentation/hooks/queryKeys";
import { useDebouncedValue } from "@/presentation/hooks/useDebouncedValue";

export function useCharacters(page: number, filters?: CharacterFilters) {
  const queryClient = useQueryClient();
  const debouncedPage = useDebouncedValue(page, 300);
  const debouncedName = useDebouncedValue(filters?.name ?? "", 300);
  const debouncedSpecies = useDebouncedValue(filters?.species ?? "", 300);

  const effectiveFilters: CharacterFilters = {
    name: debouncedName.trim() || undefined,
    species: debouncedSpecies.trim() || undefined,
    status: filters?.status,
  };

  const query = useQuery({
    queryKey: queryKeys.charactersPage(debouncedPage, effectiveFilters),
    queryFn: () =>
      useCases.getCharacters().execute({ page: debouncedPage, filters: effectiveFilters }),
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items;
  useEffect(() => {
    if (!items) return;
    for (const character of items) {
      queryClient.setQueryData(queryKeys.character(character.id), character);
    }
  }, [items, queryClient]);

  // The page changed but the debounced request hasn't fired yet: surface it so
  // the UI can show a loading state the instant the user paginates.
  return { ...query, isDebouncing: page !== debouncedPage };
}
