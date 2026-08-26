import type { ContentBlock } from "../types";

export const MIN_BODY_WORDS = 2000;

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
