import { isServer, QueryClient } from "@tanstack/react-query";
import { NotFoundError, RateLimitError } from "@/core/errors/AppError";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        // A 429 means the public API is already rate-limiting us: retrying at once
        // only doubles the load and prolongs the block. A 404 will never turn into
        // a 200. Retry once for genuinely transient faults, never for those two.
        retry: (failureCount, error) => {
          if (error instanceof RateLimitError || error instanceof NotFoundError) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
