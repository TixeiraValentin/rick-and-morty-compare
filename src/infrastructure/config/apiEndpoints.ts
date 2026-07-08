import { env } from "@/infrastructure/config/env";

const base = env.apiBaseUrl;

/** Single source of truth for REST endpoints (Golden Rule 12). */
export const apiEndpoints = {
  characters: (page: number) => `${base}/character/?page=${page}`,
  character: (id: number) => `${base}/character/${id}`,
  // Batch endpoint: the union of episodes in ONE request (`/episode/1,2,3`).
  episodesByIds: (ids: number[]) => `${base}/episode/${ids.join(",")}`,
} as const;
