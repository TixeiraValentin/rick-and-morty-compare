import type { CharacterStatus } from "@/core/entities/Character";

export interface CharacterFilters {
  name?: string;
  species?: string;
  status?: CharacterStatus;
}
