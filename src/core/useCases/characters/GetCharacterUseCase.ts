import type { Character } from "@/core/entities/Character";
import type { CharacterRepository } from "@/core/repositories/CharacterRepository";

export class GetCharacterUseCase {
  constructor(private readonly characters: CharacterRepository) {}

  execute(id: number): Promise<Character> {
    return this.characters.getCharacterById(id);
  }
}
