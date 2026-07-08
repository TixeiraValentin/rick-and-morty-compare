"use client";

import { useEffect } from "react";
import { logger } from "@/infrastructure/services/logger";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { errorMessageFor } from "@/presentation/lib/errorMessage";

/** Route error boundary. Surfacing errors is a presentation concern (Rule 10). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Route error boundary caught an error", error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState message={errorMessageFor(error)} onRetry={reset} />
    </div>
  );
}
