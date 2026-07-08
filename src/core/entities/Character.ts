/**
 * A Rick & Morty character, in clean domain shape.
 *
 * The raw API returns `episode` as an array of URL strings and `status` with
 * mixed casing; those quirks die at the mapper (see infrastructure/mappers).
 * Here `episodeIds` is already numeric and `status` is a closed union.
 */
export type CharacterStatus = "Alive" | "Dead" | "unknown";

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  imageUrl: string;
  episodeIds: number[];
}
