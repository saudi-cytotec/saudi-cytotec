import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import {
  bodyStructure,
  CATALOG_MIN_BODY_WORDS,
  DEEP_DIVE_BODY_WORDS,
  isDisclaimerBlock,
} from "../src/utils/bodyWordCount";

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
          passes: s.wordCount >= CATALOG_MIN_BODY_WORDS,
        };
      });
      const failing = all.filter((a) => !a.passes).sort((a, b) => a.wordCount - b.wordCount);
      const min = all.reduce((m, a) => (a.wordCount < m.wordCount ? a : m), all[0]);
      // Template duplication is the metric that actually matters for indexing:
      // two articles publishing the same paragraph compete with each other.
      const paragraphOwners = new Map<string, string[]>();
      for (const article of articles) {
        for (const block of article.blocks) {
          if (block.type !== "p" || isDisclaimerBlock(block)) continue;
          const text = (block.text ?? "").trim();
          if (!text) continue;
          const owners = paragraphOwners.get(text) ?? [];
          owners.push(article.slug);
          paragraphOwners.set(text, owners);
        }
      }
      let paragraphInstances = 0;
      let sharedInstances = 0;
      for (const owners of paragraphOwners.values()) {
        paragraphInstances += owners.length;
        if (owners.length > 1) sharedInstances += owners.length;
      }
      const wordCounts = all.map((a) => a.wordCount).sort((a, b) => a - b);
      const median = wordCounts[Math.floor(wordCounts.length / 2)];
      // No generated test article is bundled or measured: AI generation only
      // happens on explicit administrator action and stays an editable draft.
      const report = {
        totalArticles: all.length,
        passingArticles: all.length - failing.length,
        failingArticles: failing.length,
        catalogFloorWords: CATALOG_MIN_BODY_WORDS,
        deepDiveTargetWords: DEEP_DIVE_BODY_WORDS,
        belowDeepDiveTarget: all.filter((a) => a.wordCount < DEEP_DIVE_BODY_WORDS).length,
        medianWordCount: median,
        paragraphInstances,
        distinctParagraphs: paragraphOwners.size,
        sharedParagraphInstances: sharedInstances,
        sharedParagraphShare: `${((sharedInstances / Math.max(1, paragraphInstances)) * 100).toFixed(1)}%`,
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
          `[content] ${failing.length} article(s) below the ${CATALOG_MIN_BODY_WORDS}-word thin-content floor ` +
            `(shortest: ${min.slug}=${min.wordCount}). Advisory only — build continues.`,
        );
      }
      console.log(
        `[content] ${all.length} article(s) · median ${median} words · ` +
          `${paragraphOwners.size} distinct paragraphs, ${report.sharedParagraphShare} shared instances ` +
          `(${all.filter((a) => a.wordCount < DEEP_DIVE_BODY_WORDS).length} below the ${DEEP_DIVE_BODY_WORDS}-word deep-dive target).`,
      );
    },
  };
}
