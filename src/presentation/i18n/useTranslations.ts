"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { dictionaries, locales } from "@/presentation/i18n/dictionaries";

const langParser = parseAsStringLiteral(locales).withDefault("es");

export function useLocale() {
  return useQueryState("lang", langParser);
}

export function useTranslations() {
  const [locale] = useLocale();
  return dictionaries[locale];
}
