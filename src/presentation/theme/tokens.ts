import type { CharacterStatus } from "@/core/entities/Character";

export const statusDotClassName: Record<CharacterStatus, string> = {
  Alive: "bg-status-alive",
  Dead: "bg-status-dead",
  unknown: "bg-status-unknown",
};
