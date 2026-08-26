export const MIN_BODY_WORDS = 2000;
const DISCLAIMER_RE = /إخلاء المسؤولية|لا يُعد استشارة طبية|لا يغني عن مراجعة|لا يغني عن الاستشارة/;

export function isDisclaimerBlock(block) {
  const text = `${block?.text ?? ""} ${(block?.items ?? []).join(" ")}`;
  return DISCLAIMER_RE.test(text);
}

export function bodyPlainText(blocks) {
  return (blocks || [])
    .filter((block) => !isDisclaimerBlock(block))
    .map((block) => (block.type === "ul" ? (block.items || []).join(" ") : block.text || ""))
    .join(" ")
    .replace(/<[^>]+>/g, " ");
}

export function countArabicWords(text) {
  return String(text || "")
    .trim()
    .split(/[\s\u00A0\u060C\u061B]+/)
    .map((token) => token.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, ""))
    .filter((token) => token.length > 0).length;
}

export function bodyWordCount(blocks) {
  return countArabicWords(bodyPlainText(blocks));
}

export function bodyStructure(blocks) {
  const main = (blocks || []).filter((block) => !isDisclaimerBlock(block));
  return {
    wordCount: bodyWordCount(blocks),
    paragraphs: main.filter((block) => block.type === "p").length,
    h2: main.filter((block) => block.type === "h2").length,
    h3: main.filter((block) => block.type === "h3").length,
  };
}
