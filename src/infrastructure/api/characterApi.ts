import { z } from "zod";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { NotFoundError } from "@/core/errors/AppError";
import { httpGet } from "@/infrastructure/api/httpClient";
import { apiEndpoints } from "@/infrastructure/config/apiEndpoints";
import { SERVER_REVALIDATE_SECONDS } from "@/infrastructure/config/cache";
import { CharacterDtoSchema, type CharacterDto } from "@/infrastructure/dtos/characterDto";
import { paginatedDtoSchema } from "@/infrastructure/dtos/paginatedDto";
import { parseOrThrow } from "@/infrastructure/dtos/validate";

const CharactersPageSchema = paginatedDtoSchema(CharacterDtoSchema);
export type CharactersPageDto = z.infer<typeof CharactersPageSchema>;

const EMPTY_PAGE: CharactersPageDto = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
};

export async function fetchCharactersPage(
  page: number,
  filters?: CharacterFilters,
): Promise<CharactersPageDto> {
  try {
    const raw = await httpGet(apiEndpoints.characters(page, filters), {
      revalidate: SERVER_REVALIDATE_SECONDS,
    });
    return parseOrThrow(CharactersPageSchema, raw, `characters page ${page}`);
  } catch (error) {
    if (error instanceof NotFoundError) return EMPTY_PAGE;
    throw error;
  }
}

export async function fetchCharacterById(id: number): Promise<CharacterDto> {
  const raw = await httpGet(apiEndpoints.character(id), {
    revalidate: SERVER_REVALIDATE_SECONDS,
  });
  return parseOrThrow(CharacterDtoSchema, raw, `character ${id}`);
}
