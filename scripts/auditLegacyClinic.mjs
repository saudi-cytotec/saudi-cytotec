/**
 * auditLegacyClinic — guards the OLD CLINIC DATA against silent replacement.
 *
 *   node scripts/auditLegacyClinic.mjs
 *
 * Why this exists: an official WhatsApp channel (00966530945626) was added to
 * this site in dedicated CTA slots (header bar, hero, floating button, article
 * banner, /contact WhatsApp card, footer WhatsApp button). A number-unification
 * audit of that kind must NEVER swallow the clinic's own record. This script is
 * the counterweight: it proves the old data is still there, and that the new
 * number is still only in the WhatsApp CTA slots.
 *
 * Checks
 *   1. "دكتور هيثم الخطيب" is present, defined exactly once in
 *      src/data/clinic.ts, and consumed from there (no copy-paste forks).
 *   2. "00966599287172" (the old clinic phone) is present and defined exactly
 *      once in src/data/clinic.ts.
 *   3. The two are wired into the live site: Footer (every prerendered page),
 *      LegacyClinicCard used by /contact, and the no-JS fallback in index.html.
 *   4. Both survive the actual build: the RENDERED HTML of the built home and
 *      of /contact carries the doctor name and the old phone (inlined JS is
 *      stripped first, so this is rendered content, not bundle strings).
 *   5. The old phone is a phone only: it never appears in any wa.me link.
 *   6. The NEW number 00966530945626 (and its +966 53 094 5626 display form)
 *      appears ONLY in WhatsApp CTA places: an allow-listed file set, and in
 *      src/ only on lines that also speak about WhatsApp.
 *   7. No substitution happened: every mention of the doctor name still sits
 *      next to the old phone, and no line that names the doctor carries the
 *      WhatsApp number in place of it.
 *   8. The clinic pair is NOT merged into the official line registry
 *      (src/data/contact.ts) nor into article content — old clinic data stays
 *      in its own module, so the two channels cannot conflict.
 *   9. Future-proofing: scripts/auditWhatsApp.mjs must not list the old number
 *      among its RETIRED numbers (that would delete the clinic record), and it
 *      must keep src/data/clinic.ts in its legacy allow-list.
 *
 * Console-only report (writes no files). Exit 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DOCTOR = "دكتور هيثم الخطيب";
const OLD_PHONE = "00966599287172";
const OLD_PHONE_DIGITS = "966599287172";
const NEW_RAW = "00966530945626";
const NEW_DIGITS = "966530945626";
const NEW_DISPLAY = "+966 53 094 5626";

const CLINIC_MODULE = path.join("src", "data", "clinic.ts");
const TEXT_EXT = /\.(ts|tsx|js|mjs|cjs|json|md|html|txt|xml|css)$/;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".cache"]);

/**
 * Files allowed to carry the NEW WhatsApp number: the single source of truth,
 * the WhatsApp CTA slots, the contact registry that publishes the channel,
 * the static shell, the audits that must name it to enforce it, and the
 * reports that document the decision.
 */
const NEW_NUMBER_ALLOW = new Set([
  path.join("src", "data", "conversion.ts"),
  path.join("src", "data", "contact.ts"),
  path.join("src", "components", "Header.tsx"),
  path.join("src", "components", "Footer.tsx"),
  path.join("src", "components", "WhatsAppContact.tsx"),
  "index.html",
  path.join("scripts", "auditWhatsApp.mjs"),
  path.join("scripts", "auditPrerender.mjs"),
  path.join("scripts", "auditLegacyClinic.mjs"),
  path.join("scripts", "prerender.mjs"),
  path.join("docs", "competitor-research.md"),
  path.join("docs", "final-audit-2026.md"),
  "SAUDIERSAA-IMPLEMENTATION-REPORT.md",
]);

