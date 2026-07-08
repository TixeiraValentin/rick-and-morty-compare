import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { env } from "@/infrastructure/config/env";

const base = env.apiBaseUrl;

export const apiEndpoints = {
  characters: (page: number, filters?: CharacterFilters) => {
    const params = new URLSearchParams({ page: String(page) });
    if (filters?.name) params.set("name", filters.name);
    if (filters?.species) params.set("species", filters.species);
    if (filters?.status) params.set("status", filters.status);
    return `${base}/character/?${params.toString()}`;
  },
  character: (id: number) => `${base}/character/${id}`,
  episodesByIds: (ids: number[]) => `${base}/episode/${ids.join(",")}`,
} as const;
