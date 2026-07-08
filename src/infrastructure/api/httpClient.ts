import {
  NetworkError,
  NotFoundError,
  RateLimitError,
  UnknownError,
} from "@/core/errors/AppError";

/**
 * The single HTTP entry point (Facade): one place with a timeout and typed
 * error mapping. Returns parsed JSON as `unknown` — validation is the caller's
 * job (Zod, at the api layer). No UI concerns here (Golden Rule 10).
 */
const DEFAULT_TIMEOUT_MS = 10_000;

export interface HttpGetOptions {
  /** Server-side ISR cache window in seconds (ignored on the client). */
  revalidate?: number;
  /** Cancellation signal (e.g. from a TanStack Query `queryFn`). */
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function httpGet(url: string, options: HttpGetOptions = {}): Promise<unknown> {
  const { revalidate, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(url, {
      signal: combinedSignal,
      ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    });
  } catch (cause) {
    throw new NetworkError(`Request failed: ${url}`, { cause });
  }

  if (!response.ok) {
    if (response.status === 404) throw new NotFoundError(`Not found: ${url}`);
    if (response.status === 429) throw new RateLimitError(`Rate limited: ${url}`);
    throw new UnknownError(`Unexpected ${response.status} from ${url}`);
  }

  try {
    return (await response.json()) as unknown;
  } catch (cause) {
    throw new UnknownError(`Invalid JSON from ${url}`, { cause });
  }
}
