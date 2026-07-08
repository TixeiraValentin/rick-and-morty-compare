"use client";

import { skipToken, useQuery } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import { queryKeys } from "@/presentation/hooks/queryKeys";

/**
 * Resolve a selected character by id. `skipToken` disables the query while the
 * id is null (nothing selected) and narrows `id` to a number in the queryFn —
 * no non-null assertion needed. A character's data is immutable, so it never
 * goes stale. TanStack Query dedupes this against the list cache.
 */
export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: queryKeys.character(id ?? -1),
    queryFn: id === null ? skipToken : () => useCases.getCharacter().execute(id),
    staleTime: Infinity,
  });
}
