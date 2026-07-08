"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "@/presentation/providers/getQueryClient";

export function QueryProvider({ children }: { children: ReactNode }) {
  // getQueryClient owns the server/browser lifecycle, so we resolve it here
  // (not useState) and let it hand back the singleton on the client.
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
