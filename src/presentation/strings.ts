import type { AppErrorKind } from "@/core/errors/AppError";
import type { CharacterStatus } from "@/core/entities/Character";

/** Single source of user-facing copy (Golden Rule 12). English throughout. */
export const strings = {
  app: {
    title: "Rick & Morty · Character Compare",
    tagline: "Pick one character in each column to see which episodes they share.",
  },
  columns: {
    first: "Character #1",
    second: "Character #2",
    page: (current: number, total: number) => `Page ${current} of ${total}`,
    previous: "Previous page",
    next: "Next page",
    empty: "No characters on this page.",
  },
  card: {
    select: (name: string) => `Select ${name}`,
    selected: "Selected",
    disabledOtherColumn: "Already selected in the other column",
  },
  status: {
    Alive: "Alive",
    Dead: "Dead",
    unknown: "Unknown",
  } satisfies Record<CharacterStatus, string>,
  selection: {
    swap: "Swap columns",
    clear: "Clear selection",
    prompt: "Select a character in each column to compare their episodes.",
    onlyOne: "One more to go — pick a character in the other column.",
  },
  compare: {
    onlyFirst: "Only Character #1",
    shared: "Shared episodes",
    onlySecond: "Only Character #2",
    onlyFirstHint: "Episodes with the first character but not the second.",
    sharedHint: "Episodes where both characters appear.",
    onlySecondHint: "Episodes with the second character but not the first.",
    emptyBucket: "No episodes here for this pair.",
    count: (n: number) => `${n}`,
  },
  theme: {
    toggle: "Toggle theme",
    light: "Light",
    dark: "Dark",
  },
  errors: {
    network: "We couldn't reach the Rick & Morty API. Check your connection and try again.",
    notFound: "We couldn't find that character.",
    validation: "The API returned something unexpected.",
    rateLimit: "Too many requests — please wait a moment and try again.",
    unknown: "Something went wrong.",
    retry: "Try again",
  } satisfies Record<AppErrorKind, string> & { retry: string },
} as const;
