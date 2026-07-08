import type { CharacterRepository } from "@/core/repositories/CharacterRepository";
import type { EpisodeRepository } from "@/core/repositories/EpisodeRepository";
import { GetCharacterUseCase } from "@/core/useCases/characters/GetCharacterUseCase";
import { GetCharactersUseCase } from "@/core/useCases/characters/GetCharactersUseCase";
import { CompareEpisodesUseCase } from "@/core/useCases/episodes/CompareEpisodesUseCase";
import { CharacterRepositoryImpl } from "@/infrastructure/repositories/CharacterRepositoryImpl";
import { EpisodeRepositoryImpl } from "@/infrastructure/repositories/EpisodeRepositoryImpl";

/**
 * The ONE composition root (Golden Rule 4). The only file with `new`.
 * Stateless factories, so the same wiring runs on the server (RSC prefetch)
 * and on the client (hooks). Hooks/RSC resolve from `useCases` — never `new`.
 */
const characterRepository: CharacterRepository = new CharacterRepositoryImpl();
const episodeRepository: EpisodeRepository = new EpisodeRepositoryImpl();

export const useCases = {
  getCharacters: () => new GetCharactersUseCase(characterRepository),
  getCharacter: () => new GetCharacterUseCase(characterRepository),
  compareEpisodes: () => new CompareEpisodesUseCase(episodeRepository),
} as const;
