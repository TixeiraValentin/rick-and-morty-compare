"use client";

import type { ReactNode } from "react";
import type { Episode } from "@/core/entities/Episode";
import { EpisodeItem } from "@/presentation/components/feature/EpisodeItem";
import { Badge } from "@/presentation/components/ui/Badge";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { useTranslations } from "@/presentation/i18n/useTranslations";

interface EpisodeSectionProps {
  title: string;
  hint: string;
  icon: ReactNode;
  episodes: Episode[];
}

export function EpisodeSection({ title, hint, icon, episodes }: EpisodeSectionProps) {
  const t = useTranslations();

  return (
    <section
      aria-label={title}
      data-testid="episode-section"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4 lg:min-h-0"
    >
      <header className="flex shrink-0 flex-col gap-1">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
          <span className="text-primary" aria-hidden="true">
            {icon}
          </span>
          <span className="flex-1">{title}</span>
          <Badge>{t.compare.count(episodes.length)}</Badge>
        </h3>
        <p className="text-xs text-muted">{hint}</p>
      </header>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {episodes.length === 0 ? (
          <EmptyState title={t.compare.emptyBucket} />
        ) : (
          <ul className="flex flex-col gap-2">
            {episodes.map((episode) => (
              <EpisodeItem key={episode.id} episode={episode} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
