import type { Character } from "@/core/entities/Character";
import type { CharacterDto } from "@/infrastructure/dtos/characterDto";

const EPISODE_ID_REGEX = /\/episode\/(\d+)/;

function parseEpisodeId(url: string): number | null {
  const match = EPISODE_ID_REGEX.exec(url);
  return match ? Number(match[1]) : null;
}

export function toCharacter(dto: CharacterDto): Character {
  return {
    id: dto.id,
    name: dto.name,
    status: dto.status,
    species: dto.species,
    imageUrl: dto.image,
    episodeIds: dto.episode.map(parseEpisodeId).filter((id): id is number => id !== null),
  };
}
