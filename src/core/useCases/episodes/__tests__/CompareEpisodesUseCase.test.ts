import { describe, expect, it, vi } from "vitest";
import type { Character } from "@/core/entities/Character";
import type { Episode } from "@/core/entities/Episode";
import type { EpisodeRepository } from "@/core/repositories/EpisodeRepository";
import { CompareEpisodesUseCase } from "@/core/useCases/episodes/CompareEpisodesUseCase";

function character(id: number, episodeIds: number[]): Character {
  return { id, name: `C${id}`, status: "Alive", species: "Human", imageUrl: "", episodeIds };
}
function episode(id: number): Episode {
  return { id, name: `E${id}`, code: `S01E${id}`, airDate: "2013" };
}

describe("CompareEpisodesUseCase", () => {
  it("requests the deduped union once and buckets episodes into only#1 / shared / only#2", async () => {
    const getEpisodesByIds = vi.fn(async (ids: number[]) => ids.map(episode));
    const repo: EpisodeRepository = { getEpisodesByIds };

    const result = await new CompareEpisodesUseCase(repo).execute({
      first: character(1, [1, 2, 3]),
      second: character(2, [3, 4]),
    });

    // ONE batched request for the union, in deterministic order.
    expect(getEpisodesByIds).toHaveBeenCalledTimes(1);
    expect(getEpisodesByIds).toHaveBeenCalledWith([1, 2, 3, 4]);

    expect(result.onlyFirst.map((e) => e.id)).toEqual([1, 2]);
    expect(result.shared.map((e) => e.id)).toEqual([3]);
    expect(result.onlySecond.map((e) => e.id)).toEqual([4]);
    // The buckets carry full Episode entities, not just ids.
    expect(result.shared[0]).toMatchObject({ id: 3, code: "S01E3" });
  });

  it("returns empty buckets (not an error) when neither character has episodes", async () => {
    const repo: EpisodeRepository = { getEpisodesByIds: vi.fn(async () => []) };
    const result = await new CompareEpisodesUseCase(repo).execute({
      first: character(1, []),
      second: character(2, []),
    });
    expect(result).toEqual({ onlyFirst: [], shared: [], onlySecond: [] });
  });

  it("treats the same character in both columns as fully shared", async () => {
    const repo: EpisodeRepository = {
      getEpisodesByIds: vi.fn(async (ids: number[]) => ids.map(episode)),
    };
    const same = character(1, [1, 2]);
    const result = await new CompareEpisodesUseCase(repo).execute({ first: same, second: same });
    expect(result.shared.map((e) => e.id)).toEqual([1, 2]);
    expect(result.onlyFirst).toEqual([]);
    expect(result.onlySecond).toEqual([]);
  });
});
