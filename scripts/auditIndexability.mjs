/**
 * auditIndexability — article indexing audit (runs in postbuild, fails the build).
 *
 *   node scripts/auditIndexability.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const MANIFEST = path.join(DIST, "seo-manifest.json");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const ROBOTS = path.join(ROOT, "public", "robots.txt");
const PUBLISHED_DIR = path.join(ROOT, "content", "published");

const INDEXABLE = "index,follow,max-image-preview:large";
const NOINDEX = "noindex,nofollow";

let criticals = 0;
const warnings = [];

function ok(section, detail) {
  console.log(`  [PASS] ${section} — ${detail}`);
}
function fail(section, detail) {
  criticals++;
  console.error(`  [FAIL] ${section} — ${detail}`);
}
function warn(section, detail) {
  warnings.push(`${section}: ${detail}`);
  console.log(`  [WARN] ${section} — ${detail}`);
}

console.log("ARTICLE INDEXABILITY AUDIT\n");

if (!fs.existsSync(MANIFEST)) {
  console.error(`[indexability] FATAL: ${MANIFEST} not found. Run the vite build first.`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapSet = new Set(sitemapLocs);
const robotsTxt = fs.readFileSync(ROBOTS, "utf8");

const articles = manifest.articles;
const routes = manifest.routes;
const indexableArticles = articles.filter((a) => a.expectedRobots === INDEXABLE);
const noindexArticles = articles.filter((a) => a.expectedRobots === NOINDEX);

// ---------------------------------------------------------------- 1. article indexing plan sanity
{
  const bad = articles.filter((a) => ![INDEXABLE, NOINDEX].includes(a.expectedRobots));
  if (bad.length) {
    fail("Article indexing plan", `${bad.length}: ${bad.map((a) => `${a.slug}=${a.expectedRobots}`).join(", ")}`);
  } else {
    ok(
      "Article indexing plan",
      `${indexableArticles.length} indexable + ${noindexArticles.length} intentionally noindex article(s)`,
    );
  }
}

// ---------------------------------------------------------------- 2. sitemap URLs must map to indexable routes only
{
  const publicRouteUrls = new Set(routes.filter((r) => r.kind !== "protected").map((r) => r.url));
  const articleUrlMap = new Map(articles.map((a) => [a.url, a]));
  const bad = [];
  const unmapped = [];
  for (const url of sitemapLocs) {
    const article = articleUrlMap.get(url);
    if (article) {
      if (article.expectedRobots !== INDEXABLE || !article.sitemapIncluded) bad.push(url);
      continue;
    }
    if (!publicRouteUrls.has(url)) unmapped.push(url);
  }
  if (bad.length === 0 && unmapped.length === 0) {
    ok("Sitemap URLs with noindex", `0 — every one of ${sitemapLocs.length} sitemap URLs maps to an indexable route`);
  } else {
    if (bad.length) fail("Sitemap URLs with noindex", bad.join(", "));
    if (unmapped.length) fail("Sitemap URLs without a page", unmapped.slice(0, 8).join(", "));
  }
}

// ---------------------------------------------------------------- 3. canonical / route / sitemap consistency
{
  const mismatches = [];
  for (const a of articles) {
    if (!a.canonical || !a.canonical.startsWith(manifest.domain + "/")) {
      mismatches.push(`${a.slug}: canonical host wrong: ${a.canonical}`);
      continue;
    }
    if (a.expectedRobots === INDEXABLE) {
      if (a.canonical !== a.url) mismatches.push(`${a.slug}: canonical "${a.canonical}" != url "${a.url}"`);
      if (!a.sitemapIncluded) mismatches.push(`${a.slug}: indexable article not marked for sitemap`);
      if (!sitemapSet.has(a.url)) mismatches.push(`${a.slug}: missing from sitemap`);
    } else {
      if (a.sitemapIncluded) mismatches.push(`${a.slug}: noindex article should not be in sitemap`);
      if (sitemapSet.has(a.url)) mismatches.push(`${a.slug}: noindex URL appears in sitemap`);
    }
  }
  for (const r of routes) {
    if (!r.canonical || r.canonical !== r.url) mismatches.push(`${r.path}: canonical "${r.canonical}" != url "${r.url}"`);
  }
  mismatches.length === 0
    ? ok("Canonical / indexing mismatches", "0 — indexable routes self-canonicalize; intentional noindex routes stay out of sitemap")
    : fail("Canonical / indexing mismatches", mismatches.slice(0, 8).join(" | "));
}

// ---------------------------------------------------------------- 4. missing canonical / title / description
{
  const missingCanonical = articles.filter((a) => !a.canonical);
  const missingTitle = articles.filter((a) => !a.title || !a.metaTitle);
  const missingDesc = articles.filter((a) => !a.metaDescription || !a.metaDescription.trim());
  const h = (label, items) =>
    items.length === 0 ? ok(label, "0 missing") : fail(label, `${items.length}: ${items.map((a) => a.slug).slice(0, 8).join(", ")}`);
  h("Articles missing canonical", missingCanonical);
  h("Articles missing title", missingTitle);
  h("Articles missing meta description", missingDesc);

  for (const a of articles) {
    const descLen = (a.metaDescription ?? "").length;
    if (descLen && (descLen < 50 || descLen > 165)) warn("Meta description length", `${a.slug}: ${descLen} chars`);
    if ((a.metaTitle ?? "").length > 70) warn("Title length", `${a.slug}: ${(a.metaTitle ?? "").length} chars`);
    if (a.wordCount && a.wordCount < 2000) warn("Body word count", `${a.slug}: ${a.wordCount} words (< 2000, advisory)`);
  }
}

// ---------------------------------------------------------------- 5. sitemap entries without a page
{
  const knownUrls = new Set([
    ...routes.map((r) => r.url),
    ...articles.filter((a) => a.sitemapIncluded).map((a) => a.url),
  ]);
  const orphans = sitemapLocs.filter((url) => !knownUrls.has(url));
  orphans.length === 0
    ? ok("Sitemap entries without a page", `0 — every sitemap URL resolves to a known public route`)
    : fail("Sitemap entries without a page", `${orphans.length}: ${orphans.slice(0, 8).join(", ")}`);
}

// ---------------------------------------------------------------- 6. published articles / sitemap alignment
{
  const missing = indexableArticles.filter((a) => a.sitemapIncluded && !sitemapSet.has(a.url));
  const leaked = noindexArticles.filter((a) => sitemapSet.has(a.url));
  if (missing.length === 0 && leaked.length === 0) {
    ok("Published articles / sitemap alignment", `${indexableArticles.length} indexable article(s) advertised; ${noindexArticles.length} excluded intentionally`);
  } else {
    if (missing.length) fail("Published articles missing from sitemap", `${missing.length}: ${missing.map((a) => a.slug).join(", ")}`);
    if (leaked.length) fail("Noindex articles leaked into sitemap", `${leaked.length}: ${leaked.map((a) => a.slug).join(", ")}`);
  }
}

// ---------------------------------------------------------------- 7. protected routes keep noindex
{
  const protectedRoutes = routes.filter((r) => r.kind === "protected");
  const expectedProtected = new Set(["/admin", "/search"]);
  const bad = protectedRoutes.filter((r) => r.expectedRobots !== NOINDEX);
  const missingRoutes = [...expectedProtected].filter((p) => !protectedRoutes.some((r) => r.path === p));
  if (bad.length === 0 && missingRoutes.length === 0) {
    ok("Protected routes keep noindex", `${protectedRoutes.map((r) => r.path).join(", ")} — noindex,nofollow intact`);
  } else {
    fail(
      "Protected routes keep noindex",
      [...bad.map((r) => `${r.path} not noindex`), ...missingRoutes.map((p) => `${p} missing from protected set`)].join(", "),
    );
  }
}

// ---------------------------------------------------------------- 8. robots.txt hygiene
{
  const problems = [];
  if (!/^User-agent: \*$/m.test(robotsTxt)) problems.push("missing User-agent: *");
  if (!/^Allow: \/$/m.test(robotsTxt)) problems.push("missing Allow: /");
  for (const p of ["/search", "/admin", "/api"]) if (!new RegExp(`^Disallow: ${p}$`, "m").test(robotsTxt)) problems.push(`missing Disallow: ${p}`);
  if (!robotsTxt.includes("Sitemap: " + manifest.domain + "/sitemap.xml")) problems.push("sitemap not declared");
  for (const p of ["/blog", "/images", "/assets"]) if (new RegExp(`^Disallow: ${p}`, "m").test(robotsTxt)) problems.push(`unexpected Disallow: ${p}`);
  if (/^Disallow: \/$/m.test(robotsTxt)) problems.push("everything disallowed");
  problems.length === 0
    ? ok("Robots.txt", "public allowed; /search /admin /api excluded; sitemap declared; assets allowed")
    : fail("Robots.txt", problems.join("; "));
}

// ---------------------------------------------------------------- 9. internal links resolve
{
  const validTargets = new Set([
    ...routes.map((r) => r.path),
    ...manifest.allArticleSlugs.map((s) => `/blog/${s}`),
  ]);
  const broken = [];
  for (const a of articles) {
    for (const slug of a.related) {
      if (!manifest.allArticleSlugs.includes(slug)) broken.push(`${a.slug} → related "${slug}"`);
    }
    for (const cs of a.cornerstones) {
      if (!validTargets.has(cs)) broken.push(`${a.slug} → cornerstone "${cs}"`);
    }
  }
  broken.length === 0
    ? ok("Internal links (related / cornerstones)", "all targets resolve to known routes")
    : fail("Internal links (related / cornerstones)", `${broken.length}: ${broken.slice(0, 8).join(", ")}`);
}

// ---------------------------------------------------------------- committed JSON sanity
{
  let files = 0;
  try {
    files = fs.readdirSync(PUBLISHED_DIR).filter((f) => f.endsWith(".json")).length;
  } catch {
    files = 0;
  }
  ok("Committed published articles", `${files} JSON file(s) in content/published, represented in the manifest: ${manifest.articles.filter((a) => a.source === "cms").length}`);
}

// ---------------------------------------------------------------- summary
const missingCanonical = articles.filter((a) => !a.canonical).length;
const missingSitemap = indexableArticles.filter((a) => a.sitemapIncluded && !sitemapSet.has(a.url)).length;

console.log("\nSUMMARY");
console.log("  Published articles checked: " + articles.length);
console.log("  Indexable: " + indexableArticles.length);
console.log("  Intentional noindex: " + noindexArticles.length);
console.log("  Missing canonical: " + missingCanonical);
console.log("  Missing sitemap entry: " + missingSitemap);
console.log("  Sitemap URLs: " + sitemapLocs.length + " (duplicates: " + (sitemapLocs.length - sitemapSet.size) + ")");
console.log("  Warnings (advisory): " + warnings.length);
for (const w of warnings) console.log("    - " + w);

if (criticals) {
  console.error(`\nARTICLE INDEXABILITY AUDIT: FAIL (${criticals} critical)`);
  process.exit(1);
}
console.log("\nARTICLE INDEXABILITY AUDIT: PASS");
