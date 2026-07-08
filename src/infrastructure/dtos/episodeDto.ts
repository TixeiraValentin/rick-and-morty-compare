import { z } from "zod";

export const EpisodeDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
});

export type EpisodeDto = z.infer<typeof EpisodeDtoSchema>;

/**
 * The batch endpoint returns a single object for one id and an array for many.
 * We accept both and normalize to an array in the api layer.
 */
export const EpisodesByIdsResponseSchema = z.union([
  EpisodeDtoSchema,
  z.array(EpisodeDtoSchema),
]);
