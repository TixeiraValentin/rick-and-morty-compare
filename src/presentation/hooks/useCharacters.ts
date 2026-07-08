"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import { queryKeys } from "@/presentation/hooks/queryKeys";

/**
 * One paginated column. Page 1 arrives hydrated from the server; paging is
 * client-side. `keepPreviousData` avoids an empty flash while the next page loads.
 * Resolves the use case from the container — never `new` here.
 */
export function useCharacters(page: number) {
  return useQuery({
    queryKey: queryKeys.charactersPage(page),
    queryFn: () => useCases.getCharacters().execute({ page }),
    placeholderData: keepPreviousData,
  });
}
