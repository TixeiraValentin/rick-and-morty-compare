/** Centralized TanStack Query keys so the RSC prefetch and the hooks agree. */
export const queryKeys = {
  charactersPage: (page: number) => ["characters", { page }] as const,
  character: (id: number) => ["character", id] as const,
  compareEpisodes: (firstId: number, secondId: number) =>
    ["compare-episodes", firstId, secondId] as const,
};
