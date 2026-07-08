import { z } from "zod";

export const CharacterStatusDtoSchema = z.enum(["Alive", "Dead", "unknown"]);

export const CharacterDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: CharacterStatusDtoSchema,
  species: z.string(),
  image: z.url(),
  episode: z.array(z.url()),
});

export type CharacterDto = z.infer<typeof CharacterDtoSchema>;
