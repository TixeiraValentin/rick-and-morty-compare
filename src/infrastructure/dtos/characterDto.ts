import { z } from "zod";

/** RM status casing is fixed to these three values; anything else is a bug we want to catch. */
export const CharacterStatusDtoSchema = z.enum(["Alive", "Dead", "unknown"]);

/**
 * Only the fields the app consumes. `z.object` strips the rest, so schema drift
 * in unused fields (origin, location, …) won't break us. `episode` is an array
 * of URL strings — the mapper turns it into numeric ids.
 */
export const CharacterDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: CharacterStatusDtoSchema,
  species: z.string(),
  image: z.url(),
  episode: z.array(z.url()),
});

export type CharacterDto = z.infer<typeof CharacterDtoSchema>;
