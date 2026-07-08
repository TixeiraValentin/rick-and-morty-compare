import type { ReactNode } from "react";
import type { Episode } from "@/core/entities/Episode";
import { EpisodeItem } from "@/presentation/components/feature/EpisodeItem";
import { Badge } from "@/presentation/components/ui/Badge";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { strings } from "@/presentation/strings";

interface EpisodeSectionProps {
  title: string;
  hint: string;
  icon: ReactNode;
  episodes: Episode[];
}

export function EpisodeSection({ title, hint, icon, episodes }: EpisodeSectionProps) {
  return (
    <section
      aria-label={title}
      data-testid="episode-section"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4"
    >
      <header className="flex flex-col gap-1">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
          <span className="text-primary" aria-hidden="true">
            {icon}
          </span>
          <span className="flex-1">{title}</span>
          <Badge>{strings.compare.count(episodes.length)}</Badge>
        </h3>
        <p className="text-xs text-muted">{hint}</p>
      </header>

      {episodes.length === 0 ? (
        <EmptyState title={strings.compare.emptyBucket} />
      ) : (
        <ul className="flex flex-col gap-2">
          {episodes.map((episode) => (
            <EpisodeItem key={episode.id} episode={episode} />
          ))}
        </ul>
      )}
    </section>
  );
}
