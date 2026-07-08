import type { Episode } from "@/core/entities/Episode";

/**
 * Port: how the domain reads episodes. The impl fetches the whole set in ONE
 * batched request (`/episode/1,2,3`) — see infrastructure.
 */
export interface EpisodeRepository {
  getEpisodesByIds(ids: number[]): Promise<Episode[]>;
}
