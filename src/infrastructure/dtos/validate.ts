import type { ZodType } from "zod";
import { ValidationError } from "@/core/errors/AppError";

/**
 * Validate untrusted API data at the boundary. On failure, throw a typed
 * ValidationError (never let a malformed shape reach the domain / UI).
 */
export function parseOrThrow<T>(schema: ZodType<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(`Malformed response: ${context}`, { cause: result.error });
  }
  return result.data;
}
