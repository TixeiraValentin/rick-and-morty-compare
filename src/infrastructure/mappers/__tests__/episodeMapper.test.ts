import { describe, expect, it } from "vitest";
import { EpisodeDtoSchema, EpisodesByIdsResponseSchema } from "@/infrastructure/dtos/episodeDto";
import { toEpisode } from "@/infrastructure/mappers/episodeMapper";

const validEpisode = {
  id: 1,
  name: "Pilot",
  air_date: "December 2, 2013",
  episode: "S01E01",
  characters: ["https://rickandmortyapi.com/api/character/1"],
};

describe("EpisodeDtoSchema + toEpisode", () => {
  it("maps air_date and episode code into the clean domain shape", () => {
    expect(toEpisode(EpisodeDtoSchema.parse(validEpisode))).toEqual({
      id: 1,
      name: "Pilot",
      code: "S01E01",
      airDate: "December 2, 2013",
    });
  });

  it("rejects a malformed episode (missing episode code)", () => {
    expect(EpisodeDtoSchema.safeParse({ id: 1, name: "x", air_date: "y" }).success).toBe(false);
  });
});

describe("EpisodesByIdsResponseSchema (batch quirk)", () => {
  it("accepts a single object (one id requested)", () => {
    expect(EpisodesByIdsResponseSchema.safeParse(validEpisode).success).toBe(true);
  });

  it("accepts an array (many ids requested)", () => {
    expect(EpisodesByIdsResponseSchema.safeParse([validEpisode, validEpisode]).success).toBe(true);
  });
});
