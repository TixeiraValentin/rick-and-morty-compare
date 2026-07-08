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
