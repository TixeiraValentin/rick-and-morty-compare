"use client";

import Image from "next/image";
import type { Character } from "@/core/entities/Character";
import { StatusDot } from "@/presentation/components/ui/StatusDot";
import { useTranslations } from "@/presentation/i18n/useTranslations";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export function CharacterCard({ character, selected, disabled, onToggle }: CharacterCardProps) {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={t.card.select(character.name)}
      title={disabled ? t.card.disabledOtherColumn : undefined}
      data-testid="character-card"
      className={[
        "group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "border-border bg-surface hover:border-foreground/20 hover:bg-foreground/5",
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
      ].join(" ")}
    >
      <Image
        src={character.imageUrl}
        alt=""
        width={52}
        height={52}
        className="h-13 w-13 shrink-0 rounded-lg object-cover"
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold text-foreground">{character.name}</span>
          {selected ? (
            <span className="shrink-0 text-xs font-medium text-primary">{t.card.selected}</span>
          ) : null}
        </span>
        <span className="truncate text-sm text-muted">{character.species}</span>
        <StatusDot status={character.status} />
      </span>
    </button>
  );
}
