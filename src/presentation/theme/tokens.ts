import type { CharacterStatus } from "@/core/entities/Character";

/**
 * Status → Tailwind background utility for the status dot. The color values
 * themselves live as design tokens in globals.css (`@theme`), so these class
 * names map to `--color-status-*`. Color is never the only cue — the label is
 * always shown alongside (Golden Rule 13).
 */
export const statusDotClassName: Record<CharacterStatus, string> = {
  Alive: "bg-status-alive",
  Dead: "bg-status-dead",
  unknown: "bg-status-unknown",
};
