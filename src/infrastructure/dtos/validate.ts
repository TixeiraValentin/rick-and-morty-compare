import type { ZodType } from "zod";
import { ValidationError } from "@/core/errors/AppError";

export function parseOrThrow<T>(schema: ZodType<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(`Malformed response: ${context}`, { cause: result.error });
  }
  return result.data;
}
