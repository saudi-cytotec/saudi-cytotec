/**
 * urlParity — asserts that every URL in the committed baseline sitemap
 * (docs/url-baseline.txt, generated from the sitemap that ships with the
 * original site) still exists in the current build's sitemap.
 *
 * No live URL may silently disappear. Exit 1 if anything was lost.
 *
 * Usage: node scripts/urlParity.mjs [--update-baseline]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASELINE = path.join(ROOT, "docs", "url-baseline.txt");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
}

function main() {
  const flag = process.argv.includes("--update-baseline");
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const current = locs(xml);

  if (flag || !fs.existsSync(BASELINE)) {
    fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
    fs.writeFileSync(BASELINE, current.join("\n") + "\n");
    console.log(`[url-parity] baseline written: ${current.length} URLs`);
    return;
  }

  const baseline = fs.readFileSync(BASELINE, "utf8").split("\n").filter(Boolean).sort();
  const lost = baseline.filter((url) => !current.includes(url));
  const added = current.filter((url) => !baseline.includes(url));

  console.log(`[url-parity] baseline: ${baseline.length} · current: ${current.length}`);
  if (lost.length) {
    console.error(`[url-parity] LOST ${lost.length} URLs:\n  ` + lost.join("\n  "));
    process.exit(1);
  }
  if (added.length) {
    console.log(`[url-parity] added ${added.length} URLs (expected growth, not loss):\n  ` + added.slice(0, 12).join("\n  "));
  }
  console.log("[url-parity] PASS — no live URL lost.");
}

main();
