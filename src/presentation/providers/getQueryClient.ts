import { isServer, QueryClient } from "@tanstack/react-query";

/**
 * RM data is effectively static, so the client cache can be generous.
 * (This is a library object, not a domain class — Golden Rule 4 is about
 * repositories/use cases, which still only get `new`ed in di/container.)
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 min
        gcTime: 30 * 60 * 1000, // 30 min
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Server: a fresh client per request (no cross-request leakage).
 * Browser: a singleton, so React re-renders / suspense don't recreate it and
 * discard the hydrated cache.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
