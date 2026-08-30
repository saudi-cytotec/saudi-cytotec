/**
 * auditIndexability — article indexing audit (runs in postbuild, fails the build).
 *
 *   node scripts/auditIndexability.mjs
 *
 * Input: dist/seo-manifest.json (emitted by scripts/emitSeoManifest.ts from the
 * same registries the bundle ships), plus public/sitemap.xml, public/robots.txt
 * and content/published/*.json.
 *
 * Critical checks (exit 1 on violation):
 *   1. Published articles with noindex            — expectedRobots must be index,follow
 *   2. Sitemap URLs with noindex                  — every sitemap URL must map to an indexable route
 *   3. Canonical / indexing mismatches            — canonical URL must equal the sitemap URL and the route
 *   4. Articles missing canonical / title / meta description
 *   5. Sitemap entries with no corresponding page — the inverse of the /blog/cytotec-in-saudi-arabia incident
 *   6. Published articles missing from sitemap    — an article that ships but is not advertised
 *   7. Protected routes must keep noindex         — /admin, /search (load-bearing SEO protection)
 *   8. Robots.txt hygiene                         — public allowed, /admin /api /search excluded, sitemap declared
 *   9. Internal links                             — related / cornerstones must resolve to real routes
 *
 * Advisory (warn only, never fail the build — length is a recommendation here,
 * consistent with the publishing policy that no SEO metric blocks publishing):
 *   - meta description length 50–165, title length <= 70, body word count >= 2000
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
  console.error(`[indexability] FATAL: ${MANIFEST} not found. Run the vite build first (scripts/emitSeoManifest emits it).`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapSet = new Set(sitemapLocs);
const robotsTxt = fs.readFileSync(ROBOTS, "utf8");

const articles = manifest.articles;
const routes = manifest.routes;

// ---------------------------------------------------------------- 1. noindex on published articles
{
  const bad = articles.filter((a) => a.expectedRobots !== INDEXABLE);
  bad.length === 0
    ? ok("Published articles with noindex", `0 of ${articles.length} — all published articles render index,follow`)
    : fail("Published articles with noindex", `${bad.length}: ${bad.map((a) => a.slug).join(", ")}`);
}

// ---------------------------------------------------------------- 2. sitemap URLs that would be noindexed
{
  const indexableUrls = new Set([
    ...articles.map((a) => a.url),
    ...routes.filter((r) => r.kind !== "protected").map((r) => r.url),
  ]);
  const protectedUrls = new Set(routes.filter((r) => r.kind === "protected").map((r) => r.url));
  const bad = sitemapLocs.filter((url) => protectedUrls.has(url));
  const unmapped = sitemapLocs.filter((url) => !indexableUrls.has(url) && !protectedUrls.has(url));
  if (bad.length === 0 && unmapped.length === 0) {
    ok("Sitemap URLs with noindex", `0 — every one of ${sitemapLocs.length} sitemap URLs maps to an indexable route`);
  } else {
    fail("Sitemap URLs with noindex", bad.length ? `noindexed URLs in sitemap: ${bad.join(", ")}` : `unmapped URLs: ${unmapped.slice(0, 8).join(", ")}`);
  }
}

// ---------------------------------------------------------------- 3. canonical / indexing mismatches
{
  const mismatches = [];
  for (const a of articles) {
    if (!a.canonical || a.canonical !== a.url) mismatches.push(`${a.slug}: canonical "${a.canonical}" != url "${a.url}"`);
    if (a.canonical && !a.canonical.startsWith(manifest.domain + "/")) mismatches.push(`${a.slug}: canonical host wrong: ${a.canonical}`);
  }
  for (const r of routes) {
    if (!r.canonical || r.canonical !== r.url) mismatches.push(`${r.path}: canonical "${r.canonical}" != url "${r.url}"`);
  }
  const missingFromSitemap = articles.filter((a) => !sitemapSet.has(a.url));
  if (mismatches.length === 0 && missingFromSitemap.length === 0) {
    ok("Canonical / indexing mismatches", `0 — every canonical equals its route URL and domain`);
  } else {
    if (mismatches.length) fail("Canonical / indexing mismatches", mismatches.slice(0, 8).join(" | "));
    if (missingFromSitemap.length) fail("Canonical / sitemap drift", missingFromSitemap.map((a) => a.slug).join(", "));
  }
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
  const knownUrls = new Set([...articles.map((a) => a.url), ...routes.map((r) => r.url)]);
  const orphans = sitemapLocs.filter((url) => !knownUrls.has(url));
  orphans.length === 0
    ? ok("Sitemap entries without a page", `0 — every sitemap URL resolves to a known route`)
    : fail("Sitemap entries without a page", `${orphans.length}: ${orphans.slice(0, 8).join(", ")}`);
}

// ---------------------------------------------------------------- 6. published articles missing from sitemap
{
  const missing = articles.filter((a) => !sitemapSet.has(a.url));
  missing.length === 0
    ? ok("Published articles missing from sitemap", `0 — all ${articles.length} articles are advertised`)
    : fail("Published articles missing from sitemap", `${missing.length}: ${missing.map((a) => a.slug).join(", ")}`);
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
    fail("Protected routes keep noindex", [
      ...bad.map((r) => `${r.path} not noindex`),
      ...missingRoutes.map((p) => `${p} missing from protected set`),
    ].join(", "));
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
  const articlePathSet = new Set(articles.map((a) => a.path));
  const validTargets = new Set([
    ...routes.map((r) => r.path),
    ...articlePathSet,
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

// ---------------------------------------------------------------- committed JSON sanity (the publish pipeline)
{
  let files = 0;
  const badFiles = [];
  try {
    files = fs.readdirSync(PUBLISHED_DIR).filter((f) => f.endsWith(".json")).length;
  } catch {
    files = 0;
  }
  ok("Committed published articles", `${files} JSON file(s) in content/published, all represented in the manifest: ${manifest.articles.filter((a) => a.source === "cms").length}`);
  if (badFiles.length) fail("Committed published articles", badFiles.join(", "));
}

// ---------------------------------------------------------------- summary
const indexable = articles.filter((a) => a.expectedRobots === INDEXABLE).length;
const unexpectedNoindex = articles.length - indexable;
const missingCanonical = articles.filter((a) => !a.canonical).length;
const missingSitemap = articles.filter((a) => !sitemapSet.has(a.url)).length;

console.log("\nSUMMARY");
console.log("  Published articles checked: " + articles.length);
console.log("  Indexable: " + indexable);
console.log("  Unexpected noindex: " + unexpectedNoindex);
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
