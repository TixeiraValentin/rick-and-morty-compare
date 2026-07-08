"use client";

import Image from "next/image";
import { ArrowLeftRight, X } from "lucide-react";
import type { Character } from "@/core/entities/Character";
import { strings } from "@/presentation/strings";

interface SelectionBarProps {
  first?: Character;
  second?: Character;
  onSwap: () => void;
  onClear: () => void;
}

const actionClass =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function SelectionBar({ first, second, onSwap, onClear }: SelectionBarProps) {
  const hasAny = first !== undefined || second !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <Chip label={strings.columns.first} character={first} />
      <ArrowLeftRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <Chip label={strings.columns.second} character={second} />
      <div className="ml-auto flex gap-2">
        <button type="button" onClick={onSwap} disabled={!hasAny} className={actionClass}>
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          {strings.selection.swap}
        </button>
        <button type="button" onClick={onClear} disabled={!hasAny} className={actionClass}>
          <X className="h-4 w-4" aria-hidden="true" />
          {strings.selection.clear}
        </button>
      </div>
    </div>
  );
}

function Chip({ label, character }: { label: string; character?: Character }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {character ? (
        <span className="flex items-center gap-1.5">
          <Image
            src={character.imageUrl}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="max-w-32 truncate text-sm font-medium text-foreground">
            {character.name}
          </span>
        </span>
      ) : (
        <span className="text-sm text-muted">—</span>
      )}
    </div>
  );
}
