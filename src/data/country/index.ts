import { saudi } from "./saudi";
import type { CountrySpec } from "./types";

/**
 * Public country scope is intentionally Saudi Arabia only.
 * The other country source files remain in the repository for reference but
 * are not routable or indexable in the deployed site.
 */
export const countryPages: CountrySpec[] = [saudi];

export const countryPageByPath = new Map<string, CountrySpec>(
  countryPages.map((spec) => [spec.path, spec]),
);

export const countryPagePaths = new Set(countryPages.map((spec) => spec.path));

export type { CountrySpec } from "./types";
export { p, h2, ul, callout, warn, info, emergency, links } from "./types";
