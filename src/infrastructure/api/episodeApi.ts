import { httpGet } from "@/infrastructure/api/httpClient";
import { apiEndpoints } from "@/infrastructure/config/apiEndpoints";
import { SERVER_REVALIDATE_SECONDS } from "@/infrastructure/config/cache";
import { EpisodesByIdsResponseSchema, type EpisodeDto } from "@/infrastructure/dtos/episodeDto";
import { parseOrThrow } from "@/infrastructure/dtos/validate";

export async function fetchEpisodesByIds(ids: number[]): Promise<EpisodeDto[]> {
  if (ids.length === 0) return [];
  const raw = await httpGet(apiEndpoints.episodesByIds(ids), {
    revalidate: SERVER_REVALIDATE_SECONDS,
  });
  const parsed = parseOrThrow(EpisodesByIdsResponseSchema, raw, `episodes ${ids.join(",")}`);
  return Array.isArray(parsed) ? parsed : [parsed];
}
