/**
 * renderGeoWordCount — rendered-page body word counts for the 20 geo articles.
 *
 *   node scripts/renderGeoWordCount.mjs   (after `npm run build`)
 *
 * Renders the built single-file bundle (dist/index.html) in jsdom at each of
 * the 20 geographic article URLs — exactly what a browser shows — and counts
 * words of the ACTUAL article body only:
 *
 *   INCLUDED   content blocks (p/h2/h3/ul/callout) + the FAQ section
 *   EXCLUDED   nav, header, footer, breadcrumbs, H1/subtitle chrome,
 *              resource-link cards, care-referral CTA, references list,
 *              cluster/cornerstone pills, prev/next nav, related articles,
 *              medical disclaimer, buttons, SEO metadata.
 *
 * Exit 1 if any article renders under MIN words (default 1350).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

process.on("uncaughtException", (err) => {
  console.error("\n[render-count] uncaught exception:", err && err.message);
  process.exit(1);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_HTML = path.join(ROOT, "dist", "index.html");
const DOMAIN = "https://saudiersaa.com";
const MIN = Number(process.env.GEO_MIN_WORDS || 1350);

const SLUGS = [
  "cytotec-makkah", "cytotec-madinah", "cytotec-buraidah", "cytotec-dammam",
  "cytotec-abha", "cytotec-tabuk", "cytotec-hail", "cytotec-arar",
  "cytotec-jizan", "cytotec-najran", "cytotec-albahah", "cytotec-sakaka",
  "cytotec-saudi-regions", "cytotec-western-region", "cytotec-eastern-region",
  "cytotec-central-region", "cytotec-southern-region", "cytotec-saudi-faq",
  "cytotec-saudi-safety", "cytotec-medical-verification",
];

if (!fs.existsSync(DIST_HTML)) {
  console.error("[render-count] dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

const html = fs.readFileSync(DIST_HTML, "utf8");
const chunks = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .filter((c) => c.trim().length > 0);
const bundlePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "saudiersaa-count-")), "bundle.mjs");
fs.writeFileSync(bundlePath, chunks.join("\n"));

const countWords = (t) => (t || "").trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

async function waitFor(fn, ms = 15000) {
  const start = Date.now();
  for (;;) {
    try { if (fn()) return true; } catch { /* poll */ }
    if (Date.now() - start > ms) return false;
    await new Promise((r) => setTimeout(r, 120));
  }
}

const globalsBefore = new Set(Object.keys(globalThis));
const BUNDLE_URL = "file://" + bundlePath.split(path.sep).join("/");

function bodyTextOf(document) {
  const article = document.querySelector("article");
  if (!article) return null;
  const parts = [];
  // 1) content blocks container — the div directly wrapping ContentBlocks
  const blocksDiv = [...article.querySelectorAll("div")].find((d) =>
    d.className && String(d.className).includes("mt-10") && d.querySelector("h2, p, ul"),
  );
  if (blocksDiv) parts.push(blocksDiv.textContent || "");
  // 2) FAQ section — section containing the "أسئلة متكررة" h2
  const faqH2 = [...article.querySelectorAll("h2")].find((h) => h.textContent.includes("أسئلة متكررة"));
  if (faqH2) {
    const sec = faqH2.closest("section");
    if (sec) parts.push(sec.textContent || "");
  }
  return parts.join("\n");
}

const rows = [];
let failures = 0;
for (const slug of SLUGS) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: `${DOMAIN}/blog/${slug}`,
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;
  const setGlobal = (name, value) => {
    try { globalThis[name] = value; }
    catch { Object.defineProperty(globalThis, name, { value, configurable: true, writable: true }); }
  };
  for (const g of ["window", "document", "navigator", "location", "history", "localStorage",
    "sessionStorage", "HTMLElement", "HTMLInputElement", "HTMLAnchorElement", "Element", "Node",
    "DocumentFragment", "Text", "Comment", "Event", "CustomEvent", "EventTarget", "MutationObserver",
    "DOMParser", "MessageChannel", "URL", "URLSearchParams", "getComputedStyle", "Image",
    "IntersectionObserver", "requestAnimationFrame", "cancelAnimationFrame", "matchMedia", "fetch"])
    setGlobal(g, window[g]);
  try { setGlobal("IntersectionObserver", window.IntersectionObserver || class {}); } catch {}
  setGlobal("getComputedStyle", window.getComputedStyle.bind(window));
  setGlobal("requestAnimationFrame", (cb) => setTimeout(cb, 16));
  setGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
  window.fetch = () => Promise.reject(new TypeError("network disabled in verification harness"));
  setGlobal("fetch", window.fetch);

  // cache-busted import: the bundle boots fresh against THIS window
  await import(BUNDLE_URL + "?u=" + encodeURIComponent(slug));

  const ok = await waitFor(() => {
    const h1 = window.document.querySelector("article h1");
    return h1 && h1.textContent.trim().length > 3 && bodyTextOf(window.document) !== null;
  });
  const text = ok ? bodyTextOf(window.document) : null;
  const n = text ? countWords(text) : 0;
  const pass = ok && n >= MIN;
  if (!pass) failures++;
  rows.push({ slug, n, pass, ok });
  dom.window.close();
}

console.log("RENDERED BODY WORD COUNTS (content blocks + FAQ, rendered bundle)");
for (const r of rows) {
  console.log(`${r.slug.padEnd(28)} ${String(r.n).padStart(5)} words  ${r.pass ? "PASS" : r.ok ? "FAIL (<" + MIN + ")" : "FAIL (no render)"}`);
}
console.log("---");
if (failures) { console.log(`failures: ${failures}`); process.exit(1); }
console.log(`all ${rows.length} rendered bodies ≥ ${MIN} words — PASS`);
