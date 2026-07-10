"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import type { Character } from "@/core/entities/Character";
import { StatusDot } from "@/presentation/components/ui/StatusDot";

const CARD_WIDTH = 232;
const CARD_HEIGHT = 300;
const CURSOR_GAP = 16;
const VIEWPORT_MARGIN = 8;

function clampToViewport(x: number, y: number) {
  const preferredLeft = x + CURSOR_GAP;
  const flippedLeft = x - CARD_WIDTH - CURSOR_GAP;
  const left =
    preferredLeft + CARD_WIDTH > window.innerWidth - VIEWPORT_MARGIN ? flippedLeft : preferredLeft;

  const maxTop = window.innerHeight - CARD_HEIGHT - VIEWPORT_MARGIN;
  const top = Math.min(
    Math.max(y + CURSOR_GAP, VIEWPORT_MARGIN),
    Math.max(maxTop, VIEWPORT_MARGIN),
  );

  return { left: Math.max(left, VIEWPORT_MARGIN), top };
}

interface CharacterPreviewCardProps {
  character: Character;
  x: number;
  y: number;
}

export function CharacterPreviewCard({ character, x, y }: CharacterPreviewCardProps) {
  if (typeof document === "undefined") return null;

  const { left, top } = clampToViewport(x, y);

  return createPortal(
    <div
      role="tooltip"
      style={{ left, top, width: CARD_WIDTH }}
      className="pointer-events-none fixed z-50 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
    >
      <Image
        src={character.imageUrl}
        alt=""
        width={CARD_WIDTH}
        height={200}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-col gap-1.5 p-3">
        <span className="font-bold text-foreground">{character.name}</span>
        <span className="text-sm text-muted">{character.species}</span>
        <StatusDot status={character.status} />
      </div>
    </div>,
    document.body,
  );
}
