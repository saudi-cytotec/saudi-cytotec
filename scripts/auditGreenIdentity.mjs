/**
 * auditGreenIdentity — enforces the unified green brand identity.
 *
 *   node scripts/auditGreenIdentity.mjs
 *
 * Rules:
 *   1. The approved brand tokens in src/index.css resolve to green:
 *      --color-brand #0f6b4a, --color-brand-deep #0a4a33, --color-accent
 *      #16a34a (exact values, green hue range 80–170°).
 *   2. No legacy navy hex values anywhere in src/ or index.html.
 *   3. No pale-blue backgrounds: no blue Tailwind bg-* classes and no
 *      pale-blue hexes in src/.
 *   4. No navy rgb() shadows (rgb(11 37 69 …)) anywhere in src/.
 *   5. PageHero (the internal page header behind /medical-uses etc.) uses
 *      the green brand tokens — no navy gradient stop.
 *   6. WhatsApp CTAs are WhatsApp green (bg #16a34a) with white text —
 *      never black text on a dark background.
 *
 * Console-only report (no files written). Exit 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const INDEX_HTML = path.join(ROOT, "index.html");
const CSS = path.join(SRC, "index.css");
const PAGE_HERO = path.join(SRC, "components", "PageHero.tsx");
const WA_COMPONENT = path.join(SRC, "components", "WhatsAppContact.tsx");

const results = [];
let criticals = 0;

function report(section, ok, detail) {
  results.push({ section, ok, detail });
  if (!ok) criticals++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${section} — ${detail}`);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function hue(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return -1;
  const d = max - min;
  let hh;
  if (max === r) hh = ((g - b) / d) % 6;
  else if (max === g) hh = (b - r) / d + 2;
  else hh = (r - g) / d + 4;
  hh *= 60;
  return hh < 0 ? hh + 360 : hh;
}

const css = fs.readFileSync(CSS, "utf8");
const token = (name) => (css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`)) || [])[1] || "";

console.log("GREEN IDENTITY AUDIT — unified green brand\n");

// 1. brand tokens are the approved greens
for (const [name, expected] of [
  ["color-brand", "#0f6b4a"],
  ["color-brand-deep", "#0a4a33"],
  ["color-accent", "#16a34a"],
]) {
  const value = token(name);
  const h = hue(value);
  const ok = value.toLowerCase() === expected && h >= 80 && h <= 170;
  report(`--${name} is the approved green ${expected}`, ok, value ? `${value} (hue ${h.toFixed(0)}°)` : "token missing");
}

// 2. no navy hexes in src/ or index.html
const NAVY = ["#0b2545", "#102c52", "#1e3a5f", "#0e2a47", "#112d4e", "#0f3460", "#12325e", "#132f4c", "#0d2b45", "#12304e"];
const navyHits = [];
for (const f of [...walk(SRC), INDEX_HTML].filter((f) => fs.existsSync(f))) {
  const text = fs.readFileSync(f, "utf8").toLowerCase();
  for (const hex of NAVY) {
    if (text.includes(hex)) navyHits.push(`${path.relative(ROOT, f)}: ${hex}`);
  }
}
report("no legacy navy hex values", navyHits.length === 0, navyHits.length === 0 ? "src/ + index.html clean" : navyHits.join("; "));

// 3. no pale-blue backgrounds
const PALE_BLUE_HEX = ["#f2f8fe", "#e7f0fc", "#d9e8f9", "#eff6ff", "#dbeafe", "#f0f9ff", "#e0f2fe", "#f8fafc"];
const PALE_BLUE_CLASS = ["bg-sky-50", "bg-blue-50", "bg-sky-100", "bg-blue-100", "bg-sky-200", "bg-blue-200", "bg-sky-300", "bg-blue-300"];
const blueHits = [];
for (const f of walk(SRC)) {
  const text = fs.readFileSync(f, "utf8").toLowerCase();
  for (const hex of PALE_BLUE_HEX) if (text.includes(hex)) blueHits.push(`${path.relative(ROOT, f)}: ${hex}`);
  for (const cls of PALE_BLUE_CLASS) if (text.includes(cls)) blueHits.push(`${path.relative(ROOT, f)}: ${cls}`);
}
report("no pale-blue backgrounds in src/", blueHits.length === 0, blueHits.length === 0 ? "no blue bg classes/hexes" : blueHits.join("; "));

// 4. no navy rgb shadows
const shadowHits = [];
for (const f of walk(SRC)) {
  const text = fs.readFileSync(f, "utf8");
  if (text.includes("rgb(11 37 69") || text.includes("rgb(11_37_69")) shadowHits.push(path.relative(ROOT, f));
}
report("no navy rgb(11 37 69) shadows", shadowHits.length === 0, shadowHits.length === 0 ? "all shadows neutral/green" : shadowHits.join("; "));

// 5. PageHero uses the green brand tokens
const hero = fs.readFileSync(PAGE_HERO, "utf8");
report("PageHero gradient uses green brand tokens", hero.includes("from-brand-deep") && !hero.includes("#102c52"), "deep-green gradient, no navy stop");

// 6. WhatsApp CTA color rules
const wa = fs.readFileSync(WA_COMPONENT, "utf8");
report("WhatsApp CTA is WhatsApp green bg-[#16a34a]", wa.includes("bg-[#16a34a]"), "primary CTA green present");
report("WhatsApp CTA text is white (no black on dark)", wa.includes("text-white") && !wa.includes("text-black") && !wa.includes("text-ink"), "white text, no black text in the component");

console.log(`\nGREEN IDENTITY AUDIT: ${criticals === 0 ? "PASS" : "FAIL"} (${results.length - criticals}/${results.length} checks)`);
process.exit(criticals === 0 ? 0 : 1);
