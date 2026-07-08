import { z, type ZodType } from "zod";

export const PageInfoDtoSchema = z.object({
  count: z.number(),
  pages: z.number(),
  next: z.string().nullable(),
  prev: z.string().nullable(),
});

export function paginatedDtoSchema<T>(item: ZodType<T>) {
  return z.object({
    info: PageInfoDtoSchema,
    results: z.array(item),
  });
}
