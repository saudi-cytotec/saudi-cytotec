/**
 * Generate the durable architecture reports from the built SEO manifest.
 *
 * Run after `npm run build` so the reports describe the actual shipped catalog,
 * not only source files. The script is intentionally read-only for content: it
 * reports blockers and editorial opportunities without silently redirecting or
 * publishing anything.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");
const MANIFEST_PATH = path.join(ROOT, "dist", "seo-manifest.json");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const ROBOTS_PATH = path.join(ROOT, "public", "robots.txt");
const MAP_PATH = path.join(ROOT, "content", "map.json");
const REDIRECTS_PATH = path.join(ROOT, "content", "redirects.json");
const DATE = new Date().toISOString().slice(0, 10);

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error("[architecture] dist/seo-manifest.json not found — run npm run build first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const sitemap = [...fs.readFileSync(SITEMAP_PATH, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapSet = new Set(sitemap);
const robots = fs.readFileSync(ROBOTS_PATH, "utf8");
const contentMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const redirects = JSON.parse(fs.readFileSync(REDIRECTS_PATH, "utf8"));
const articles = manifest.articles;
const routes = manifest.routes;
const indexable = articles.filter((a) => a.expectedRobots === "index,follow,max-image-preview:large");
const noindex = articles.filter((a) => a.expectedRobots !== "index,follow,max-image-preview:large");
const articleBySlug = new Map(articles.map((a) => [a.slug, a]));

function md(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}
function linkTarget(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();
  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw).pathname;
    } catch {
      return null;
    }
  }
  return raw;
}
function articleSlug(value) {
  const target = linkTarget(value);
  if (!target) return null;
  if (target.startsWith("/blog/") && !target.startsWith("/blog/cluster/")) return target.slice("/blog/".length);
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target)) return target;
  return null;
}
function articleLinks(article) {
  return [
    ...(article.related ?? []),
    ...(article.internalLinks ?? []),
    ...(article.cornerstones ?? []),
    ...(article.resourceLinks ?? []).map((x) => x.to),
  ];
}
function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const value = String(item[key] ?? "").trim();
    if (!value) continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(item);
  }
  return [...groups.entries()].filter(([, values]) => values.length > 1);
}
function write(name, lines) {
  fs.mkdirSync(DOCS, { recursive: true });
  fs.writeFileSync(path.join(DOCS, name), `${lines.join("\n")}\n`);
}

// ---------------------------------------------------------------- content map
const mapItems = contentMap.items ?? [];
const mapPublished = mapItems.filter((item) => ["PUBLISHED", "UPDATED"].includes(item.status));
const knownPaths = new Set([...routes.map((r) => r.path), ...articles.map((a) => a.path)]);
const mapBadTargets = mapItems.filter((item) => item.targetUrl && !knownPaths.has(item.targetUrl));
const publishedMapBadTargets = mapBadTargets.filter((item) => ["PUBLISHED", "UPDATED"].includes(item.status));
const planningMapTargets = mapBadTargets.filter((item) => !["PUBLISHED", "UPDATED"].includes(item.status));
const statusCounts = Object.fromEntries(contentMap.statuses.map((status) => [status, mapItems.filter((i) => i.status === status).length]));
write("content-map-report.md", [
  "# Content Map Report",
  "",
  `Date: ${DATE} · source: \`content/map.json\` + built \`dist/seo-manifest.json\``,
  "",
  "## Search-intent ownership",
  "",
  "| Query / role | One owning URL | Supporting layer | Policy |",
  "|---|---|---|---|",
  "| سايتوتك في السعودية | `/service-areas` | 20 geographic articles + regional articles | The service-area hub is the only pillar for this national query; supporting pages must not copy its title/intent wholesale. |",
  "| ما هو سايتوتك / التعريف | `/what-is-cytotec` | definition articles | Educational definition, not a transactional or geographic substitute. |",
  "| الأمان والتحذيرات | `/safety` | safety and emergency articles | Safety support cluster; no dosing or commercial intent. |",
  "",
  "## Catalog snapshot",
  "",
  `- Content-map topics: **${mapItems.length}**` ,
  `- Content-map items marked PUBLISHED/UPDATED: **${mapPublished.length}**`,
  `- Built article records: **${articles.length}** (${indexable.length} indexable, ${noindex.length} intentional noindex)`,
  `- Geographic articles protected by the editorial plan: **20**; no city page was added or removed by this audit.`,
  `- Published/updated map targets missing from a built route: **${publishedMapBadTargets.length}**${publishedMapBadTargets.length ? ` — ${publishedMapBadTargets.slice(0, 10).map((x) => x.targetUrl).join(", ")}` : ""}`,
  `- Planning-only target paths not yet built: **${planningMapTargets.length}**; these are IDEA records, not live URLs or mass-publishing instructions.`,
  "",
  "| Status | Count |",
  "|---|---:|",
  ...Object.entries(statusCounts).map(([status, count]) => `| ${status} | ${count} |`),
  "",
  "## Cluster pillars",
  "",
  "| ID | Cluster | Pillar |",
  "|---|---|---|",
  ...((contentMap.clusters ?? []).map((cluster) => `| ${cluster.id} | ${md(cluster.title)} | \`${cluster.pillar}\` |`)),
  "",
  "## Guardrails",
  "",
  "- Keep `/service-areas` indexable, self-canonical and in the sitemap.",
  "- Keep the 20 geographic articles; do not create thin city pages or doorway variants.",
  "- Keep supporting articles informational and distinct; do not optimize every article for the national pillar query.",
  "- Content-map IDEA items are planning records, not permission to mass-publish.",
]);

// ---------------------------------------------------------------- indexing blockers
const indexingBlockers = [];
for (const article of articles) {
  if (!article.canonical) indexingBlockers.push(`${article.slug}: missing canonical`);
  if (!article.title || !article.metaTitle) indexingBlockers.push(`${article.slug}: missing title/metaTitle`);
  if (!article.metaDescription?.trim()) indexingBlockers.push(`${article.slug}: missing meta description`);
  if (article.expectedRobots === "index,follow,max-image-preview:large") {
    if (article.canonical !== article.url) indexingBlockers.push(`${article.slug}: indexable canonical is not self (${article.canonical})`);
    if (!article.sitemapIncluded || !sitemapSet.has(article.url)) indexingBlockers.push(`${article.slug}: indexable article absent from sitemap`);
  } else if (sitemapSet.has(article.url)) {
    indexingBlockers.push(`${article.slug}: noindex article is in sitemap`);
  }
}
for (const route of routes) {
  if (route.canonical !== route.url) indexingBlockers.push(`${route.path}: route canonical is not self`);
}
if (!/^Allow: \/$/m.test(robots)) indexingBlockers.push("robots.txt: public Allow: / missing");
for (const disallow of ["/search", "/admin", "/api"]) if (!new RegExp(`^Disallow: ${disallow}$`, "m").test(robots)) indexingBlockers.push(`robots.txt: Disallow: ${disallow} missing`);
write("indexing-blocker-report.md", [
  "# Indexing Blocker Report",
  "",
  `Date: ${DATE} · generated from the built catalog`,
  "",
  `**Result: ${indexingBlockers.length ? `FAIL (${indexingBlockers.length} blocker(s))` : "PASS — no known blocker"}**`,
  "",
  "| Area | Result | Evidence |",
  "|---|---|---|",
  `| Indexable articles | ${indexingBlockers.length ? "REVIEW" : "PASS"} | ${indexable.length} indexable; ${noindex.length} intentional noindex |`,
  `| Canonical consistency | ${indexingBlockers.some((x) => x.includes("canonical")) ? "REVIEW" : "PASS"} | indexable records self-canonicalize |`,
  `| Sitemap | ${indexingBlockers.some((x) => x.includes("sitemap")) ? "REVIEW" : "PASS"} | ${sitemap.length} unique URLs; no noindex article is advertised |`,
  `| Robots | ${indexingBlockers.some((x) => x.startsWith("robots")) ? "REVIEW" : "PASS"} | public content allowed; admin/search/API excluded |`,
  "",
  "## Decision log",
  "",
  "- A canonical override is retained only for an intentionally noindex/consolidated CMS record; indexable articles are forced to their own URL.",
  "- Sitemap entries are limited to real public routes and indexable published records.",
  "- A short article is not an indexing blocker by word count; quality and intent remain editorial decisions.",
  "- Unknown legacy URLs are not redirected to the homepage merely to reduce 404s.",
  "",
  ...(indexingBlockers.length ? ["## Blockers", "", ...indexingBlockers.map((x) => `- ${x}`)] : ["No indexing blockers detected in the generated manifest."]),
]);

// ---------------------------------------------------------------- duplicates / cannibalization
const duplicateGroups = [];
for (const field of ["title", "h1", "metaTitle", "metaDescription", "canonical"]) {
  for (const [value, records] of groupBy(indexable, field)) duplicateGroups.push({ field, value, records });
}
const mapKeywordGroups = groupBy(mapItems, "primaryKeyword").filter(([, records]) => new Set(records.map((x) => x.targetUrl)).size > 1);
const duplicateCanonicalGroups = duplicateGroups.filter((x) => x.field === "canonical");
write("duplicate-cannibalization-report.md", [
  "# Duplicate & Cannibalization Report",
  "",
  `Date: ${DATE} · generated from ${indexable.length} indexable article records and ${mapItems.length} content-map items`,
  "",
  `**Result: ${duplicateGroups.length || mapKeywordGroups.length ? "REVIEW" : "PASS — no exact duplicate signals"}**`,
  "",
  "## Ownership decisions",
  "",
  "| Topic | Pillar | Supporting pages |",
  "|---|---|---|",
  "| سايتوتك في السعودية | `/service-areas` | 20 geographic pages and regional explainers, each with local/access or safety context |",
  "| ما هو سايتوتك؟ | `/what-is-cytotec` | definition cluster |",
  "| الأمان والتحذيرات | `/safety` | safety, emergency and verification support |",
  "",
  `- Exact duplicate field groups: **${duplicateGroups.length}**`,
  `- Duplicate canonical groups: **${duplicateCanonicalGroups.length}**`,
  `- Content-map primary keywords assigned to multiple URLs: **${mapKeywordGroups.length}**`,
  "- The national Saudi phrase is intentionally owned by one pillar; city pages are supporting documents, not alternate national pillars.",
  "- Similar medical safety language may be intentionally repeated where changing a warning would reduce safety; it is not a keyword target or commercial claim.",
  "",
  ...(duplicateGroups.length ? ["## Exact duplicate fields", "", "| Field | Value | URLs |", "|---|---|---|", ...duplicateGroups.map((g) => `| ${g.field} | ${md(g.value)} | ${g.records.map((r) => `\`${r.path}\``).join(", ")} |`)] : ["No exact duplicate title, H1, meta-description or canonical groups detected among indexable articles."]),
  "",
  ...(mapKeywordGroups.length ? ["## Map keyword collisions", "", ...mapKeywordGroups.map(([keyword, records]) => `- **${md(keyword)}**: ${records.map((x) => x.targetUrl).join(", ")}`)] : ["No content-map primary keyword is assigned to multiple target URLs."]),
]);

// ---------------------------------------------------------------- orphan report
const incoming = new Map(indexable.map((a) => [a.slug, new Set()]));
const unresolved = [];
for (const source of indexable) {
  for (const raw of articleLinks(source)) {
    const slug = articleSlug(raw);
    if (!slug) continue;
    if (!articleBySlug.has(slug)) {
      unresolved.push(`${source.slug} → ${raw}`);
      continue;
    }
    if (slug !== source.slug && incoming.has(slug)) incoming.get(slug).add(source.slug);
  }
}
const orphanRecords = indexable.filter((a) => incoming.get(a.slug)?.size === 0);
write("orphan-report.md", [
  "# Internal Link & Orphan Report",
  "",
  `Date: ${DATE} · generated from the built article graph`,
  "",
  `**Result: ${orphanRecords.length || unresolved.length ? "REVIEW" : "PASS — no published article orphans"}**`,
  "",
  "| Metric | Count |",
  "|---|---:|",
  `| Indexable articles | ${indexable.length} |`,
  `| Articles with at least one incoming article link | ${indexable.length - orphanRecords.length} |`,
  `| Article orphans | ${orphanRecords.length} |`,
  `| Unresolved article targets in declared graph | ${unresolved.length} |`,
  "",
  "The graph includes `related`, `internalLinks`, `cornerstones`, and CMS `resourceLinks`. Navigation and automatically generated card listings are not treated as editorial links, so the report does not manufacture links merely to make a count pass.",
  "",
  orphanRecords.length ? "## Orphans" : "No indexable article is orphaned in the declared editorial graph.",
  ...(orphanRecords.length ? ["", "| Article | URL | Suggested action |", "|---|---|---|", ...orphanRecords.map((a) => `| ${a.slug} | \`${a.path}\` | Add one contextually relevant link from an existing article or hub; do not create a thin page. |`)] : []),
  ...(unresolved.length ? ["", "## Unresolved targets", "", ...unresolved.map((x) => `- ${x}`)] : []),
  "",
  "## Incoming sources",
  "",
  "| Article | Incoming sources |",
  "|---|---|",
  ...indexable.map((a) => `| \`${a.slug}\` | ${[...(incoming.get(a.slug) ?? [])].map((x) => `\`${x}\``).join(", ") || "—"} |`),
]);

console.log(`[architecture] wrote content-map-report.md, indexing-blocker-report.md, duplicate-cannibalization-report.md, orphan-report.md`);
console.log(`[architecture] map=${mapItems.length} · articles=${articles.length} · sitemap=${sitemap.length} · orphans=${orphanRecords.length} · blockers=${indexingBlockers.length}`);
if (indexingBlockers.length || orphanRecords.length || unresolved.length) process.exitCode = 1;
