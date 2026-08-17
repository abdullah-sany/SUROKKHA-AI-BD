import en from "./en";
import bn from "./bn";
import type { Language } from "../types";

export const dictionaries: Record<Language, typeof en> = { en, bn };

/** Reads a dotted path like "home.greeting" out of a translation dict. */
function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function translate(language: Language, key: string, vars?: Record<string, string | number>): string {
  const raw = getByPath(dictionaries[language], key) ?? getByPath(dictionaries.en, key);
  if (typeof raw !== "string") return key;
  if (!vars) return raw;
  return Object.entries(vars).reduce((str, [k, v]) => str.replaceAll(`{{${k}}}`, String(v)), raw);
}
