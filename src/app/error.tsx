"use client";

import { useEffect } from "react";
import { logger } from "@/infrastructure/services/logger";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { useTranslations } from "@/presentation/i18n/useTranslations";
import { errorMessageFor } from "@/presentation/lib/errorMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    logger.error("Route error boundary caught an error", error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState message={errorMessageFor(error, t)} onRetry={reset} />
    </div>
  );
}
