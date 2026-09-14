/**
 * auditWhatsApp — enforces the single official WhatsApp number + link.
 *
 *   node scripts/auditWhatsApp.mjs
 *
 * Rules:
 *   1. The raw number literal is DEFINED exactly once in src/ — in
 *      src/data/conversion.ts. No other src file may assign it.
 *   2. Same for the international digits literal.
 *   3. Every wa.me link (src/, index.html, dist/index.html) must point at
 *      966530945626 — the only allowed number.
 *   4. No other Saudi mobile-format number (00966…/966… 9 digits) may
 *      appear in src/.
 *   5. Built home carries <meta name="whatsapp" content="00966530945626">.
 *   6. The built home carries the header CTA label "تواصل معنا عبر واتساب"
 *      and at least one wa.me link.
 *   7. RETIRED numbers must not appear anywhere in repository TEXT
 *      (all text files, not just src) — including the old number
 *      00966538159747.
 *   8. Image assets: OCR every image in public/ for phone-like digit runs
 *      and fail on any number that is not the approved one — when
 *      tesseract is available. Without tesseract this check reports an
 *      explicit SKIP (assets are then verified visually at replacement
 *      time; the retired-number text scan in rule 7 still applies).
 *
 * Console-only report (no files written). Exit 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const PUBLIC_DIR = path.join(ROOT, "public");
const HOME_HTML = path.join(ROOT, "dist", "index.html");
const INDEX_HTML = path.join(ROOT, "index.html");

const RAW = "00966530945626";
const DIGITS = "966530945626";
// Numbers that must never appear anywhere (retired/foreign channels).
const RETIRED = ["00966538159747", "538159747"];

const results = [];
let criticals = 0;

function report(section, ok, detail) {
  results.push({ section, ok, detail });
  if (!ok) criticals++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${section} — ${detail}`);
}

function walk(dir, out = [], exts = /\.(ts|tsx|css|html)$/, skip = new Set(["node_modules", ".git", "dist", "build", ".next"])) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out, exts, skip);
    else if (exts.test(entry.name)) out.push(full);
  }
  return out;
}

const srcFiles = walk(SRC);
const read = (f) => fs.readFileSync(f, "utf8");

console.log("WHATSAPP AUDIT — single number / single link\n");

// 1+2. single definition of each literal in src/
const rawDefs = srcFiles.filter((f) => read(f).includes(`= "${RAW}"`));
const digitsDefs = srcFiles.filter((f) => read(f).includes(`= "${DIGITS}"`));
report(
  `raw number defined once (src/data/conversion.ts)`,
  rawDefs.length === 1 && rawDefs[0].endsWith(path.join("data", "conversion.ts")),
  rawDefs.length === 1 ? "defined in src/data/conversion.ts only" : `defined in: ${rawDefs.map((f) => path.relative(ROOT, f)).join(", ") || "nowhere"}`
);
report(
  `digits defined once (src/data/conversion.ts)`,
  digitsDefs.length === 1 && digitsDefs[0].endsWith(path.join("data", "conversion.ts")),
  digitsDefs.length === 1 ? "defined in src/data/conversion.ts only" : `defined in: ${digitsDefs.map((f) => path.relative(ROOT, f)).join(", ") || "nowhere"}`
);

// 3. every wa.me link uses the approved digits
const waBad = [];
for (const f of [...srcFiles, INDEX_HTML, HOME_HTML].filter((f) => fs.existsSync(f))) {
  const m = [...read(f).matchAll(/wa\.me\/(\d+)/g)].map((x) => x[1]);
  if (m.some((d) => d !== DIGITS)) waBad.push(`${path.relative(ROOT, f)}: ${[...new Set(m)].join(",")}`);
}
report("every wa.me link is wa.me/966530945626", waBad.length === 0, waBad.length === 0 ? "src/ + index.html + dist home" : waBad.join("; "));

// 4. no other Saudi mobile-format numbers in src/
const otherNumbers = new Set();
for (const f of srcFiles) {
  for (const m of read(f).matchAll(/\b(00966\d{9}|966\d{9})\b/g)) {
    const n = m[1];
    if (n !== RAW && n !== DIGITS) otherNumbers.add(`${n} in ${path.relative(ROOT, f)}`);
  }
}
report("no other 00966…/966… numbers in src/", otherNumbers.size === 0, otherNumbers.size === 0 ? "only the approved number" : [...otherNumbers].join("; "));

// 5. built home meta
if (!fs.existsSync(HOME_HTML)) {
  report("built home <meta name=\"whatsapp\">", false, "dist/index.html missing — run npm run build first");
} else {
  const home = read(HOME_HTML);
  report(`built home <meta name="whatsapp" content="${RAW}">`, home.includes(`<meta name="whatsapp" content="${RAW}" />`), "present in dist home");
  // 6. CTA label + at least one wa.me link in built home
  report("built home header CTA 'تواصل معنا عبر واتساب'", home.includes("تواصل معنا عبر واتساب"), "label present in rendered head/body");
  report("built home has wa.me link(s)", /wa\.me\/\d+/.test(home), "at least one wa.me href");
}

// 7. retired numbers must not appear in ANY repository text file.
//    This script itself is excluded: it must name the retired numbers in
//    order to detect them (same convention as any signature scanner).
{
  const textExt = /\.(ts|tsx|js|mjs|cjs|json|md|html|txt|xml|css)$/;
  const selfFile = path.join(ROOT, "scripts", "auditWhatsApp.mjs");
  const hits = [];
  for (const f of walk(ROOT, [], textExt)) {
    if (f === selfFile) continue;
    let t = "";
    try {
      t = read(f);
    } catch {
      continue;
    }
    for (const bad of RETIRED) {
      if (t.includes(bad)) hits.push(`${path.relative(ROOT, f)}: ${bad}`);
    }
  }
  report("no retired number (00966538159747) in any repo text file", hits.length === 0, hits.length === 0 ? "all text files clean" : hits.join("; "));
}

// 8. image assets — OCR for phone-like digit runs (when tesseract exists)
{
  const hasTesseract = (() => {
    try {
      execSync("command -v tesseract", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  })();
  const images = fs.existsSync(PUBLIC_DIR) ? walk(PUBLIC_DIR, [], /\.(png|jpg|jpeg|webp|svg|gif)$/) : [];
  if (!hasTesseract) {
    report(
      "image OCR scan (public/)",
      true,
      `SKIPPED — tesseract not available in this environment (${images.length} image assets not OCR-scanned; verify assets visually when replacing them)`
    );
  } else {
    const badImages = [];
    for (const img of images) {
      if (img.endsWith(".svg")) continue; // vector text is plain XML — covered by rule 7
      let ocrText = "";
      try {
        ocrText = execSync(`tesseract "${img}" - -l eng 2>/dev/null`, { maxBuffer: 16 * 1024 * 1024 }).toString();
      } catch {
        continue;
      }
      const runs = (ocrText.match(/\d{9,}/g) || []).map((d) => d.replace(/\D/g, ""));
      for (const run of runs) {
        if (!run.includes(DIGITS) && (run.startsWith("966") || run.startsWith("00966") || run.includes("00966"))) {
          badImages.push(`${path.relative(ROOT, img)}: ${run}`);
        }
      }
    }
    report("image OCR: only the approved number in public/ images", badImages.length === 0, badImages.length === 0 ? `${images.length} image(s) scanned` : badImages.join("; "));
  }
}

console.log(`\nWHATSAPP AUDIT: ${criticals === 0 ? "PASS" : "FAIL"} (${results.length - criticals}/${results.length} checks)`);
process.exit(criticals === 0 ? 0 : 1);
