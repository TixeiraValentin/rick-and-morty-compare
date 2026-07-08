import { z, type ZodType } from "zod";

/** The `info` block of any Rick & Morty paginated response. */
export const PageInfoDtoSchema = z.object({
  count: z.number(),
  pages: z.number(),
  next: z.string().nullable(),
  prev: z.string().nullable(),
});

/** A paginated envelope around any item schema: `{ info, results }`. */
export function paginatedDtoSchema<T>(item: ZodType<T>) {
  return z.object({
    info: PageInfoDtoSchema,
    results: z.array(item),
  });
}
