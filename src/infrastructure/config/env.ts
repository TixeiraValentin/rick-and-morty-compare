export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_RM_API_BASE_URL ?? "https://rickandmortyapi.com/api",
} as const;
