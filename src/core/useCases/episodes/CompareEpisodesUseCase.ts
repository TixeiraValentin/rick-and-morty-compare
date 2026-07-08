import type { Character } from "@/core/entities/Character";
import type { Episode } from "@/core/entities/Episode";
import type { EpisodeRepository } from "@/core/repositories/EpisodeRepository";
import { splitEpisodeIds } from "@/core/useCases/episodes/splitEpisodes";

export interface CompareEpisodesInput {
  first: Character;
  second: Character;
}

export interface EpisodeComparison {
  onlyFirst: Episode[];
  shared: Episode[];
  onlySecond: Episode[];
}

/**
 * Real orchestration (not a showcase read): fetch the UNION of both characters'
 * episodes in ONE batched request, then partition it with the pure
 * `splitEpisodeIds`. Consumed by useCompareEpisodes.
 */
export class CompareEpisodesUseCase {
  constructor(private readonly episodes: EpisodeRepository) {}

  async execute({ first, second }: CompareEpisodesInput): Promise<EpisodeComparison> {
    const split = splitEpisodeIds(first.episodeIds, second.episodeIds);
    const unionIds = [...new Set([...first.episodeIds, ...second.episodeIds])];

    const episodes = await this.episodes.getEpisodesByIds(unionIds);
    const byId = new Map(episodes.map((episode) => [episode.id, episode]));

    const pick = (ids: number[]): Episode[] =>
      ids
        .map((id) => byId.get(id))
        .filter((episode): episode is Episode => episode !== undefined);

    return {
      onlyFirst: pick(split.onlyFirst),
      shared: pick(split.shared),
      onlySecond: pick(split.onlySecond),
    };
  }
}
