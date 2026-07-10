import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { CompareBoard } from "@/presentation/components/feature/CompareBoard";
import { dictionaries } from "@/presentation/i18n/dictionaries";

const t = dictionaries.es;

const avatar = (id: number) => `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`;
const epUrl = (id: number) => `https://rickandmortyapi.com/api/episode/${id}`;

const rick = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: avatar(1),
  episode: [epUrl(1), epUrl(2), epUrl(3)],
};
const morty = {
  id: 2,
  name: "Morty Smith",
  status: "Alive",
  species: "Human",
  image: avatar(2),
  episode: [epUrl(2), epUrl(3), epUrl(4)],
};
const summer = {
  id: 3,
  name: "Summer Smith",
  status: "Alive",
  species: "Human",
  image: avatar(3),
  episode: [epUrl(1)],
};
const beth = {
  id: 4,
  name: "Beth Smith",
  status: "Alive",
  species: "Human",
  image: avatar(4),
  episode: [epUrl(1)],
};

const pages: Record<number, unknown> = {
  1: { info: { count: 4, pages: 2, next: "next", prev: null }, results: [rick, morty] },
  2: { info: { count: 4, pages: 2, next: null, prev: "prev" }, results: [summer, beth] },
};
const characterById: Record<number, unknown> = { 1: rick, 2: morty, 3: summer, 4: beth };
const episodeById: Record<number, unknown> = {
  1: { id: 1, name: "Pilot", air_date: "December 2, 2013", episode: "S01E01" },
  2: { id: 2, name: "Lawnmower Dog", air_date: "December 9, 2013", episode: "S01E02" },
  3: { id: 3, name: "Anatomy Park", air_date: "December 16, 2013", episode: "S01E03" },
  4: { id: 4, name: "M. Night Shaym-Aliens!", air_date: "January 13, 2014", episode: "S01E04" },
};

function jsonOk(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as Response;
}

function fakeFetch(input: string | URL | Request): Promise<Response> {
  const url = input.toString();
  const page = url.match(/\/character\/?\?page=(\d+)/);
  if (page) return Promise.resolve(jsonOk(pages[Number(page[1])] ?? pages[1]));

  const single = url.match(/\/character\/(\d+)$/);
  if (single) return Promise.resolve(jsonOk(characterById[Number(single[1])]));

  const episodes = url.match(/\/episode\/([\d,]+)$/);
  if (episodes) {
    const ids = episodes[1].split(",").map(Number);
    const body = ids.length === 1 ? episodeById[ids[0]] : ids.map((id) => episodeById[id]);
    return Promise.resolve(jsonOk(body));
  }
  return Promise.resolve({ ok: false, status: 404, json: async () => ({}) } as Response);
}

function renderBoard() {
  const onUrlUpdate = vi.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </NuqsTestingAdapter>
  );
  render(<CompareBoard />, { wrapper });
  return { onUrlUpdate, user: userEvent.setup() };
}

const lastParams = (spy: ReturnType<typeof vi.fn>): URLSearchParams =>
  spy.mock.calls.at(-1)?.[0].searchParams;

beforeEach(() => vi.stubGlobal("fetch", vi.fn(fakeFetch)));
afterEach(() => vi.unstubAllGlobals());

describe("CompareBoard", () => {
  it("hides the sections until both are selected, writes the selection to the URL, and buckets episodes", async () => {
    const { onUrlUpdate, user } = renderBoard();

    const column1 = await screen.findByTestId("column-1");
    const column2 = screen.getByTestId("column-2");

    expect(screen.queryByTestId("compare-results")).not.toBeInTheDocument();
    expect(screen.getByText(t.selection.prompt)).toBeInTheDocument();

    await user.click(
      await within(column1).findByRole("button", { name: t.card.select("Rick Sanchez") }),
    );
    await waitFor(() => expect(lastParams(onUrlUpdate).get("c1")).toBe("1"));
    expect(screen.queryByTestId("compare-results")).not.toBeInTheDocument();

    await user.click(
      await within(column2).findByRole("button", { name: t.card.select("Morty Smith") }),
    );
    await waitFor(() => expect(lastParams(onUrlUpdate).get("c2")).toBe("2"));

    const results = await screen.findByTestId("compare-results");
    const [onlyFirst, shared, onlySecond] = within(results).getAllByTestId("episode-section");

    expect(within(onlyFirst).getByText("Pilot")).toBeInTheDocument();
    expect(within(shared).getByText("Lawnmower Dog")).toBeInTheDocument();
    expect(within(shared).getByText("Anatomy Park")).toBeInTheDocument();
    expect(within(onlySecond).getByText("M. Night Shaym-Aliens!")).toBeInTheDocument();
    expect(within(onlyFirst).queryByText("Anatomy Park")).not.toBeInTheDocument();
  });

  it("paginates a column independently and updates the URL", async () => {
    const { onUrlUpdate, user } = renderBoard();

    const column1 = await screen.findByTestId("column-1");
    expect(await within(column1).findByText("Rick Sanchez")).toBeInTheDocument();

    await user.click(within(column1).getByRole("button", { name: t.columns.next }));

    await waitFor(() => expect(lastParams(onUrlUpdate).get("p1")).toBe("2"));
    expect(await within(column1).findByText("Summer Smith")).toBeInTheDocument();
  });
});
