import type { ContentBlock } from "../types";
import { MIN_BODY_WORDS, bodyStructure, bodyWordCount, isDisclaimerBlock } from "../utils/bodyWordCount";
import { composeLongform, expandLongform, type GenerationRequest } from "./longformEngine";

export type { GenerationRequest };

export interface GenerationResult {
  /** Whether the body reached the recommended depth. Advisory only. */
  meetsRecommendedDepth?: boolean;
  ok: boolean;
  completed: boolean;
  publishAllowed: boolean;
  wordCount: number;
  missingWords: number;
  paragraphs: number;
  h2: number;
  h3: number;
  expansions: number;
  blocks: ContentBlock[];
  error?: string;
}

const MAX_EXPANSIONS = 6;

export function runGenerationPipeline(input: GenerationRequest): GenerationResult {
  let blocks = composeLongform(input);
  let expansions = 0;
  let stats = bodyStructure(blocks);

  while (stats.wordCount < MIN_BODY_WORDS && expansions < MAX_EXPANSIONS) {
    const next = expandLongform(blocks, input, MIN_BODY_WORDS - stats.wordCount, expansions);
    if (next.length === blocks.length) break;
    blocks = next;
    expansions += 1;
    stats = bodyStructure(blocks);
  }

  stats = bodyStructure(blocks);
  const missingWords = Math.max(0, MIN_BODY_WORDS - stats.wordCount);
  const ok = stats.wordCount >= MIN_BODY_WORDS && stats.h2 >= 6 && stats.paragraphs >= 12;
  return {
    ok,
    completed: ok,
    publishAllowed: ok,
    wordCount: stats.wordCount,
    missingWords,
    paragraphs: stats.paragraphs,
    h2: stats.h2,
    h3: stats.h3,
    expansions,
    blocks,
    error: ok
      ? undefined
      : `فشل التوليد: متن المقال ${stats.wordCount} كلمة بعد ${expansions} توسيعات. النشر ممنوع.`,
  };
}

export function reportBodyDepth(blocks: ContentBlock[], input: GenerationRequest): GenerationResult {
  const hasBody = blocks.some((block) => !isDisclaimerBlock(block) && (block.text || block.items?.length));
  if (!hasBody) return runGenerationPipeline(input);
  // Deliberately no expansion loop here.
  //
  // The previous implementation re-generated content in a loop until a word
  // count was reached. That produces repetition and filler, which is a defect
  // in medical content: a reader who gets the same caution three times learns
  // nothing and trusts the page less. Depth is an editorial decision.
  //
  // We report the gap and let the editor decide.
  const working = blocks;
  const expansions = 0;
  const stats = bodyStructure(working);
  const missingWords = Math.max(0, MIN_BODY_WORDS - stats.wordCount);
  const meetsDepth = stats.wordCount >= MIN_BODY_WORDS;
  return {
    ok: true,
    completed: true,
    // Publishing is never gated on depth. Only a technically broken page
    // (invalid slug, empty body) is blocked, by validateArticle.
    publishAllowed: true,
    wordCount: stats.wordCount,
    missingWords,
    paragraphs: stats.paragraphs,
    h2: stats.h2,
    h3: stats.h3,
    expansions,
    blocks: working,
    meetsRecommendedDepth: meetsDepth,
    error: meetsDepth
      ? undefined
      : `تنبيه تحريري: المتن ${stats.wordCount} كلمة، وأقل من العمق المقترح (${MIN_BODY_WORDS}). لا يمنع النشر — وسّعي المحتوى بمعلومات حقيقية لا بتكرار.`,
  };
}

export function mergeGeneratedBlocks(base: ContentBlock[], extra: ContentBlock[]): ContentBlock[] {
  const disclaimer = [...base, ...extra].filter(isDisclaimerBlock);
  const main = [...base, ...extra].filter((block) => !isDisclaimerBlock(block));
  return [...main, ...disclaimer];
}

export { bodyWordCount, MIN_BODY_WORDS };
