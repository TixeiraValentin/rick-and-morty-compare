import { isAppError } from "@/core/errors/AppError";
import { strings } from "@/presentation/strings";

/** Map any thrown value to friendly copy via its typed `kind` (Golden Rule 11). */
export function errorMessageFor(error: unknown): string {
  if (isAppError(error)) return strings.errors[error.kind];
  return strings.errors.unknown;
}
