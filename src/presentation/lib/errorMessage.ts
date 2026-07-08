import { isAppError } from "@/core/errors/AppError";
import type { Dictionary } from "@/presentation/i18n/dictionaries";

export function errorMessageFor(error: unknown, t: Dictionary): string {
  if (isAppError(error)) return t.errors[error.kind];
  return t.errors.unknown;
}
