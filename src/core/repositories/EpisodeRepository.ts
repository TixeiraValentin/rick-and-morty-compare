import type { Episode } from "@/core/entities/Episode";

export interface EpisodeRepository {
  getEpisodesByIds(ids: number[]): Promise<Episode[]>;
}
