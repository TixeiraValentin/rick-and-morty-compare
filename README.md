# Rick & Morty · Character Compare

Pick one character in each of two independent, paginated columns; once **both** are
selected, the app shows three episode sections — episodes with **only #1**, episodes
**shared** by both, and episodes with **only #2** — computed as set operations.

- **Live demo:** **https://rick-and-morty-compare.vercel.app**
- **Repo:** https://github.com/TixeiraValentin/rick-and-morty-compare
- **CI:** ![CI](https://github.com/TixeiraValentin/rick-and-morty-compare/actions/workflows/ci.yml/badge.svg)

Built with **Next.js 16** (App Router, Turbopack, React Compiler), **React 19.2**,
**TypeScript (strict)**, **TanStack Query v5**, **Zod**, **nuqs**, **Tailwind CSS v4**.

---

## Run it

Requires **Node 20.9+**.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script                        | What it does                                              |
| ----------------------------- | --------------------------------------------------------- |
| `npm run dev`                 | Dev server (Turbopack)                                    |
| `npm run build` / `npm start` | Production build / serve                                  |
| `npm run typecheck`           | `tsc --noEmit` (strict)                                   |
| `npm run lint`                | ESLint incl. the React Compiler rules                     |
| `npm test`                    | Vitest (unit + behavior)                                  |
| `npm run test:e2e`            | Playwright smoke (builds + serves, then drives a browser) |

Optionally set `NEXT_PUBLIC_RM_API_BASE_URL` (see `.env.example`); it defaults to the
public API.

---

## Architecture

Clean Architecture, **right-sized** for a small app. Dependencies point inward; the
domain knows nothing about React, Next, or the API.

```
presentation  ──▶   core   ◀──  infrastructure
(UI + app/)      (pure TS)      (HTTP, Zod, DI)
```

```
src/
├── app/              Thin routes: layout, RSC page (prefetch + hydrate), loading/error/not-found
├── core/             PURE domain — entities, typed errors, repository PORTS, use cases, splitEpisodeIds
├── infrastructure/   httpClient, Zod DTOs, mappers, repository IMPLs, di/container, logger
└── presentation/     hooks (TanStack Query + URL), components, providers, theme, strings
```

**The data chain is always the same:**

```
RSC / Hook → UseCase → Repository → Api → Zod-validate → Mapper → Entity
```

The raw Rick & Morty shape (`episode: string[]` of URLs, `air_date`, `status` casing)
**dies at the mapper** — it parses episode URLs into numeric `episodeIds`, and nothing
raw reaches the domain or the UI.

**Composition root.** Concrete classes (`new XxxRepositoryImpl()`, `new XxxUseCase()`)
are instantiated in exactly one file, [`infrastructure/di/container.ts`](src/infrastructure/di/container.ts).
Hooks and the RSC resolve from `useCases` — they never `new` anything. Tests inject a
fake repository in one line.

**The star.** [`splitEpisodeIds(first, second)`](src/core/useCases/episodes/splitEpisodes.ts)
is a pure function returning `{ onlyFirst, shared, onlySecond }`.
[`CompareEpisodesUseCase`](src/core/useCases/episodes/CompareEpisodesUseCase.ts) fetches the
**union** of both characters' episodes in **one batched request** (`/episode/1,2,3`), maps
them, and partitions with `splitEpisodeIds`.

### Where I deliberately did **not** abstract

- **No global store / Zustand.** The only client state is selection + pagination, and it
  lives in the **URL**. A store would be exactly the kind of excess this app doesn't need.
- **No `Get…UseCase` for reactive reads.** Live reads use the reactive primitive directly
  (the Query cache, the URL). Use cases are reserved for genuine orchestration
  (`CompareEpisodesUseCase`) — every use case here is consumed by a real hook/RSC.
- **No hand-written memoization.** The **React Compiler** is enabled, so there is no
  `memo`/`useCallback`/`useMemo` by hand — one strategy, enforced by its ESLint rules.
- **No generic `BaseRepository<T>`, event bus, or sagas.**

---

## Key decisions & trade-offs

| Decision                           | Why                                                                                                                                                         | Trade-off                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **RSC + TanStack Query hybrid**    | Server gives fast first paint, SEO and a **prefetched + hydrated** page 1; the client owns pagination and the comparison.                                   | A little more setup than a pure SPA.                           |
| **REST + batch `/episode/1,2,3`**  | The union of episodes in **one** request — exactly what the comparison needs.                                                                               | GraphQL would avoid over-fetching (noted as a future variant). |
| **Selection in the URL (nuqs)**    | Deep-linkable, refresh-safe, shareable — paste a link and the other person sees the same comparison.                                                        | Slightly less "React-y" than `useState`.                       |
| **Validation at the data layer**   | The comparison query is disabled (`skipToken`) until **both** characters resolve — the "hidden until both selected" rule is enforced in data, not just CSS. | —                                                              |
| **React Compiler, no manual memo** | One memoization strategy.                                                                                                                                   | Trusting a 1.x tool (mitigated by its ESLint rules).           |
| **Caching (Next 16 opt-in model)** | Server fetches use `next: { revalidate: 3600 }` (RM data is ~static); the client uses TanStack Query `staleTime`. Re-selecting doesn't refetch needlessly.  | —                                                              |

### "Only" episodes — the resolved ambiguity

**"Only #1"** means _only of the two selected characters_ — `#1.episodes \ #2.episodes` —
**not** "the only character in that episode". This is stated explicitly because the brief
is ambiguous; the interpretation was chosen on purpose.

---

## Testing story

The pyramid, honestly — many cheap tests on **bug-prone logic**, a few on **behavior**,
and **CI from the first commit**. No padding on trivial one-liners.

| What                     | Tool               | Why                                                                                                                                                |
| ------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `splitEpisodeIds`        | Vitest             | Set algebra with real edge cases (same character, empty, duplicates, ordering) — the highest-value test.                                           |
| Mappers + DTOs           | Vitest             | URL→id parsing, `status` union, and **Zod rejects malformed shapes**.                                                                              |
| `CompareEpisodesUseCase` | Vitest + fake repo | Builds the correct union request and buckets episodes correctly.                                                                                   |
| `CompareBoard` behavior  | Testing Library    | Sections hidden until both selected, selection writes to the URL, buckets render, columns paginate — drives the **real** chain via a fake `fetch`. |
| Smoke                    | Playwright         | Pick two characters → the three sections render (real API) — the recommended way to test async RSC flows.                                          |

**CI (GitHub Actions)** runs `typecheck + lint + test` on every push/PR from commit #1,
with the Playwright smoke as a separate job.

---

## Accessibility & UX

Responsive (columns stack on mobile), keyboard-navigable selectable cards with
`aria-pressed` and `focus-visible` rings, status shown as **color + text** (never color
alone), skeletons while loading, **distinct** empty vs. error states, and a light/dark
theme that respects `prefers-color-scheme` with a no-flash toggle. Extras: **swap ↔ /
clear** selection, and per-section **count badges** — all reflected in the URL.

---

## What I'd do next

- Broaden Playwright coverage (deep-link restore, swap/clear, theme persistence).
- A GraphQL variant of the infrastructure layer (same ports, one adapter swapped).
- List virtualization if the character lists grew large.

---

_Data from the [Rick and Morty API](https://rickandmortyapi.com/). This is a technical challenge._
