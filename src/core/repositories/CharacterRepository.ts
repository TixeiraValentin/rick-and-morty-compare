import type { Character } from "@/core/entities/Character";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import type { Page } from "@/core/entities/Page";

export interface CharacterRepository {
  getCharacters(page: number, filters?: CharacterFilters): Promise<Page<Character>>;
  getCharacterById(id: number): Promise<Character>;
}
