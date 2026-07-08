import type { Character } from "@/core/entities/Character";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import type { Page } from "@/core/entities/Page";
import type { CharacterRepository } from "@/core/repositories/CharacterRepository";

export interface GetCharactersInput {
  page: number;
  filters?: CharacterFilters;
}

export class GetCharactersUseCase {
  constructor(private readonly characters: CharacterRepository) {}

  execute({ page, filters }: GetCharactersInput): Promise<Page<Character>> {
    return this.characters.getCharacters(page, filters);
  }
}
