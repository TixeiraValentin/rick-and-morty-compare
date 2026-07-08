import type { Episode } from "@/core/entities/Episode";
import type { EpisodeRepository } from "@/core/repositories/EpisodeRepository";
import { fetchEpisodesByIds } from "@/infrastructure/api/episodeApi";
import { toEpisode } from "@/infrastructure/mappers/episodeMapper";

export class EpisodeRepositoryImpl implements EpisodeRepository {
  async getEpisodesByIds(ids: number[]): Promise<Episode[]> {
    const dtos = await fetchEpisodesByIds(ids);
    return dtos.map(toEpisode);
  }
}
