/**
 * A Rick & Morty episode, in clean domain shape.
 * `code` is the API's `episode` field (e.g. "S01E01"); `airDate` is `air_date`.
 */
export interface Episode {
  id: number;
  name: string;
  code: string;
  airDate: string;
}
