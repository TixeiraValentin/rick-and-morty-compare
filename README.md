# Rick & Morty · Comparador de Personajes

Elegí un personaje en cada una de las dos columnas (paginadas e independientes); cuando
hay selección en **ambas**, la app muestra tres secciones de episodios: los que aparecen
**solo #1**, los **compartidos** por ambos, y los **solo #2** — calculados como operaciones
de conjuntos.

- **Demo en vivo:** **https://rick-and-morty-compare.vercel.app**
- **Repositorio:** https://github.com/TixeiraValentin/rick-and-morty-compare
- **CI:** ![CI](https://github.com/TixeiraValentin/rick-and-morty-compare/actions/workflows/ci.yml/badge.svg)

Hecho con **Next.js 16** (App Router, Turbopack, React Compiler), **React 19.2**,
**TypeScript (strict)**, **TanStack Query v5**, **Zod**, **nuqs** y **Tailwind CSS v4**.

---

## Cómo correrlo

Requiere **Node 20.9+**.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script                        | Qué hace                                                                   |
| ----------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                 | Servidor de desarrollo (Turbopack) — http://localhost:3000                 |
| `npm run build` / `npm start` | Build de producción / servirlo                                             |
| `npm run typecheck`           | `tsc --noEmit` (strict)                                                    |
| `npm run lint`                | ESLint (incluye las reglas del React Compiler)                             |
| `npm test`                    | Vitest (unitarios + comportamiento), una corrida                           |
| `npm run test:watch`          | Vitest en modo watch                                                       |
| `npm run test:e2e`            | Playwright: buildea, sirve y maneja un navegador real (18 tests E2E)       |
| `npm run test:e2e:ui`         | Playwright **UI Mode**: mirás cada test paso a paso (timeline + snapshots) |
| `npm run test:e2e:report`     | Abre el último reporte HTML de Playwright                                  |
| `npm run format`              | Prettier: formatea todo                                                    |
| `npm run format:check`        | Prettier: verifica formato sin escribir                                    |

Opcionalmente podés definir `NEXT_PUBLIC_RM_API_BASE_URL` (ver `.env.example`); por defecto
usa la API pública.

---

## Qué incluye

- **Dos columnas independientes**, cada una con su **paginación** y sus **filtros** propios
  (por **nombre**, **estado** — vivo/muerto/desconocido — y **especie**, resueltos contra los
  query params de la API).
- **Cards seleccionables** con imagen, nombre, especie y estado (punto de color **+ texto**).
  Un personaje ya elegido en una columna queda deshabilitado en la otra.
- **Validación obligatoria**: las tres secciones **no se muestran** hasta elegir un personaje
  en cada columna — y se cumple en la **capa de datos**, no solo con CSS.
- **Extras (plus):** **selección, paginación y filtros** en la **URL** (deep-link + compartible),
  **intercambiar / limpiar** selección, **badges de conteo** por sección, **idioma ES/EN** (por
  defecto español), **tema claro/oscuro** sin flash, y layout **dashboard** de una sola pantalla
  en escritorio.

---

## Qué probar

**Automatizado** (todo tiene que dar verde):

```bash
npm run typecheck && npm run lint && npm test && npm run build
npm run test:e2e            # 18 tests E2E (buildea + navegador real)
npm run test:e2e:ui         # los mismos, mirándolos paso a paso
```

**Manual** — levantá `npm run dev` y probá:

| Qué                      | Cómo verificarlo                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Gate de validación       | Elegí un personaje en **una** columna → las 3 secciones **no** aparecen (aviso "falta uno"). Elegí en la otra → aparecen. |
| Comparación              | Con ambos elegidos: **Solo #1**, **Compartidos**, **Solo #2**, con badge de conteo por sección.                           |
| Deshabilitado cruzado    | Un personaje elegido en una columna queda deshabilitado en la otra.                                                       |
| Paginación independiente | Paginá la columna 1; la 2 no se mueve. `p1` / `p2` aparecen en la URL.                                                    |
| Jump-to-page             | Escribí un número de página + Enter; un número enorme se **clampa** a la última página.                                   |
| Filtros en la URL        | Filtrá por nombre / estado / especie → `name1` / `status1` / `species1` en la URL. **Refrescá**: se mantienen.            |
| Especie free-text        | El campo de especie acepta **cualquier** valor (probá `Gazorpian`) además de las sugerencias.                             |
| Swap / limpiar           | Intercambiá columnas / limpiá la selección (aparecen al tener selección).                                                 |
| Preview al hover         | Pasá el mouse ~0.6 s sobre una card → tarjeta de preview flotante.                                                        |
| Tema                     | Botón sol/luna → claro/oscuro sin flash. **Refrescá**: persiste (localStorage).                                           |
| Idioma                   | ES/EN → cambia toda la UI; queda en la URL (`lang=en`).                                                                   |
| Estado vacío             | Filtrá por algo inexistente (`zzz`) → estado vacío diferenciado.                                                          |

**Deep-links de ejemplo** (pegalos en la barra de direcciones):

- `/?c1=1&c2=2` — Rick vs Morty, comparación directa.
- `/?c1=1&c2=2&name1=rick&p2=3` — + filtro en una columna y página en la otra.
- `/?lang=en` — arranca en inglés.

---

## Arquitectura

Clean Architecture, **bien dimensionada** para una app chica. Las dependencias apuntan hacia
adentro; el dominio no sabe que existen React, Next ni la API.

```
presentation  ──▶   core   ◀──  infrastructure
(UI + app/)      (TS puro)      (HTTP, Zod, DI)
```

```
src/
├── app/              Rutas finas: layout, page (RSC: prefetch + hidratación), loading/error/not-found
├── core/             Dominio PURO — entidades, errores tipados, PUERTOS de repositorio, casos de uso, splitEpisodeIds
├── infrastructure/   httpClient, DTOs con Zod, mappers, IMPLs de repositorio, di/container, logger
└── presentation/     hooks (TanStack Query + URL), componentes, providers, i18n, theme
```

**La cadena de datos es siempre la misma:**

```
RSC / Hook → UseCase → Repository → Api → Zod (valida) → Mapper → Entity
```

El formato crudo de Rick & Morty (`episode: string[]` de URLs, `air_date`, mayúsculas raras
en `status`) **muere en el mapper**, que convierte las URLs de episodio en `episodeIds`
numéricos. Nada crudo llega al dominio ni a la UI.

**Composition root.** Las clases concretas (`new XxxRepositoryImpl()`, `new XxxUseCase()`) se
instancian en un único archivo: [`infrastructure/di/container.ts`](src/infrastructure/di/container.ts).
Los hooks y el RSC resuelven desde `useCases` — nunca hacen `new`. Los tests inyectan un
repositorio falso en una línea.

**La lógica estrella.** [`splitEpisodeIds(first, second)`](src/core/useCases/episodes/splitEpisodes.ts)
es una función pura que devuelve `{ onlyFirst, shared, onlySecond }`.
[`CompareEpisodesUseCase`](src/core/useCases/episodes/CompareEpisodesUseCase.ts) trae la **unión**
de episodios de ambos personajes en **una sola request batch** (`/episode/1,2,3`), los mapea y
particiona con `splitEpisodeIds`.

### Dónde decidí **no** abstraer

- **Sin store global / Zustand.** El único estado de cliente es la selección + la paginación, y
  vive en la **URL**. Un store sería justo el tipo de exceso que esta app no necesita.
- **Sin `Get…UseCase` para lecturas reactivas.** Las lecturas en vivo usan el primitivo reactivo
  directo (la caché de Query, la URL). Los casos de uso quedan para orquestación real
  (`CompareEpisodesUseCase`) — cada caso de uso está consumido por un hook/RSC.
- **Sin memoización a mano.** El **React Compiler** está encendido, así que no hay
  `memo`/`useCallback`/`useMemo` manuales — una sola estrategia, respaldada por su plugin de ESLint.

> En Next el **router es el sistema de archivos** — cada `app/**/page.tsx` es una pantalla/URL
> (no hay navigator que configurar). Esta app tiene una sola pantalla (`app/page.tsx`) que
> renderiza el board del cliente.

---

## Decisiones y trade-offs

| Decisión                             | Por qué                                                                                                                                      | Qué resigno                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Híbrido RSC + TanStack Query**     | El server da primer paint rápido, SEO y la primera página **prefetcheada + hidratada**; el cliente maneja paginación, filtros y comparación. | Un poco más de setup que un SPA puro.                        |
| **REST + batch `/episode/1,2,3`**    | La unión de episodios en **una** request — justo lo que necesita la comparación.                                                             | GraphQL evitaría over-fetching (queda como variante futura). |
| **Selección/filtros en la URL**      | Deep-link, refresh-safe y compartible.                                                                                                       | Un poco menos "React-y" que `useState`.                      |
| **Validación en la capa de datos**   | La query de comparación está desactivada (`skipToken`) hasta que ambos personajes resuelven.                                                 | —                                                            |
| **React Compiler, sin memo manual**  | Una sola estrategia de memoización.                                                                                                          | Confiar en una tool 1.x (mitigado con su ESLint).            |
| **Caché (modelo opt-in de Next 16)** | En el server `fetch(url, { next: { revalidate: 3600 } })` (RM es ~estático); en el cliente `staleTime` de TanStack Query.                    | —                                                            |

### "Solo" episodios — la ambigüedad resuelta

**"Solo #1"** significa _solo de los dos personajes seleccionados_ — `#1.episodes \ #2.episodes` —
**no** "el único personaje del episodio". Lo dejo explícito porque la consigna es ambigua; la
interpretación fue elegida a propósito.

---

## Testing

La pirámide, con honestidad: muchos tests baratos sobre la **lógica propensa a bugs**, unos pocos
de **comportamiento**, y **CI desde el primer commit**. Sin relleno de tests triviales.

| Qué                              | Herramienta         | Por qué                                                                                                                                                                                                                                                            |
| -------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `splitEpisodeIds`                | Vitest              | Álgebra de conjuntos con casos borde reales (mismo personaje, vacíos, duplicados, orden). El test más valioso.                                                                                                                                                     |
| Mappers + DTOs                   | Vitest              | URL→id, unión de `status`, y que **Zod rechace shapes inválidos**.                                                                                                                                                                                                 |
| `CompareEpisodesUseCase`         | Vitest + repo falso | Arma la request de unión correcta y devuelve los buckets bien.                                                                                                                                                                                                     |
| Comportamiento de `CompareBoard` | Testing Library     | Secciones ocultas hasta elegir ambos, la selección va a la URL, buckets correctos, paginación independiente — recorre la cadena **real** vía un `fetch` falso.                                                                                                     |
| E2E (18 tests / 7 flujos)        | Playwright          | Navegador real contra el build de producción: gating de validación, deep-link, paginación independiente, jump-to-page, filtros (nombre/estado/especie) en la URL, swap/clear, preview al hover, tema/idioma persistentes y estado de error (request interceptada). |

**CI (GitHub Actions)** corre `typecheck + lint + test` en cada push/PR desde el commit #1, con la
suite E2E de Playwright como job separado.

---

## Accesibilidad & UX

Responsive (las columnas se apilan en mobile), cards navegables por teclado con `aria-pressed` y
foco visible, estado como **color + texto** (nunca solo color), skeletons durante la carga,
estados **vacío** y **error diferenciados**, e idioma/tema que respetan la preferencia del sistema.

---

## Con más tiempo

- Una variante GraphQL de la capa de infraestructura (mismos puertos, un adapter distinto).
- Virtualización de listas si el catálogo creciera mucho.

---

_Datos de la [API de Rick and Morty](https://rickandmortyapi.com/). Trabajo práctico técnico._
