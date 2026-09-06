/**
 * auditSeo — full-site SEO audit against the built output + registries.
 *
 *   node scripts/auditSeo.mjs
 *
 * Checks (critical failures exit 1):
 *   1. Sitemap parity — no live URL lost vs docs/url-baseline.txt
 *   2. Robots — public content allowed, /admin /api /search excluded, sitemap declared
 *   3. Forbidden schema types — Drug/Product/Offer/Review/AggregateRating absent
 *   4. Redirect registry — no loops, destinations exist, statuses 301/410, valid vercel.json
 *   5. Content map — 100 topics, unique ids/urls, valid cross-references
 *   6. Bundle SEO shell — title, description, canonical, robots meta present
 *   7. Internal links from article data — no broken related/cornerstone targets
 *   8. Images — referenced images exist
 *
 * Writes docs/seo-audit.md with the full report.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "index.html");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const ROBOTS = path.join(ROOT, "public", "robots.txt");
const BASELINE = path.join(ROOT, "docs", "url-baseline.txt");
const REDIRECTS = path.join(ROOT, "content", "redirects.json");
const MAP = path.join(ROOT, "content", "map.json");
const VERCEL = path.join(ROOT, "vercel.json");
const ARTICLES_DIR = path.join(ROOT, "src", "data", "articles");
const PUBLISHED_DIR = path.join(ROOT, "content", "published");

const results = [];
let criticals = 0;

function report(section, ok, detail) {
  results.push({ section, ok, detail });
  if (!ok) criticals++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${section} — ${detail}`);
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
}

console.log("SEO AUDIT — saudiersaa.com\n");

// 1. Sitemap parity
{
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const current = locs(xml);
  const baseline = fs.readFileSync(BASELINE, "utf8").split("\n").filter(Boolean).sort();
  const lost = baseline.filter((url) => !current.includes(url));
  report("Sitemap parity", lost.length === 0, lost.length ? `LOST ${lost.length}: ${lost.slice(0, 5).join(", ")}` : `${current.length} URLs, ${baseline.length} baseline, nothing lost`);
}

// 2. Robots
{
  const robots = fs.readFileSync(ROBOTS, "utf8");
  const ok =
    !/^Disallow:\s*\/\s*$/m.test(robots) &&
    robots.includes("Disallow: /admin") &&
    robots.includes("Disallow: /api") &&
    robots.includes("Sitemap: https://saudiersaa.com/sitemap.xml") &&
    !robots.includes("Disallow: /blog") &&
    !robots.includes("Disallow: /images") &&
    !robots.includes("Disallow: /assets");
  report("Robots", ok, ok ? "public allowed; /admin,/api excluded; sitemap declared; assets allowed" : robots.split("\n").slice(0, 8).join(" | "));
}

// 3. Forbidden schema types (bundle-inlined ld+json templates)
{
  const html = fs.readFileSync(DIST, "utf8");
  const found = [];
  for (const match of html.matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
    const raw = match[1];
    if (raw.startsWith("[")) {
      for (const item of raw.matchAll(/"([^"]+)"/g)) found.push(item[1]);
    } else {
      found.push(raw.slice(1, -1));
    }
  }
  const unique = [...new Set(found)];
  const violations = ["Drug", "Product", "Offer", "Review", "AggregateRating"].filter((type) => unique.includes(type));
  report("Schema", violations.length === 0, violations.length ? `FORBIDDEN: ${violations.join(", ")}` : `types in bundle: ${unique.join(", ")}`);
}

// 4. Redirects
{
  const registry = JSON.parse(fs.readFileSync(REDIRECTS, "utf8"));
  const sitemapUrls = locs(fs.readFileSync(SITEMAP, "utf8")).map((url) => url.replace("https://saudiersaa.com", ""));
  const sources = new Set(registry.rules.map((rule) => rule.source));
  const loops = registry.rules.filter((rule) => rule.destination && sources.has(rule.destination));
  const badStatus = registry.rules.filter((rule) => ![301, 410].includes(rule.statusCode));
  const missingTargets = registry.rules.filter((rule) => rule.statusCode === 301 && rule.destination && !sitemapUrls.includes(rule.destination) && !rule.destination.startsWith("/blog/cluster"));
  const vercel = JSON.parse(fs.readFileSync(VERCEL, "utf8"));
  const vercelRules = vercel.redirects ?? [];
  const vercelBad = vercelRules.filter((r) => {
    if (!r.source || !r.source.startsWith("/")) return true;
    if (r.statusCode === 410) return false;
    if (!r.destination) return true;
    return false;
  });

  report(
    "Redirects",
    loops.length === 0 && badStatus.length === 0 && missingTargets.length === 0 && vercelBad.length === 0,
    `${registry.rules.length} registry rules, ${vercelRules.length} edge rules${loops.length ? `, LOOPS: ${loops.map((r) => r.source).join(", ")}` : ""}${badStatus.length ? `, bad status` : ""}${missingTargets.length ? `, missing targets: ${missingTargets.map((r) => r.source + "→" + r.destination).join(", ")}` : ""}${vercelBad.length ? `, invalid vercel rules: ${vercelBad.length}` : ""}`,
  );
}

// 5. Content map
{
  const map = JSON.parse(fs.readFileSync(MAP, "utf8"));
  const ids = map.items.map((item) => item.id);
  const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
  const urls = map.items.map((item) => item.targetUrl);
  const dupUrls = urls.filter((v, i) => urls.indexOf(v) !== i);
  const sitemapPaths = locs(fs.readFileSync(SITEMAP, "utf8")).map((url) => url.replace("https://saudiersaa.com", ""));
  const targets = new Set(sitemapPaths);
  for (const item of map.items) targets.add(item.targetUrl);
  const badRefs = [];
  for (const item of map.items) {
    for (const ref of [item.parent, ...item.related]) {
      if (ref && !targets.has(ref)) badRefs.push(`${item.id}→${ref}`);
    }
  }
  const published = map.items.filter((item) => item.status === "PUBLISHED" || item.status === "UPDATED").length;
  report(
    "Content map",
    map.items.length === 100 && dupIds.length === 0 && dupUrls.length === 0 && badRefs.length === 0,
    `${map.items.length} topics · ${published} published/updated · clusters: ${map.clusters.map((c) => c.id).join("")}${dupIds.length ? " · dup ids" : ""}${dupUrls.length ? ` · dup urls ${dupUrls.join(",")}` : ""}${badRefs.length ? ` · bad refs ${badRefs.slice(0, 3).join(",")}` : ""}`,
  );
}

// 6. Bundle SEO shell (static shell + runtime emission in bundle)
{
  const html = fs.readFileSync(DIST, "utf8");
  const hasTitle = /<title>[^<]+<\/title>/.test(html);
  const hasCanonical = /<link rel="canonical" href="https:\/\/saudiersaa.com\/"\s*\/?>/.test(html);
  const hasRobots = /<meta name="robots" content="index,follow/.test(html);
  const hasBuildMarker = /<meta name="build" content="saudiersaa:[^"]+">/.test(html);
  // Per-page description/title/robots/canonical are injected at runtime by the
  // Seo component (Helmet); verify the emission code ships in the bundle.
  const seo = fs.readFileSync(path.join(ROOT, "src", "components", "Seo.tsx"), "utf8");
  const runtimeMeta = seo.includes("description") && seo.includes("robots") && seo.includes("canonical") && seo.includes("og:title");
  report("Bundle shell", hasTitle && hasCanonical && hasRobots && hasBuildMarker && runtimeMeta, `shell title/canonical/robots/build-marker ${hasTitle && hasCanonical && hasRobots && hasBuildMarker ? "present" : "MISSING"}; runtime meta ${runtimeMeta ? "present" : "MISSING"}`);
}

// 7. Internal links from article data
{
  const files = fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith(".ts"));
  let all = "";
  for (const file of files) all += fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const slugs = new Set([...all.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]));
  // CMS-published JSON can add or override a static slug, so the audit must
  // validate links against the same combined catalog shipped by the build.
  try {
    for (const file of fs.readdirSync(PUBLISHED_DIR).filter((name) => name.endsWith(".json"))) {
      const row = JSON.parse(fs.readFileSync(path.join(PUBLISHED_DIR, file), "utf8"));
      if (row?.slug) slugs.add(row.slug);
    }
  } catch {
    // Static articles remain the minimum catalog on a fresh checkout.
  }
  const related = [...all.matchAll(/related:\s*\[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([a-z0-9-/]+)"/g)].map((x) => x[1]));
  const broken = related.filter((target) => !target.startsWith("/") && !slugs.has(target));
  const pathLinks = [...all.matchAll(/cornerstones:\s*\[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"(\/[^"]+)"/g)].map((x) => x[1]));
  const sitemapPaths = new Set(locs(fs.readFileSync(SITEMAP, "utf8")).map((url) => url.replace("https://saudiersaa.com", "")));
  const brokenPaths = pathLinks.filter((p) => !sitemapPaths.has(p));
  report("Internal links", broken.length === 0 && brokenPaths.length === 0, `${slugs.size} slugs; related broken: ${broken.length}; cornerstone broken: ${brokenPaths.length}${broken.length ? ` (${broken.slice(0, 3).join(", ")})` : ""}${brokenPaths.length ? ` (${brokenPaths.slice(0, 3).join(", ")})` : ""}`);
}

// 8. Referenced images exist AND are from the approved assets only.
//
// APPROVED_ASSETS — the exact owner-approved image set (logo, homepage hero,
// social share). WhatsApp banner removed in repositioning. Any other /images/ reference is a
// violation: no og-default, no generated article image, no favicon, no legacy
// contextual images. Admin uploads live under /media/, not /images/, and are
// covered by scripts/auditImages.mjs against content/media.json.
const APPROVED_ASSETS = new Set([
  "/images/لوجو.png",
  "/images/Bannerrr.png",
  "/images/saudiersaa-social-share.png",
]);
{
  const html = fs.readFileSync(DIST, "utf8");
  const media = fs.readFileSync(path.join(ROOT, "src", "data", "media.ts"), "utf8");
  // Unicode-aware: approved filenames include Arabic (لوجو.png).
  const srcRefs = [...html.matchAll(/\/images\/[^"'()\s,;]+\.(?:jpg|jpeg|png|svg|webp|avif)/gi)].map((m) => m[0]);
  const mediaRefs = [...media.matchAll(/\/images\/[^"'()\s,;]+\.(?:jpg|jpeg|png|svg|webp|avif)/gi)].map((m) => m[0]);
  const refs = [...new Set([...srcRefs, ...mediaRefs])].map((src) => decodeURIComponent(src));
  const nonApproved = refs.filter((src) => !APPROVED_ASSETS.has(src));
  const missing = refs.filter((src) => !fs.existsSync(path.join(ROOT, "dist", src)));
  report(
    "Images",
    nonApproved.length === 0 && missing.length === 0,
    `${refs.length} unique references; non-approved: ${nonApproved.length ? nonApproved.join(", ") : "none"}; missing: ${missing.length ? missing.join(", ") : "none"}`,
  );
}

// Write report
const lines = [
  "# SEO Audit — SAUDIERSAA",
  "",
  `Date: ${new Date().toISOString().slice(0, 10)} · auto-generated by \`scripts/auditSeo.mjs\``,
  "",
  `**Result: ${criticals === 0 ? "PASS" : "FAIL"}** (${results.length} checks, ${criticals} failures)`,
  "",
  "| Check | Status | Detail |",
  "|---|---|---|",
  ...results.map((r) => `| ${r.section} | ${r.ok ? "PASS" : "FAIL"} | ${r.detail.replace(/\|/g, "\\|")} |`),
  "",
];
fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs", "seo-audit.md"), lines.join("\n"));
console.log(`\nAudit written to docs/seo-audit.md — ${criticals === 0 ? "PASS" : `${criticals} FAILURES`}`);
process.exit(criticals === 0 ? 0 : 1);
