/**
 * Typed domain errors. Use cases throw these instead of collapsing failures
 * into `undefined`/`null` (Golden Rule 11), so the UI can tell an empty result
 * (no episodes) from a real failure (network / 404 / rate-limit) and map
 * `kind` to a friendly message.
 */
export type AppErrorKind = "network" | "notFound" | "validation" | "rateLimit" | "unknown";

export abstract class AppError extends Error {
  abstract readonly kind: AppErrorKind;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    // Keep the concrete class name (NetworkError, …) on the instance.
    this.name = new.target.name;
  }
}

/** The request never completed (offline, timeout, DNS, aborted). */
export class NetworkError extends AppError {
  readonly kind = "network";
}

/** The API responded 404 — the character/episode does not exist. */
export class NotFoundError extends AppError {
  readonly kind = "notFound";
}

/** The API responded with a shape that failed Zod validation. */
export class ValidationError extends AppError {
  readonly kind = "validation";
}

/** The API responded 429 — too many requests. */
export class RateLimitError extends AppError {
  readonly kind = "rateLimit";
}

/** Anything we did not classify (unexpected status, parse failure, …). */
export class UnknownError extends AppError {
  readonly kind = "unknown";
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
