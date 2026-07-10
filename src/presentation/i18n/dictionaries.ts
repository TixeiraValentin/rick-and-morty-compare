import type { AppErrorKind } from "@/core/errors/AppError";
import type { CharacterStatus } from "@/core/entities/Character";

const en = {
  app: {
    title: "Rick & Morty · Character Compare",
    tagline: "Pick one character in each column to see which episodes they share.",
  },
  columns: {
    first: "Character #1",
    second: "Character #2",
    page: (current: number, total: number) => `Page ${current} of ${total}`,
    pageInputLabel: "Go to page",
    pageTotal: (total: number) => `of ${total}`,
    previous: "Previous page",
    next: "Next page",
    empty: "No characters match these filters.",
    loading: "Loading characters…",
    resetPage: "Back to the first page",
  },
  filters: {
    searchPlaceholder: "Search by name…",
    status: "Status",
    statusAll: "Any status",
    species: "Species",
    speciesAll: "Any species",
    clear: "Clear filters",
  },
  card: {
    select: (name: string) => `Select ${name}`,
    selected: "Selected",
    disabledOtherColumn: "Already selected in the other column",
  },
  status: {
    Alive: "Alive",
    Dead: "Dead",
    unknown: "Unknown",
  } as Record<CharacterStatus, string>,
  selection: {
    swap: "Swap columns",
    clear: "Clear selection",
    prompt: "Select a character in each column to compare their episodes.",
    onlyOne: "One more to go — pick a character in the other column.",
  },
  compare: {
    onlyFirst: "Only Character #1",
    shared: "Shared episodes",
    onlySecond: "Only Character #2",
    onlyFirstHint: "Episodes with the first character but not the second.",
    sharedHint: "Episodes where both characters appear.",
    onlySecondHint: "Episodes with the second character but not the first.",
    emptyBucket: "No episodes here for this pair.",
    count: (n: number) => `${n}`,
  },
  theme: {
    toggle: "Toggle theme",
  },
  language: {
    toggle: "Cambiar idioma / Change language",
  },
  notFound: {
    code: "404",
    title: "This dimension doesn't exist.",
    back: "Back to the comparison",
  },
  errors: {
    network: "We couldn't reach the Rick & Morty API. Check your connection and try again.",
    notFound: "We couldn't find that character.",
    validation: "The API returned something unexpected.",
    rateLimit: "Too many requests — please wait a moment and try again.",
    unknown: "Something went wrong.",
    retry: "Try again",
  } as Record<AppErrorKind, string> & { retry: string },
};

export type Dictionary = typeof en;

const es: Dictionary = {
  app: {
    title: "Rick & Morty · Comparador de Personajes",
    tagline: "Elegí un personaje en cada columna para ver qué episodios comparten.",
  },
  columns: {
    first: "Personaje #1",
    second: "Personaje #2",
    page: (current, total) => `Página ${current} de ${total}`,
    pageInputLabel: "Ir a la página",
    pageTotal: (total) => `de ${total}`,
    previous: "Página anterior",
    next: "Página siguiente",
    empty: "Ningún personaje coincide con estos filtros.",
    loading: "Cargando personajes…",
    resetPage: "Volver a la primera página",
  },
  filters: {
    searchPlaceholder: "Buscar por nombre…",
    status: "Estado",
    statusAll: "Cualquier estado",
    species: "Especie",
    speciesAll: "Cualquier especie",
    clear: "Limpiar filtros",
  },
  card: {
    select: (name) => `Seleccionar ${name}`,
    selected: "Seleccionado",
    disabledOtherColumn: "Ya está seleccionado en la otra columna",
  },
  status: {
    Alive: "Vivo",
    Dead: "Muerto",
    unknown: "Desconocido",
  },
  selection: {
    swap: "Intercambiar columnas",
    clear: "Limpiar selección",
    prompt: "Elegí un personaje en cada columna para comparar sus episodios.",
    onlyOne: "Falta uno — elegí un personaje en la otra columna.",
  },
  compare: {
    onlyFirst: "Solo Personaje #1",
    shared: "Episodios compartidos",
    onlySecond: "Solo Personaje #2",
    onlyFirstHint: "Episodios del primer personaje que no comparte con el segundo.",
    sharedHint: "Episodios donde aparecen ambos personajes.",
    onlySecondHint: "Episodios del segundo personaje que no comparte con el primero.",
    emptyBucket: "No hay episodios acá para este par.",
    count: (n) => `${n}`,
  },
  theme: {
    toggle: "Cambiar tema",
  },
  language: {
    toggle: "Cambiar idioma / Change language",
  },
  notFound: {
    code: "404",
    title: "Esta dimensión no existe.",
    back: "Volver a la comparación",
  },
  errors: {
    network:
      "No pudimos contactar a la API de Rick & Morty. Revisá tu conexión e intentá de nuevo.",
    notFound: "No encontramos ese personaje.",
    validation: "La API devolvió algo inesperado.",
    rateLimit: "Demasiadas solicitudes — esperá un momento y reintentá.",
    unknown: "Algo salió mal.",
    retry: "Reintentar",
  },
};

export const dictionaries = { es, en };
export type Locale = keyof typeof dictionaries;
export const locales = ["es", "en"] as const;
