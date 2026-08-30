/**
 * geoWordCount — quick source-level word counter for the geographic article
 * set (content/published/*.json). Counts ACTUAL ARTICLE BODY words:
 * content blocks (paragraphs, headings, list items, callouts) + FAQ entries.
 * Excludes SEO metadata, navigation, UI chrome, related-articles listings.
 *
 * Usage: node scripts/geoWordCount.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "..", "content", "published");

const GEO_SLUGS = [
  "cytotec-makkah", "cytotec-madinah", "cytotec-buraidah", "cytotec-dammam",
  "cytotec-abha", "cytotec-tabuk", "cytotec-hail", "cytotec-arar",
  "cytotec-jizan", "cytotec-najran", "cytotec-albahah", "cytotec-sakaka",
  "cytotec-saudi-regions", "cytotec-western-region", "cytotec-eastern-region",
  "cytotec-central-region", "cytotec-southern-region", "cytotec-saudi-faq",
  "cytotec-saudi-safety", "cytotec-medical-verification",
];

const words = (t) => (typeof t === "string" ? t.trim().split(/\s+/).filter(Boolean).length : 0);

function bodyWords(article) {
  let n = 0;
  for (const b of article.blocks ?? []) {
    n += words(b.text);
    for (const item of b.items ?? []) n += words(item);
  }
  for (const f of article.faqs ?? []) n += words(f.q) + words(f.a);
  return n;
}

const found = new Map();
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const a = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
  if (GEO_SLUGS.includes(a.slug)) found.set(a.slug, { file, count: bodyWords(a) });
}

let bad = 0;
console.log("ARTICLE | BODY WORD COUNT | STATUS");
console.log("---|---|---");
for (const slug of GEO_SLUGS) {
  const hit = found.get(slug);
  if (!hit) {
    console.log(`${slug} | MISSING | FAIL`);
    bad++;
    continue;
  }
  const ok = hit.count >= 1350 && hit.count <= 1750;
  if (!ok) bad++;
  console.log(`${slug} | ${hit.count} | ${ok ? "PASS" : hit.count < 1350 ? "FAIL (short)" : "WARN (long)"}`);
}
console.log("---");
console.log(`geo articles: ${found.size}/20 · out-of-range: ${bad}`);
process.exit(bad > 0 ? 1 : 0);
