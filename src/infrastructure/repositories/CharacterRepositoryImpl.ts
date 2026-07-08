import type { Character } from "@/core/entities/Character";
import type { Page } from "@/core/entities/Page";
import type { CharacterRepository } from "@/core/repositories/CharacterRepository";
import { fetchCharacterById, fetchCharactersPage } from "@/infrastructure/api/characterApi";
import { toCharacter } from "@/infrastructure/mappers/characterMapper";

export class CharacterRepositoryImpl implements CharacterRepository {
  async getCharacters(page: number): Promise<Page<Character>> {
    const dto = await fetchCharactersPage(page);
    return {
      items: dto.results.map(toCharacter),
      info: {
        count: dto.info.count,
        pages: dto.info.pages,
        currentPage: page,
        hasNext: dto.info.next !== null,
        hasPrev: dto.info.prev !== null,
      },
    };
  }

  async getCharacterById(id: number): Promise<Character> {
    return toCharacter(await fetchCharacterById(id));
  }
}
