import { saudi } from "./saudi";
import { uae } from "./uae";
import { kuwait } from "./kuwait";
import { bahrain } from "./bahrain";
import type { CountrySpec } from "./types";

/**
 * Country cornerstone pages, in canonical order. Each spec is fully authored
 * content (not a template), with country-specific regulatory framing, FAQs,
 * official sources and internal links. Nothing here is generated or copied
 * between countries beyond the shared helper builders.
 */
export const countryPages: CountrySpec[] = [saudi, uae, kuwait, bahrain];

export const countryPageByPath = new Map<string, CountrySpec>(
  countryPages.map((spec) => [spec.path, spec]),
);

export const countryPagePaths = new Set(countryPages.map((spec) => spec.path));

export type { CountrySpec } from "./types";
export { p, h2, ul, callout, warn, info, emergency, links } from "./types";
