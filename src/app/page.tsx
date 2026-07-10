import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { CharacterStatus } from "@/core/entities/Character";
import type { CharacterFilters } from "@/core/entities/CharacterFilters";
import { useCases } from "@/infrastructure/di/container";
import { CompareBoard } from "@/presentation/components/feature/CompareBoard";
import { queryKeys } from "@/presentation/hooks/queryKeys";
import { getQueryClient } from "@/presentation/providers/getQueryClient";

type SearchParams = Record<string, string | string[] | undefined>;

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

const STATUSES: CharacterStatus[] = ["Alive", "Dead", "unknown"];

function toInt(value: string | string[] | undefined): number | null {
  if (typeof value !== "string") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStr(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function toStatus(value: string | string[] | undefined): CharacterStatus | undefined {
  return STATUSES.find((status) => status === value);
}

function readFilters(sp: SearchParams, column: 1 | 2): CharacterFilters {
  return {
    name: toStr(sp[`name${column}`]),
    status: toStatus(sp[`status${column}`]),
    species: toStr(sp[`species${column}`]),
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const p1 = Math.max(1, toInt(sp.p1) ?? 1);
  const p2 = Math.max(1, toInt(sp.p2) ?? 1);
  const c1 = toInt(sp.c1);
  const c2 = toInt(sp.c2);

  const queryClient = getQueryClient();

  const columns = [
    { page: p1, filters: readFilters(sp, 1) },
    { page: p2, filters: readFilters(sp, 2) },
  ];
  const selectedIds = [c1, c2].filter((id): id is number => id !== null);

  const seenColumns = new Set<string>();
  const columnPrefetches = columns
    .filter((column) => {
      const key = JSON.stringify(queryKeys.charactersPage(column.page, column.filters));
      if (seenColumns.has(key)) return false;
      seenColumns.add(key);
      return true;
    })
    .map((column) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.charactersPage(column.page, column.filters),
        queryFn: () =>
          useCases.getCharacters().execute({ page: column.page, filters: column.filters }),
      }),
    );

  await Promise.all([
    ...columnPrefetches,
    ...selectedIds.map((id) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.character(id),
        queryFn: () => useCases.getCharacter().execute(id),
      }),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompareBoard />
    </HydrationBoundary>
  );
}
