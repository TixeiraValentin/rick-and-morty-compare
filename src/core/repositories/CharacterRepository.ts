import type { Character } from "@/core/entities/Character";
import type { Page } from "@/core/entities/Page";

/** Port: how the domain reads characters. Impl lives in infrastructure. */
export interface CharacterRepository {
  getCharacters(page: number): Promise<Page<Character>>;
  getCharacterById(id: number): Promise<Character>;
}
