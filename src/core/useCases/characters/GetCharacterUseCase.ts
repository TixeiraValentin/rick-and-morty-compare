import type { Character } from "@/core/entities/Character";
import type { CharacterRepository } from "@/core/repositories/CharacterRepository";

/**
 * Resolve a single character by id. Consumed by useCharacter to turn a URL
 * selection (?c1=/?c2=) into a Character even on a cold deep-link, so the
 * comparison works without the card being on the visible page.
 */
export class GetCharacterUseCase {
  constructor(private readonly characters: CharacterRepository) {}

  execute(id: number): Promise<Character> {
    return this.characters.getCharacterById(id);
  }
}
