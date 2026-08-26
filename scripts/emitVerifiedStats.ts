import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import { testArticle, testGeneration } from "../src/cms/testArticle";
import { bodyStructure, bodyWordCount, MIN_BODY_WORDS } from "../src/utils/bodyWordCount";

export function emitVerifiedStats(): Plugin {
  return {
    name: "emit-verified-stats",
    buildStart() {
      const all = articles.map((article) => {
        const s = bodyStructure(article.blocks);
        return {
          slug: article.slug,
          cluster: article.cluster,
          wordCount: s.wordCount,
          paragraphs: s.paragraphs,
          h2: s.h2,
          h3: s.h3,
          passes: s.wordCount >= MIN_BODY_WORDS,
        };
      });
      const failing = all.filter((a) => !a.passes).sort((a, b) => a.wordCount - b.wordCount);
      const min = all.reduce((m, a) => (a.wordCount < m.wordCount ? a : m), all[0]);
      const testWords = bodyWordCount(testArticle.blocks);
      const testStructure = bodyStructure(testArticle.blocks);
      const report = {
        totalArticles: all.length,
        passingArticles: all.length - failing.length,
        failingArticles: failing.length,
        minArticle: min,
        failingSample: failing.slice(0, 8),
        testArticle: {
          slug: testArticle.slug,
          wordCount: testWords,
          pipelineWordCount: testGeneration.wordCount,
          paragraphs: testStructure.paragraphs,
          h2: testStructure.h2,
          h3: testStructure.h3,
          passes: testWords >= MIN_BODY_WORDS,
        },
      };
      fs.writeFileSync(path.resolve("verified-stats.json"), `${JSON.stringify(report, null, 2)}\n`);
      if (failing.length > 0) {
        throw new Error(
          `Body word count gate failed for ${failing.length} article(s). Min ${min.slug}=${min.wordCount}.`,
        );
      }
    },
  };
}
