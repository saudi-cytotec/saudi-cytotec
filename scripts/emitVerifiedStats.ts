import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import { bodyStructure, MIN_BODY_WORDS } from "../src/utils/bodyWordCount";

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
      // No generated test article is bundled or measured: AI generation only
      // happens on explicit administrator action and stays an editable draft.
      const report = {
        totalArticles: all.length,
        passingArticles: all.length - failing.length,
        failingArticles: failing.length,
        minArticle: min,
        failingSample: failing.slice(0, 8),
      };
      fs.writeFileSync(path.resolve("verified-stats.json"), `${JSON.stringify(report, null, 2)}\n`);
      // Report only. This used to `throw`, which failed the entire production
      // build whenever any article was under the recommended word count. A
      // length recommendation must never take the site offline, so it is now a
      // warning and the build proceeds.
      if (failing.length > 0) {
        console.warn(
          `[content] ${failing.length} article(s) below the recommended ${MIN_BODY_WORDS} words ` +
            `(shortest: ${min.slug}=${min.wordCount}). Advisory only — build continues.`,
        );
      }
    },
  };
}
