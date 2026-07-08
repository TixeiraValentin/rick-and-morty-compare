import type { Episode } from "@/core/entities/Episode";

export function EpisodeItem({ episode }: { episode: Episode }) {
  return (
    <li className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{episode.name}</p>
        <p className="text-xs text-muted">{episode.airDate}</p>
      </div>
      <span className="shrink-0 rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-muted">
        {episode.code}
      </span>
    </li>
  );
}
