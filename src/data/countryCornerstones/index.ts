import type { StaticPage } from "../../types";
import { bahrainCornerstone } from "./bahrain";
import { kuwaitCornerstone } from "./kuwait";
import { saudiArabiaCornerstone } from "./saudiArabia";
import { uaeCornerstone } from "./uae";
import type { CountryCornerstone } from "./types";

export type { CountryCornerstone } from "./types";

/** Hand-authored country guides; never generate city/name-swapped variants. */
export const countryCornerstones: CountryCornerstone[] = [
  saudiArabiaCornerstone,
  uaeCornerstone,
  kuwaitCornerstone,
  bahrainCornerstone,
];

export function isCountryCornerstone(page: StaticPage): page is CountryCornerstone {
  return "kind" in page && page.kind === "country-cornerstone";
}

export function countryReferenceIds(page: CountryCornerstone): string[] {
  return [...new Set([
    ...page.introSources,
    page.emergency.source,
    ...page.sections.flatMap((section) => section.sources),
    ...page.faqs.flatMap((faq) => faq.sources),
  ])];
}
