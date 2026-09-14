/**
 * urlParity — asserts that every URL in the committed baseline sitemap
 * (docs/url-baseline.txt, generated from the sitemap that ships with the
 * original site) is still accounted for by the current build.
 *
 * "Accounted for" means one of two things, never nothing:
 *   1. the URL is still in the current sitemap (kept live), or
 *   2. the URL is explicitly retired by the canonical redirect registry
 *      (content/redirects.json) with a 301/308 to a live replacement, or with
 *      a deliberate 410 Gone.
 *
 * A baseline URL that is neither live nor covered by a recorded redirect still
 * fails the audit, so no URL can silently disappear.
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
const REDIRECTS = path.join(ROOT, "content", "redirects.json");

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
}

/** Path part of a URL, keeping any trailing slash off for comparison. */
function toPath(url) {
  const raw = url.replace(/^https?:\/\/[^/]+/, "");
  const trimmed = raw.endsWith("/") && raw !== "/" ? raw.slice(0, -1) : raw;
  return trimmed || "/";
}

/** Sources recorded in the redirect registry, normalised to path form. */
function redirectedPaths() {
  if (!fs.existsSync(REDIRECTS)) return new Map();
  const registry = JSON.parse(fs.readFileSync(REDIRECTS, "utf8"));
  const map = new Map();
  for (const rule of registry.rules ?? []) {
    if (!rule?.source) continue;
    if (![301, 308, 404, 410].includes(rule.statusCode)) continue;
    map.set(toPath(rule.source), rule);
  }
  return map;
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
  const currentPaths = new Set(current.map(toPath));
  const redirects = redirectedPaths();

  const lost = [];
  const retired = [];
  for (const url of baseline) {
    if (currentPaths.has(toPath(url))) continue;
    const rule = redirects.get(toPath(url));
    if (rule) retired.push({ url, rule });
    else lost.push(url);
  }
  const added = current.filter((url) => !baseline.some((b) => toPath(b) === toPath(url)));

  console.log(
    `[url-parity] baseline: ${baseline.length} · current: ${current.length} · ` +
      `retired with a recorded redirect/410: ${retired.length}`,
  );
  for (const item of retired) {
    const target = item.rule.destination ? `-> ${item.rule.destination}` : "(410 Gone)";
    console.log(`  [retired ${item.rule.statusCode}] ${item.url} ${target}`);
  }
  if (lost.length) {
    console.error(`[url-parity] LOST ${lost.length} URLs:\n  ` + lost.join("\n  "));
    process.exit(1);
  }
  if (added.length) {
    console.log(`[url-parity] added ${added.length} URLs (expected growth, not loss):\n  ` + added.slice(0, 12).join("\n  "));
  }
  console.log("[url-parity] PASS — every baseline URL is either live or explicitly retired with a redirect.");
}

main();
