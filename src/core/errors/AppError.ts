export type AppErrorKind = "network" | "notFound" | "validation" | "rateLimit" | "unknown";

export abstract class AppError extends Error {
  abstract readonly kind: AppErrorKind;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class NetworkError extends AppError {
  readonly kind = "network";
}

export class NotFoundError extends AppError {
  readonly kind = "notFound";
}

export class ValidationError extends AppError {
  readonly kind = "validation";
}

export class RateLimitError extends AppError {
  readonly kind = "rateLimit";
}

export class UnknownError extends AppError {
  readonly kind = "unknown";
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
