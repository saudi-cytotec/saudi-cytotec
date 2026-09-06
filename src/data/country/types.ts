import type { ArticleFaq } from "../../types";

/**
 * Shared data model for the four country cornerstone pages
 * (/abortion-pills-saudi-arabia, /abortion-pills-uae,
 * /abortion-pills-kuwait, /abortion-pills-bahrain).
 *
 * These pages are educational country cornerstones: they answer the Arabic
 * informational query that pairs the phrase "أدوية إجهاض الحمل" (and the
 * commercial name "سايتوتك") with a country name, then redirect the reader
 * toward licensed care and official sources. They intentionally contain no
 * dosages, no administration instructions, no abortion procedure steps, no
 * prices, no seller contacts, no delivery offers and no commercial links.
 */

/** One inline internal link embedded inside a paragraph via [[label|/path]]. */
export type RichParagraph = string;

export type CountryBlock =
  | { kind: "p"; text: RichParagraph }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "callout"; tone: "info" | "warning" | "emergency"; text: RichParagraph }
  | { kind: "links"; items: { to: string; label: string; note?: string }[] };

export interface CountrySpec {
  /** Lower-case country code used for lookups. */
  code: "sa" | "ae" | "kw" | "bh";
  /** Public route, e.g. /abortion-pills-uae */
  path: string;
  /** Human label used in navigation chips and breadcrumbs. */
  title: string;
  /** Required H1 for the page. */
  h1: string;
  /** Required fixed second statement (e.g. "حبوب سايتوتك في الكويت"). */
  tagline: string;
  /** Country display name as it appears in Arabic copy. */
  countryName: string;
  /** Unique SEO <title> fragment (site name is appended by <Seo>). */
  metaTitle: string;
  /** Unique meta description. */
  metaDescription: string;
  /** Section 2 — short, direct answer shown right under the H1 area. */
  directAnswer: RichParagraph;
  /** Body blocks. Headings cover sections 3..11 (definition → regulatory). */
  body: CountryBlock[];
  /** Section 13 — visible FAQs (8–12 per country, JSON-LD mirrors them). */
  faqs: ArticleFaq[];
  /** Section 12 — official-source reference ids (see src/data/references.ts). */
  references: string[];
  /** Section 14 — related live article slugs (must exist in the catalog). */
  relatedSlugs: string[];
}

/** Tiny builders so content files stay readable. */
export const p = (text: string): CountryBlock => ({ kind: "p", text });
export const h2 = (text: string): CountryBlock => ({ kind: "h2", text });
export const h3 = (text: string): CountryBlock => ({ kind: "h3", text });
export const ul = (items: string[]): CountryBlock => ({ kind: "ul", items });
export const callout = (tone: "info" | "warning" | "emergency", text: string): CountryBlock => ({
  kind: "callout",
  tone,
  text,
});
export const warn = (text: string): CountryBlock => callout("warning", text);
export const info = (text: string): CountryBlock => callout("info", text);
export const emergency = (text: string): CountryBlock => callout("emergency", text);
export const links = (items: { to: string; label: string; note?: string }[]): CountryBlock => ({
  kind: "links",
  items,
});
