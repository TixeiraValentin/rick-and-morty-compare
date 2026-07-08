"use client";

import { skipToken, useQuery } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import { queryKeys } from "@/presentation/hooks/queryKeys";
import { useCharacter } from "@/presentation/hooks/useCharacter";
import { useSelection } from "@/presentation/hooks/useSelection";

/**
 * The comparison, gated at the DATA layer (the required validation): the query
 * only runs once both characters are resolved — which only happens once both
 * are selected in the URL. Not a CSS `display:none`.
 *
 * Resolves both selected characters, then runs CompareEpisodesUseCase (one
 * batched episode request + pure partition).
 */
export function useCompareEpisodes() {
  const { c1, c2 } = useSelection();
  const firstQuery = useCharacter(c1);
  const secondQuery = useCharacter(c2);

  const first = firstQuery.data;
  const second = secondQuery.data;

  const comparison = useQuery({
    queryKey: queryKeys.compareEpisodes(c1 ?? -1, c2 ?? -1),
    queryFn:
      first !== undefined && second !== undefined
        ? () => useCases.compareEpisodes().execute({ first, second })
        : skipToken,
    staleTime: Infinity,
  });

  return {
    /** Both characters selected in the URL — drives whether the sections show. */
    isEnabled: c1 !== null && c2 !== null,
    isLoading: firstQuery.isLoading || secondQuery.isLoading || comparison.isLoading,
    error: firstQuery.error ?? secondQuery.error ?? comparison.error,
    data: comparison.data,
    first,
    second,
  };
}
