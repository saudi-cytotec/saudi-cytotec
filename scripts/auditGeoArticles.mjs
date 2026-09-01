/**
 * auditGeoArticles — full editorial audit of the 20-article geographic layer.
 *
 *   node scripts/auditGeoArticles.mjs
 *
 * Verifies, per article (from content/published/*.json):
 *   existence of the exact 20 slugs · body word count (blocks + FAQs only —
 *   no nav/header/footer/SEO metadata) · unique title / H1 / seoTitle /
 *   metaTitle / metaDescription · slug format · primary & secondary keywords ·
 *   search intent · cluster · FAQs present · references present and valid ·
 *   internal links present · canonical · disclaimer · no forbidden commercial
 *   phrases · keyword density (anti-stuffing).
 *
 * Cross-article:
 *   duplicate FAQ questions · duplicate body paragraphs · cross-posted
 *   8-gram shingle overlap (template detection) · primary keyword collisions.
 *
 * Reference IDs are validated against src/data/references.ts; related slugs
 * against the static article set + the committed geo set; cornerstone paths
 * against known public routes.
 *
 * Writes docs/geo-articles-audit.md and exits 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUB = path.join(ROOT, "content", "published");

const GEO_SLUGS = [
  "cytotec-makkah", "cytotec-madinah", "cytotec-buraidah", "cytotec-dammam",
  "cytotec-abha", "cytotec-tabuk", "cytotec-hail", "cytotec-arar",
  "cytotec-jizan", "cytotec-najran", "cytotec-albahah", "cytotec-sakaka",
  "cytotec-saudi-regions", "cytotec-western-region", "cytotec-eastern-region",
  "cytotec-central-region", "cytotec-southern-region", "cytotec-saudi-faq",
  "cytotec-saudi-safety", "cytotec-medical-verification",
];

const REF_IDS = [
  "fdaLabel", "dailyMed", "whoEml", "whoPph", "medlinePlus", "nhsMedicines",
  "sfda", "moh", "whoSafeMotherhood", "acog", "nice", "cochrane",
  "whoMedicalEligibility", "figo", "ema",
];

const STATIC_SLUGS = (() => {
  const dir = path.join(ROOT, "src", "data", "articles");
  const set = new Set();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of src.matchAll(/slug:\s*"([a-z0-9-]+)"/g)) set.add(m[1]);
  }
  return set;
})();

const ROUTES = new Set([
  "/", "/about", "/privacy", "/contact", "/faq", "/safety", "/what-is-cytotec",
  "/misoprostol", "/medical-uses", "/medical-sources", "/medical-disclaimer",
  "/when-to-see-doctor", "/womens-health", "/early-pregnancy", "/side-effects",
  "/blog", "/topics", "/service-areas", "/sitemap", "/search",
]);

const words = (t) => (typeof t === "string" ? t.trim().split(/\s+/).filter(Boolean) : []);

function bodyWords(a) {
  let n = 0;
  for (const b of a.blocks ?? []) {
    n += words(b.text).length;
    for (const it of b.items ?? []) n += words(it).length;
  }
  for (const f of a.faqs ?? []) n += words(f.q).length + words(f.a).length;
  return n;
}

function shingles(text, n = 8) {
  const w = words(text).map((x) => x.replace(/[^\p{L}\p{N}]/gu, ""));
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

// Forbidden commercial / promotional phrasing (rooted in the editorial policy)
// Only AFFIRMATIVE selling language fails: statements that explicitly deny
// sale/shipping/availability ("لا نبيع", "لا نوصل الدواء", "يجب الإبلاغ عنها")
// are anti-commercial safety messaging and are the whole point of this layer.
const FORBIDDEN = [
  /سعر[^.]{0,12}(?:ريال|درهم)/, /نوفر الدواء/, /نبيع/, /للبيع/, /توصيل الدواء/,
  /نوصل الدواء/, /متوفر لدينا/, /اشتري الآن/, /خصم \d+/, /غسيل /, /توصيل مجاني/, /نشحن/,
];
const NEGATION_CONTEXT = /(لا|لن|ليس|ليست|نرفض|تجاهلي|احذري|تدعي|الإبلاغ|حذر|تحذير|ممنوع)\s|^(لا|لن)\s/;

function commercialViolations(a) {
  const out = [];
  const texts = [];
  for (const b of a.blocks ?? []) {
    if (b.text) texts.push(b.text);
    for (const it of b.items ?? []) texts.push(it);
  }
  for (const f of a.faqs ?? []) texts.push(`${f.q} ${f.a}`);
  for (const t of texts) {
    for (const rx of FORBIDDEN) {
      for (const m of t.matchAll(new RegExp(rx.source, "g"))) {
        const sentStart = t.lastIndexOf(".", m.index) + 1;
        const sentEnd = (() => {
          const cands = [".", "؟", "!", "؛"].map((c) => t.indexOf(c, m.index)).filter((x) => x > 0);
          return cands.length ? Math.min(...cands) : t.length;
        })();
        const sentence = t.slice(sentStart, sentEnd);
        if (!NEGATION_CONTEXT.test(sentence)) out.push(m[0]);
      }
    }
  }
  return out;
}

const failures = [];
const warnings = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
};

const articles = new Map();
for (const f of fs.readdirSync(PUB).filter((x) => x.endsWith(".json"))) {
  const a = JSON.parse(fs.readFileSync(path.join(PUB, f), "utf8"));
  articles.set(a.slug, a);
}

const rows = [];
const seen = { title: new Map(), h1: new Map(), seoTitle: new Map(), metaTitle: new Map(), metaDesc: new Map(), pkw: new Map() };
const allFaqQ = new Map();
const allParas = new Map();
const shingleMap = new Map();

for (const slug of GEO_SLUGS) {
  const a = articles.get(slug);
  if (!a) {
    rows.push({ slug, count: 0, status: "MISSING" });
    failures.push(`${slug}: MISSING — required article does not exist`);
    continue;
  }

  const wc = bodyWords(a);
  const row = {
    slug,
    title: a.title ?? "",
    h1: a.h1 ?? "",
    primary: a.primaryKeyword ?? "",
    secondary: (a.secondaryKeywords ?? []).length,
    intent: a.searchIntent ?? "",
    cluster: a.cluster ?? "",
    faqs: (a.faqs ?? []).length,
    refs: (a.references ?? []).length,
    links: (a.internalLinks ?? []).length + (a.related ?? []).length + (a.cornerstones ?? []).length,
    count: wc,
    status: wc >= 1350 ? "PASS" : "FAIL",
  };
  rows.push(row);

  // word count
  ok(wc >= 1350, `${slug}: body word count ${wc} < 1350 (target ≈1500)`);
  if (wc > 1800) warnings.push(`${slug}: ${wc} words (long)`);

  // core fields
  for (const [k, v] of Object.entries({ title: a.title, h1: a.h1, seoTitle: a.seoTitle, metaTitle: a.metaTitle, metaDescription: a.metaDescription })) {
    ok(typeof v === "string" && v.trim().length > 3, `${slug}: missing ${k}`);
  }
  for (const key of ["title", "h1", "seoTitle", "metaTitle"]) {
    const v = (a[key] ?? "").trim();
    if (v) {
      if (seen[key].has(v)) failures.push(`${slug}: duplicate ${key} with ${seen[key].get(v)}`);
      else seen[key].set(v, slug);
    }
  }
  const md = (a.metaDescription ?? "").trim();
  if (md && (md.length < 50 || md.length > 165)) warnings.push(`${slug}: meta description ${md.length} chars`);
  const mt = (a.metaTitle ?? "").trim();
  if (mt.length > 70) warnings.push(`${slug}: metaTitle ${mt.length} chars`);

  // slug + canonical
  ok(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), `${slug}: slug format invalid`);
  ok(a.canonical === `https://saudiersaa.com/blog/${slug}`, `${slug}: canonical mismatch (${a.canonical})`);

  // keywords + intent
  ok((a.primaryKeyword ?? "").trim().length > 2, `${slug}: missing primaryKeyword`);
  ok(Array.isArray(a.secondaryKeywords) && a.secondaryKeywords.length >= 2, `${slug}: < 2 secondary keywords`);
  ok(["informational", "local", "medical safety", "FAQ"].includes(a.searchIntent), `${slug}: searchIntent invalid`);
  const pk = (a.primaryKeyword ?? "").trim();
  if (pk) {
    if (seen.pkw.has(pk)) failures.push(`${slug}: primary keyword collides with ${seen.pkw.get(pk)}`);
    else seen.pkw.set(pk, slug);
    const bodyText = [
      ...(a.blocks ?? []).map((b) => `${b.text ?? ""} ${(b.items ?? []).join(" ")}`),
      ...(a.faqs ?? []).map((f) => `${f.q} ${f.a}`),
    ].join(" ");
    const total = words(bodyText).length || 1;
    const hits = bodyText.split(pk).length - 1;
    const density = (hits * words(pk).length) / total;
    if (density > 0.03) failures.push(`${slug}: keyword stuffing — primary keyword density ${(density * 100).toFixed(1)}%`);
  }

  // FAQs
  ok(row.faqs >= 3, `${slug}: only ${row.faqs} FAQs`);
  for (const f of a.faqs ?? []) {
    const q = (f.q ?? "").trim();
    if (allFaqQ.has(q)) failures.push(`${slug}: FAQ duplicated with ${allFaqQ.get(q)}: "${q.slice(0, 40)}…"`);
    else allFaqQ.set(q, slug);
  }

  // references
  ok(row.refs >= 3, `${slug}: only ${row.refs} references`);
  for (const r of a.references ?? []) ok(REF_IDS.includes(r), `${slug}: unknown reference id "${r}"`);

  // internal links
  ok(row.links >= 4, `${slug}: fewer than 4 internal links`);
  for (const s of a.related ?? []) {
    ok(GEO_SLUGS.includes(s) || STATIC_SLUGS.has(s), `${slug}: related target not an article: "${s}"`);
  }
  for (const c of a.cornerstones ?? []) {
    const valid = ROUTES.has(c) || c.startsWith("/blog/cluster/") ||
      c.startsWith("/blog/") && (GEO_SLUGS.includes(c.slice(6)) || STATIC_SLUGS.has(c.slice(6)));
    ok(valid, `${slug}: cornerstone target unknown route: "${c}"`);
  }
  ok(a.hasDisclaimer !== false, `${slug}: disclaimer flag off`);

  // forbidden commercial phrasing (affirmative selling only)
  for (const v of commercialViolations(a)) failures.push(`${slug}: commercial phrasing: "${v}"`);

  // cross-article paragraph duplication + shingle overlap
  const paras = (a.blocks ?? []).filter((b) => b.type === "p" || b.type === "callout").map((b) => (b.text ?? "").trim());
  for (const p of paras) {
    const key = p.slice(0, 120);
    if (p.length > 80) {
      if (allParas.has(key)) failures.push(`${slug}: paragraph duplicated with ${allParas.get(key)}: "${p.slice(0, 50)}…"`);
      else allParas.set(key, slug);
    }
  }
  // Canonical clinical safety text (emergency callouts + the danger-signs list)
  // is deliberately consistent across all 20 articles — like a medical
  // disclaimer, rewording warning signs city by city would add risk, not
  // originality. It is therefore exempt from the template-overlap detector;
  // every other paragraph must be unique down to the 8-gram level.
  const dangerIdx = (a.blocks ?? []).findIndex(
    (b) => b.type === "h2" && b.text && b.text.includes("علامات الخطر"),
  );
  const canonical = new Set();
  for (let i = dangerIdx + 1; i < (a.blocks ?? []).length; i++) {
    const b = a.blocks[i];
    if (b.type === "h2") break;
    if (b.text) canonical.add(b.text.trim());
    for (const it of b.items ?? []) canonical.add(it);
  }
  const uniqueParas = paras.filter((p) => !canonical.has(p));
  const bodyJoin = uniqueParas.join(" ");
  const sh = shingles(bodyJoin);
  for (const s of sh) {
    if (shingleMap.has(s)) {
      failures.push(`${slug}: 8-gram overlap with ${shingleMap.get(s)} (template suspicion): "…${s.slice(0, 60)}…"`);
      break; // one signal per article pair is enough to fail loudly
    }
  }
  for (const s of sh) if (!shingleMap.has(s)) shingleMap.set(s, slug);
}

// Extra files are allowed in other editorial clusters; only an additional
// published article labelled geographic would expand the protected 20-page
// layer without an explicit audit update.
const extra = [...articles.values()]
  .filter((a) => a.cluster === "geographic" && !GEO_SLUGS.includes(a.slug))
  .map((a) => a.slug);
if (extra.length) failures.push(`unexpected extra geo articles: ${extra.join(", ")}`);

// ---------------------------------------------------------------- report
const lines = [];
lines.push("# Geographic Articles Audit — 20 articles × ≈1500 words");
lines.push("");
lines.push(`Date: ${new Date().toISOString().slice(0, 10)} · generated by \`scripts/auditGeoArticles.mjs\``);
lines.push("");
lines.push("Word count = actual article body only: content blocks (paragraphs, headings, list");
lines.push("items, callouts) + FAQ entries. Navigation, header, footer, breadcrumbs, SEO metadata,");
lines.push("related-article listings, disclaimer banner and UI chrome are all excluded.");
lines.push("");
lines.push("**Result: " + (failures.length === 0 ? "PASS" : `FAIL (${failures.length} failures)`) + "**");
lines.push("");
lines.push("| # | ARTICLE | WORD COUNT | STATUS |");
lines.push("|---|---------|-----------:|--------|");
rows.forEach((r, i) => lines.push(`| ${i + 1} | ${r.slug} | ${r.count} | ${r.status === "PASS" ? "✅ PASS" : r.status === "MISSING" ? "❌ MISSING" : "❌ FAIL"} |`));
lines.push("");
lines.push(`Range: ${Math.min(...rows.map((r) => r.count))}–${Math.max(...rows.map((r) => r.count))} words · avg ${Math.round(rows.reduce((s, r) => s + r.count, 0) / rows.length)} · target ≈1500`);
lines.push("");
lines.push("## Per-article detail");
lines.push("");
lines.push("| ARTICLE | TITLE | H1 | PKW | 2KW | INTENT | CLUSTER | FAQ | REFS | LINKS | WORDS |");
lines.push("|---------|-------|----|-----|-----|--------|---------|----:|-----:|------:|------:|");
for (const r of rows) {
  lines.push(`| ${r.slug} | ${r.title.replace(/\|/g, "/")} | ${r.h1.replace(/\|/g, "/").slice(0, 60)} | ${r.primary.replace(/\|/g, "/")} | ${r.secondary} | ${r.intent} | ${r.cluster} | ${r.faqs} | ${r.refs} | ${r.links} | ${r.count} |`);
}
lines.push("");
if (warnings.length) {
  lines.push("## Warnings");
  lines.push("");
  for (const w of warnings) lines.push(`- ${w}`);
  lines.push("");
}
if (failures.length) {
  lines.push("## Failures");
  lines.push("");
  for (const f of failures) lines.push(`- ❌ ${f}`);
  lines.push("");
}
fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs", "geo-articles-audit.md"), lines.join("\n") + "\n");

for (const r of rows) console.log(`${r.slug.padEnd(28)} ${String(r.count).padStart(5)} words  ${r.status}`);
console.log("---");
console.log(`failures: ${failures.length}${warnings.length ? ` · warnings: ${warnings.length}` : ""}`);
for (const f of failures) console.log("  ❌ " + f);
process.exit(failures.length ? 1 : 0);
