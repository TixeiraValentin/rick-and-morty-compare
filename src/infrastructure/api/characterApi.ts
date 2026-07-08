import { z } from "zod";
import { httpGet } from "@/infrastructure/api/httpClient";
import { apiEndpoints } from "@/infrastructure/config/apiEndpoints";
import { SERVER_REVALIDATE_SECONDS } from "@/infrastructure/config/cache";
import { CharacterDtoSchema, type CharacterDto } from "@/infrastructure/dtos/characterDto";
import { paginatedDtoSchema } from "@/infrastructure/dtos/paginatedDto";
import { parseOrThrow } from "@/infrastructure/dtos/validate";

const CharactersPageSchema = paginatedDtoSchema(CharacterDtoSchema);
export type CharactersPageDto = z.infer<typeof CharactersPageSchema>;

/** Api step of the chain: HTTP + Zod validation, returning DTOs. */
export async function fetchCharactersPage(page: number): Promise<CharactersPageDto> {
  const raw = await httpGet(apiEndpoints.characters(page), {
    revalidate: SERVER_REVALIDATE_SECONDS,
  });
  return parseOrThrow(CharactersPageSchema, raw, `characters page ${page}`);
}

export async function fetchCharacterById(id: number): Promise<CharacterDto> {
  const raw = await httpGet(apiEndpoints.character(id), {
    revalidate: SERVER_REVALIDATE_SECONDS,
  });
  return parseOrThrow(CharacterDtoSchema, raw, `character ${id}`);
}
