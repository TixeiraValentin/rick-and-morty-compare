import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-10 text-center"
    >
      {icon ? (
        <div className="text-muted" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
