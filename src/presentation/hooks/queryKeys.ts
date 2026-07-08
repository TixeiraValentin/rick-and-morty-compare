import type { CharacterFilters } from "@/core/entities/CharacterFilters";

export const queryKeys = {
  charactersPage: (page: number, filters?: CharacterFilters) =>
    [
      "characters",
      {
        page,
        name: filters?.name ?? "",
        species: filters?.species ?? "",
        status: filters?.status ?? "",
      },
    ] as const,
  character: (id: number) => ["character", id] as const,
  compareEpisodes: (firstId: number, secondId: number) =>
    ["compare-episodes", firstId, secondId] as const,
};
