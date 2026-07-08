"use client";

import Image from "next/image";
import type { Character } from "@/core/entities/Character";
import { StatusDot } from "@/presentation/components/ui/StatusDot";
import { strings } from "@/presentation/strings";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  /** True when this character is already selected in the other column. */
  disabled: boolean;
  onToggle: () => void;
}

export function CharacterCard({ character, selected, disabled, onToggle }: CharacterCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={strings.card.select(character.name)}
      title={disabled ? strings.card.disabledOtherColumn : undefined}
      data-testid="character-card"
      className={[
        "group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "border-border bg-surface hover:border-foreground/20 hover:bg-foreground/[0.03]",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      <Image
        src={character.imageUrl}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-lg object-cover"
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold text-foreground">{character.name}</span>
          {selected ? (
            <span className="shrink-0 text-xs font-medium text-primary">
              {strings.card.selected}
            </span>
          ) : null}
        </span>
        <span className="truncate text-sm text-muted">{character.species}</span>
        <StatusDot status={character.status} />
      </span>
    </button>
  );
}
