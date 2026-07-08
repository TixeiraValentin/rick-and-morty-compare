import type { Character } from "@/core/entities/Character";
import type { Page } from "@/core/entities/Page";
import type { CharacterRepository } from "@/core/repositories/CharacterRepository";

export interface GetCharactersInput {
  page: number;
}

/** One paginated column read, through the data chain. Consumed by useCharacters + RSC prefetch. */
export class GetCharactersUseCase {
  constructor(private readonly characters: CharacterRepository) {}

  execute({ page }: GetCharactersInput): Promise<Page<Character>> {
    return this.characters.getCharacters(page);
  }
}
