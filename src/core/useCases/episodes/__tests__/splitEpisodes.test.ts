import { describe, expect, it } from "vitest";
import { splitEpisodeIds } from "@/core/useCases/episodes/splitEpisodes";

describe("splitEpisodeIds", () => {
  it("partitions overlapping lists into only#1 / shared / only#2", () => {
    expect(splitEpisodeIds([1, 2, 3], [3, 4, 5])).toEqual({
      onlyFirst: [1, 2],
      shared: [3],
      onlySecond: [4, 5],
    });
  });

  it("treats the same character in both columns as fully shared", () => {
    expect(splitEpisodeIds([1, 2, 3], [1, 2, 3])).toEqual({
      onlyFirst: [],
      shared: [1, 2, 3],
      onlySecond: [],
    });
  });

  it("handles two empty lists", () => {
    expect(splitEpisodeIds([], [])).toEqual({
      onlyFirst: [],
      shared: [],
      onlySecond: [],
    });
  });

  it("handles one empty list", () => {
    expect(splitEpisodeIds([1, 2], [])).toEqual({
      onlyFirst: [1, 2],
      shared: [],
      onlySecond: [],
    });
    expect(splitEpisodeIds([], [9, 8])).toEqual({
      onlyFirst: [],
      shared: [],
      onlySecond: [9, 8],
    });
  });

  it("deduplicates repeated ids within each list", () => {
    expect(splitEpisodeIds([1, 1, 2, 2], [2, 2, 3])).toEqual({
      onlyFirst: [1],
      shared: [2],
      onlySecond: [3],
    });
  });

  it("is deterministic: preserves first-seen order of each source", () => {
    expect(splitEpisodeIds([3, 1, 2], [2, 3])).toEqual({
      onlyFirst: [1],
      shared: [3, 2],
      onlySecond: [],
    });
  });

  it("handles fully disjoint lists", () => {
    expect(splitEpisodeIds([1, 2], [3, 4])).toEqual({
      onlyFirst: [1, 2],
      shared: [],
      onlySecond: [3, 4],
    });
  });

  it("does not mutate its inputs", () => {
    const first = [1, 2, 3];
    const second = [3, 4];
    splitEpisodeIds(first, second);
    expect(first).toEqual([1, 2, 3]);
    expect(second).toEqual([3, 4]);
  });
});