const results = [];
let criticals = 0;
function report(section, ok, detail) {
  results.push({ section, ok, detail });
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${section} — ${detail}`);
  if (!ok) criticals++;
}

const read = (f) => fs.readFileSync(f, "utf8");
const rel = (f) => path.relative(ROOT, f).split(path.sep).join("/");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (TEXT_EXT.test(entry.name)) out.push(full);
  }
  return out;
}

const textFiles = walk(ROOT);
const srcFiles = walk(path.join(ROOT, "src")).filter((f) => /\.(ts|tsx)$/.test(f));
const readSrc = (p) => read(path.join(ROOT, p));

/** Rendered HTML only: drop inlined script bodies so we never match bundle strings. */
function renderedOnly(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/g, " ");
}

console.log("LEGACY CLINIC AUDIT — old clinic data must survive untouched\n");

/* ── 1 + 2: the two legacy values exist, defined exactly once ─────────────── */
{
  const clinic = fs.existsSync(path.join(ROOT, CLINIC_MODULE)) ? readSrc(CLINIC_MODULE) : "";
  report("src/data/clinic.ts exists", clinic.length > 0, clinic.length > 0 ? "legacy clinic module present" : "MISSING");

  const doctorDefs = srcFiles.filter((f) => read(f).includes(`= "${DOCTOR}"`));
  report(
    `doctor name "${DOCTOR}" defined exactly once`,
    doctorDefs.length === 1 && doctorDefs[0] === path.join(ROOT, CLINIC_MODULE),
    doctorDefs.length === 1 ? `only in ${rel(doctorDefs[0])}` : doctorDefs.length === 0 ? "not found in src/" : `defined in: ${doctorDefs.map(rel).join(", ")}`
  );

  const phoneDefs = srcFiles.filter((f) => read(f).includes(`"${OLD_PHONE}"`));
  report(
    `clinic phone "${OLD_PHONE}" defined exactly once`,
    phoneDefs.length === 1 && phoneDefs[0] === path.join(ROOT, CLINIC_MODULE),
    phoneDefs.length === 1 ? `only in ${rel(phoneDefs[0])}` : phoneDefs.length === 0 ? "not found in src/" : `defined in: ${phoneDefs.map(rel).join(", ")}`
  );

  report("legacy phone keeps its original format (00966…, not re-styled)", clinic.includes(`"${OLD_PHONE}"`), "no +966 / spacing rewrite");
}

/* ── 3: the legacy data is wired into the live site ────────────────────────── */
{
  const footer = readSrc(path.join("src", "components", "Footer.tsx"));
  const card = path.join("src", "components", "LegacyClinicCard.tsx");
  const contact = readSrc(path.join("src", "pages", "Contact.tsx"));
  const indexHtml = read(path.join(ROOT, "index.html"));

  report("Footer renders the clinic record", footer.includes("data/clinic") && footer.includes("LEGACY_CLINIC.doctorName") && footer.includes("LEGACY_CLINIC.phone"), "imports src/data/clinic.ts (site-wide, every prerendered page)");
  report("LegacyClinicCard exists and uses both values", fs.existsSync(path.join(ROOT, card)) && read(path.join(ROOT, card)).includes("LEGACY_CLINIC.doctorName") && read(path.join(ROOT, card)).includes("LEGACY_CLINIC.phone"), "doctor name + tel: link");
  report("/contact mounts the clinic card", contact.includes("LegacyClinicCard"), "component used on the contact page");
  report("index.html no-JS fallback keeps the doctor name", indexHtml.includes(DOCTOR), "visible to crawlers and readers without JS");
  report(`index.html no-JS fallback keeps ${OLD_PHONE}`, indexHtml.includes(OLD_PHONE), "literal in the static shell");
  report("index.html still carries the WhatsApp CTA number too", indexHtml.includes(NEW_RAW) || indexHtml.includes(NEW_DIGITS), "old data added alongside — nothing removed");
}

/* ── 4: both values survive the real build ─────────────────────────────────── */
{
  const distHome = path.join(ROOT, "dist", "index.html");
  const distContact = path.join(ROOT, "dist", "contact", "index.html");
  if (!fs.existsSync(distHome)) {
    report("built output carries the clinic record", false, "dist/index.html missing — run npm run build first");
  } else {
    const home = renderedOnly(read(distHome));
    const contactHtml = fs.existsSync(distContact) ? renderedOnly(read(distContact)) : "";
    report(`built home HTML contains "${DOCTOR}"`, home.includes(DOCTOR), "rendered footer text");
    report(`built home HTML contains "${OLD_PHONE}"`, home.includes(OLD_PHONE), "rendered footer tel link");
    if (contactHtml) {
      report(`built /contact HTML contains "${DOCTOR}"`, contactHtml.includes(DOCTOR), "rendered clinic card");
      report(`built /contact HTML contains "${OLD_PHONE}"`, contactHtml.includes(OLD_PHONE), "rendered clinic card");
    } else {
      report("built /contact HTML contains the clinic record", false, "dist/contact/index.html missing — prerender did not run");
    }
    // The WhatsApp CTA must still be there next to it (no replacement either way).
    report("built home HTML keeps the official WhatsApp number", home.includes(NEW_RAW) || home.includes(NEW_DIGITS), "both channels present in the rendered page");
  }
}

/* ── 5: the legacy phone stays a phone (never a WhatsApp link) ─────────────── */
{
  const badWa = [];
  for (const f of textFiles) {
    if (f === path.join(ROOT, "scripts", "auditLegacyClinic.mjs")) continue; // names the digits to forbid them
    for (const m of read(f).matchAll(/wa\.me\/(\d+)/g)) {
      const d = m[1];
      if (d === OLD_PHONE || d === OLD_PHONE_DIGITS || d.endsWith("599287172")) badWa.push(`${rel(f)}: wa.me/${d}`);
    }
  }
  report("no wa.me link uses the clinic phone", badWa.length === 0, badWa.length === 0 ? "clinic phone is tel: only" : badWa.join("; "));

  const clinic = fs.existsSync(path.join(ROOT, CLINIC_MODULE)) ? readSrc(CLINIC_MODULE) : "";
  report("clinic module links the phone with tel:", clinic.includes("`tel:${LEGACY_CLINIC_PHONE}`"), "no messaging-app merge");
}

/* ── 6: the new number lives ONLY in the WhatsApp CTA slots ────────────────── */
{
  const stray = [];
  for (const f of textFiles) {
    if (f === path.join(ROOT, "scripts", "auditLegacyClinic.mjs")) continue;
    const r = rel(f);
    const text = read(f);
    if (!text.includes(NEW_RAW) && !text.includes(NEW_DIGITS) && !text.includes(NEW_DISPLAY)) continue;
    if (!NEW_NUMBER_ALLOW.has(r)) stray.push(r);
  }
  report(`"${NEW_RAW}" confined to WhatsApp CTA files`, stray.length === 0, stray.length === 0 ? `${NEW_NUMBER_ALLOW.size} allowed files` : `unexpected: ${stray.join(", ")}`);

  // Inside src/, every line carrying the new number must be a WhatsApp line.
  // The channel's own modules (conversion.ts / WhatsAppContact.tsx) define and
  // document the number, so they are exempt from the line-context rule.
  const ctxBad = [];
  for (const f of srcFiles) {
    if (/whatsapp|conversion/i.test(path.basename(f))) continue;
    const lines = read(f).split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes(NEW_RAW) && !line.includes(NEW_DIGITS) && !line.includes(NEW_DISPLAY)) continue;
      if (!/whatsapp|واتساب|wa\.me/i.test(line)) ctxBad.push(`${rel(f)}:${i + 1}`);
    }
  }
  report("every src/ line with the new number is a WhatsApp CTA line", ctxBad.length === 0, ctxBad.length === 0 ? "no use as a clinic/general number" : ctxBad.join(", "));
}

/* ── 7: no unintended replacement of the old clinic data ───────────────────── */
{
  // Every file that mentions the doctor must also carry the old phone (or pull
  // it from src/data/clinic.ts). A rewrite that kept the name but swapped the
  // number is exactly what this catches.
  const orphanName = [];
  for (const f of textFiles) {
    const text = read(f);
    if (!text.includes(DOCTOR)) continue;
    if (text.includes(OLD_PHONE) || text.includes("data/clinic")) continue;
    orphanName.push(rel(f));
  }
  report("doctor name never orphaned from the clinic phone", orphanName.length === 0, orphanName.length === 0 ? "all mentions keep the pair" : `missing ${OLD_PHONE}: ${orphanName.join(", ")}`);

  // No line that names the doctor may carry the WhatsApp number as its phone.
  const substituted = [];
  for (const f of textFiles) {
    const lines = read(f).split("\n");
    lines.forEach((line, i) => {
      if (!line.includes(DOCTOR)) return;
      if (line.includes(NEW_RAW) || line.includes(NEW_DIGITS) || line.includes(NEW_DISPLAY)) substituted.push(`${rel(f)}:${i + 1}`);
    });
  }
  report(`no line pairs "${DOCTOR}" with ${NEW_RAW}`, substituted.length === 0, substituted.length === 0 ? "the old number was not substituted" : substituted.join(", "));

  // The old number must still be findable repo-wide (source + static shell).
  const oldHits = textFiles.filter((f) => read(f).includes(OLD_PHONE)).map(rel);
  report(`"${OLD_PHONE}" still present in the repository`, oldHits.length >= 3, `${oldHits.length} file(s): ${oldHits.join(", ")}`);
}

/* ── 8: old clinic data is not merged into other registries/content ────────── */
{
  const contact = readSrc(path.join("src", "data", "contact.ts"));
  report("official line registry stays separate from the clinic record", !contact.includes(OLD_PHONE) && !contact.includes(DOCTOR), "src/data/contact.ts unchanged by the clinic data");

  const articleDirs = [path.join(ROOT, "src", "data", "articles"), path.join(ROOT, "content", "published")];
  const touched = [];
  for (const dir of articleDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of walk(dir)) {
      const text = read(f);
      if (text.includes(OLD_PHONE) || text.includes(NEW_RAW) || text.includes(DOCTOR)) touched.push(rel(f));
    }
  }
  report("article content untouched by both numbers", touched.length === 0, touched.length === 0 ? "no contact data inside articles" : touched.join(", "));
}

/* ── 9: the WhatsApp audit can never "retire" the clinic number ────────────── */
{
  const wa = readSrc(path.join("scripts", "auditWhatsApp.mjs"));
  report("auditWhatsApp does not treat the clinic phone as retired", !wa.includes(`RETIRED = [`) || !/RETIRED = \[[^\]]*"00966599287172"/.test(wa), `${OLD_PHONE} absent from its RETIRED list`);
  report("auditWhatsApp allow-lists the legacy clinic module", wa.includes("data/clinic.ts"), "so a preserved legacy number cannot fail the single-number rule");
  report("auditWhatsApp still pins the official wa.me link", wa.includes(NEW_DIGITS), "wa.me/966530945626 enforcement intact");
}

console.log(`\nLEGACY CLINIC AUDIT: ${criticals === 0 ? "PASS" : "FAIL"} (${results.length - criticals}/${results.length} checks)`);
if (criticals === 0) {
  console.log(`  ✓ "${DOCTOR}" محفوظ  ✓ "${OLD_PHONE}" محفوظ  ✓ ${NEW_RAW} في قنوات واتساب فقط`);
}
process.exit(criticals === 0 ? 0 : 1);
