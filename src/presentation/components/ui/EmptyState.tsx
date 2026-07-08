import type { ReactNode } from "react";

/** A friendly, distinct-from-error empty state (Golden Rule 13). */
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-10 text-center"
    >
      {icon ? (
        <div className="text-muted" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
    </div>
  );
}
