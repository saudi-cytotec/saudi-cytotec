import type { ContentBlock } from "../types";

/** Depth target used by the CMS generation pipeline for NEW drafts. */
export const MIN_BODY_WORDS = 2000;

/**
 * Catalog floor for the 95 published articles.
 *
 * docs/article-quality-audit.md sets the review policy for the static catalog as
 * "700-1500 words of UNIQUE content per article, not 2000+ with 50% boilerplate".
 * The catalog is therefore measured against that floor: an article below it is
 * genuinely thin, while a longer article that repeats shared boilerplate is not
 * better. Depth beyond the floor is optional and belongs to the editorial layer
 * (per-article enrichment in src/data/articles/enrich.ts).
 */
export const CATALOG_MIN_BODY_WORDS = 700;

/** Informational only: how many articles go beyond the deep-dive target. */
export const DEEP_DIVE_BODY_WORDS = 2000;

const DISCLAIMER_RE = /إخلاء المسؤولية|لا يُعد استشارة طبية|لا يغني عن مراجعة|لا يغني عن الاستشارة/;

export function isDisclaimerBlock(block: ContentBlock): boolean {
  const text = `${block.text ?? ""} ${(block.items ?? []).join(" ")}`;
  return DISCLAIMER_RE.test(text);
}

export function bodyPlainText(blocks: ContentBlock[]): string {
  return blocks
    .filter((block) => !isDisclaimerBlock(block))
    .map((block) => {
      if (block.type === "ul") return (block.items ?? []).join(" ");
      return block.text ?? "";
    })
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`]/g, " ");
}

export function countArabicWords(text: string): number {
  return text
    .trim()
    .split(/[\s\u00A0\u060C\u061B]+/)
    .map((token) => token.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, ""))
    .filter((token) => token.length > 0).length;
}

export function bodyWordCount(blocks: ContentBlock[]): number {
  return countArabicWords(bodyPlainText(blocks));
}

export function bodyStructure(blocks: ContentBlock[]) {
  const main = blocks.filter((block) => !isDisclaimerBlock(block));
  return {
    wordCount: bodyWordCount(blocks),
    paragraphs: main.filter((block) => block.type === "p").length,
    h2: main.filter((block) => block.type === "h2").length,
    h3: main.filter((block) => block.type === "h3").length,
    lists: main.filter((block) => block.type === "ul").length,
    callouts: main.filter((block) => block.type === "callout").length,
  };
}
