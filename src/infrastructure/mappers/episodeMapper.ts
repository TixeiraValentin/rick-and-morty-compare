import type { Episode } from "@/core/entities/Episode";
import type { EpisodeDto } from "@/infrastructure/dtos/episodeDto";

/** DTO → Entity: rename `air_date`→`airDate` and `episode`(code)→`code`. */
export function toEpisode(dto: EpisodeDto): Episode {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.episode,
    airDate: dto.air_date,
  };
}
