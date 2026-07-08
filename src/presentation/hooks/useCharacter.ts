"use client";

import { skipToken, useQuery } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import { queryKeys } from "@/presentation/hooks/queryKeys";

export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: queryKeys.character(id ?? -1),
    queryFn: id === null ? skipToken : () => useCases.getCharacter().execute(id),
    staleTime: Infinity,
  });
}
