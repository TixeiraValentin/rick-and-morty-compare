/**
 * ⭐ The business rule as a pure function (zero deps — the cheapest, highest-value test).
 *
 * Given the episode ids of the two selected characters, partition them into:
 *   - onlyFirst  = first \ second   (set difference)
 *   - shared     = first ∩ second   (intersection)
 *   - onlySecond = second \ first   (set difference)
 *
 * "Only" means only of the TWO selected characters — not "the only character in
 * that episode". Sets dedupe inputs; ordering is the first-seen order of each id.
 */
export interface EpisodeIdComparison {
  onlyFirst: number[];
  shared: number[];
  onlySecond: number[];
}

export function splitEpisodeIds(first: number[], second: number[]): EpisodeIdComparison {
  const a = new Set(first);
  const b = new Set(second);
  return {
    onlyFirst: [...a].filter((id) => !b.has(id)),
    shared: [...a].filter((id) => b.has(id)),
    onlySecond: [...b].filter((id) => !a.has(id)),
  };
}
