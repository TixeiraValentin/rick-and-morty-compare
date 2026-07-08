import type { CharacterStatus } from "@/core/entities/Character";
import { strings } from "@/presentation/strings";
import { statusDotClassName } from "@/presentation/theme/tokens";

/**
 * Status shown as a colored dot AND its text label — color is never the only
 * cue (Golden Rule 13). The dot itself is decorative (aria-hidden).
 */
export function StatusDot({ status }: { status: CharacterStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDotClassName[status]}`}
        aria-hidden="true"
      />
      {strings.status[status]}
    </span>
  );
}
