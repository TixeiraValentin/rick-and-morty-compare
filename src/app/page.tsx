import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useCases } from "@/infrastructure/di/container";
import { CompareBoard } from "@/presentation/components/feature/CompareBoard";
import { queryKeys } from "@/presentation/hooks/queryKeys";
import { getQueryClient } from "@/presentation/providers/getQueryClient";

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toInt(value: string | string[] | undefined): number | null {
  if (typeof value !== "string") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const p1 = toInt(sp.p1) ?? 1;
  const p2 = toInt(sp.p2) ?? 1;
  const c1 = toInt(sp.c1);
  const c2 = toInt(sp.c2);

  const queryClient = getQueryClient();

  const pages = [...new Set([p1, p2])];
  const selectedIds = [c1, c2].filter((id): id is number => id !== null);

  await Promise.all([
    ...pages.map((page) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.charactersPage(page),
        queryFn: () => useCases.getCharacters().execute({ page }),
      }),
    ),
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
