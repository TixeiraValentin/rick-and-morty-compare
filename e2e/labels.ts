// Accessible labels / copy from the default (Spanish) dictionary, kept here so
// the specs read against stable strings without importing app internals.
export const es = {
  prompt: "Elegí un personaje en cada columna para comparar sus episodios.",
  onlyOne: "Falta uno — elegí un personaje en la otra columna.",
  noMatch: "Ningún personaje coincide con estos filtros.",
  next: "Página siguiente",
  previous: "Página anterior",
  pageInput: "Ir a la página",
  search: "Buscar por nombre",
  status: "Estado",
  species: "Especie",
  clearFilters: "Limpiar filtros",
  swap: "Intercambiar columnas",
  clearSelection: "Limpiar selección",
  theme: "Cambiar tema",
} as const;

// Exact match for `?c1=1` without also matching `?c1=12`.
export const param = (key: string, value: string | number) =>
  new RegExp(`[?&]${key}=${value}(?:&|$)`);
