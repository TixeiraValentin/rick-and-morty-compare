import { z } from "zod";

export const EpisodeDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
});

export type EpisodeDto = z.infer<typeof EpisodeDtoSchema>;

export const EpisodesByIdsResponseSchema = z.union([EpisodeDtoSchema, z.array(EpisodeDtoSchema)]);
