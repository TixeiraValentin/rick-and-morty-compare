import { describe, expect, it } from "vitest";
import { CharacterDtoSchema } from "@/infrastructure/dtos/characterDto";
import { toCharacter } from "@/infrastructure/mappers/characterMapper";

const validDto = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2",
    "https://rickandmortyapi.com/api/episode/28",
  ],
  // Fields the API sends but the app does not consume:
  gender: "Male",
  origin: { name: "Earth (C-137)", url: "" },
};

describe("CharacterDtoSchema", () => {
  it("accepts a valid payload and strips unknown fields", () => {
    const parsed = CharacterDtoSchema.parse(validDto);
    expect(parsed).not.toHaveProperty("gender");
    expect(parsed).not.toHaveProperty("origin");
    expect(parsed.episode).toHaveLength(3);
  });

  it("rejects an unknown status value", () => {
    expect(CharacterDtoSchema.safeParse({ ...validDto, status: "Zombie" }).success).toBe(false);
  });

  it("rejects a non-URL image", () => {
    expect(CharacterDtoSchema.safeParse({ ...validDto, image: "not-a-url" }).success).toBe(false);
  });

  it("rejects a payload missing a required field", () => {
    const withoutName = {
      id: 1,
      status: "Alive",
      species: "Human",
      image: validDto.image,
      episode: [],
    };
    expect(CharacterDtoSchema.safeParse(withoutName).success).toBe(false);
  });
});

describe("toCharacter", () => {
  it("maps a DTO to a domain Character, parsing episode URLs to numeric ids", () => {
    expect(toCharacter(CharacterDtoSchema.parse(validDto))).toEqual({
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      imageUrl: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      episodeIds: [1, 2, 28],
    });
  });

  it("preserves the status union value", () => {
    const dead = toCharacter(CharacterDtoSchema.parse({ ...validDto, status: "Dead" }));
    expect(dead.status).toBe("Dead");
  });

  it("yields an empty episodeIds list when the character has no episodes", () => {
    const noEpisodes = toCharacter(CharacterDtoSchema.parse({ ...validDto, episode: [] }));
    expect(noEpisodes.episodeIds).toEqual([]);
  });
});
