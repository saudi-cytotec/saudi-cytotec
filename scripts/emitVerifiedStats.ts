import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import { testArticle, testGeneration } from "../src/cms/testArticle";
import { bodyStructure, bodyWordCount, MIN_BODY_WORDS } from "../src/utils/bodyWordCount";
import { validateArticle } from "../src/utils/validation";

export function emitVerifiedStats(): Plugin {
  return {
    name: "emit-verified-stats",
    buildStart() {
      const words = bodyWordCount(testArticle.blocks);
      const structure = bodyStructure(testArticle.blocks);
      const validation = validateArticle(
        testArticle,
        articles.map((article) => article.slug),
        articles.map((article) => article.title),
      );
      const report = {
        actualBodyWordCount: words,
        pipelineWordCount: testGeneration.wordCount,
        paragraphs: structure.paragraphs,
        h2: structure.h2,
        h3: structure.h3,
        validationOk: validation.ok,
        publishingAllowed: validation.ok && words >= MIN_BODY_WORDS,
        missingWords: Math.max(0, MIN_BODY_WORDS - words),
        functionUsed: "bodyWordCount(testArticle.blocks)",
      };
      fs.writeFileSync(path.resolve("verified-stats.json"), `${JSON.stringify(report, null, 2)}\n`);
      if (words < MIN_BODY_WORDS) {
        throw new Error(`bodyWordCount failed: ${words} < ${MIN_BODY_WORDS}`);
      }
    },
  };
}
