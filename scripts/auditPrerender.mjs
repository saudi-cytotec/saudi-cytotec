/**
 * auditPrerender — proves the production rendering fix on the BUILT output.
 *
 *   node scripts/auditPrerender.mjs
 *
 * For every canonical/indexable URL in public/sitemap.xml (plus the known
 * public routes) it checks the prerendered dist/<path>/index.html:
 *   1.  the per-route static file exists,
 *   2.  #root carries real rendered content (not the loading placeholder),
 *   3.  exactly ONE <h1> in the document (page-specific H1),
 *   4.  the page's OWN <title> (non-home pages differ from the home title),
 *   5.  the page's OWN canonical (self-referencing absolute URL),
 *   6.  meta description present,
 *   7.  Open Graph title/url present and consistent with the canonical,
 *   8.  robots meta: index,follow for every sitemap URL,
 *   9.  prerender marker + per-page path marker,
 *   10. any wa.me link in the page is the single approved link.
 *
 * Console-only report (no files written, so the working tree stays clean).
 * Exit 1 on any critical failure.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const DOMAIN = "https://saudiersaa.com";
const APPROVED_WA = "966530945626";

const results = [];
let criticals = 0;

function report(section, ok, detail) {
  results.push({ section, ok, detail });
  if (!ok) criticals++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${section} — ${detail}`);
}

function fileFor(p) {
  return p === "/" ? path.join(DIST, "index.html") : path.join(DIST, p.replace(/\/$/, ""), "index.html");
}

const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const extras = ["/", "/topics", "/service-areas", "/contact", "/sitemap", "/faq", "/blog"];
const allPaths = [...new Set([...sitemapPaths, ...extras])];

console.log(`PRERENDER AUDIT — ${allPaths.length} pages (${sitemapPaths.length} sitemap + extras)\n`);

// Home title/canonical reference (the page that must be unique per route).
const homeFile = fileFor("/");
if (!fs.existsSync(homeFile)) {
  console.error(`[prerender-audit] ${homeFile} missing — run npm run build first`);
  process.exit(1);
}
const homeHtml = fs.readFileSync(homeFile, "utf8");
const homeHead = ((homeHtml.match(/<head>([\s\S]*?)<\/head>/) || [])[1] || "").replace(/<script[\s\S]*?<\/script>/g, "");
const homeTitle = (homeHead.match(/<title>([^<]*)<\/title>/) || [])[1] || "";

let missing = 0;
let titleIssues = 0;
let canonicalIssues = 0;
let descIssues = 0;
let ogIssues = 0;
let h1Issues = 0;
let robotsIssues = 0;
let markerIssues = 0;
let contentIssues = 0;
let waIssues = 0;
const badTitleSamples = [];
const badCanonicalSamples = [];

for (const p of allPaths) {
  const file = fileFor(p);
  if (!fs.existsSync(file)) {
    missing++;
    continue;
  }
  const h = fs.readFileSync(file, "utf8");
  const inSitemap = sitemapPaths.includes(p);
  const expectedCanonical = `${DOMAIN}${p === "/" ? "/" : p}`;
  // Metadata checks run against the <head> section with the inlined module
  // script removed — the single-file bundle legitimately contains
  // HTML-snippet strings (in-app audits) that would confuse a regex match.
  const head = (h.match(/<head>([\s\S]*?)<\/head>/) || [])[1] || "";
  const headMeta = head.replace(/<script[\s\S]*?<\/script>/g, "");

  // 2. real rendered content
  const rootMatch = h.split(/<div id="root">/)[1] || "";
  const content = rootMatch.slice(0, rootMatch.length);
  const isPlaceholderOnly = content.trim().length < 1500 || (content.includes("جاري تحميل المحتوى") && content.length < 3000);
  if (isPlaceholderOnly) contentIssues++;

  // 3. exactly one h1
  const h1Count = (h.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) h1Issues++;

  // 4. own title
  const title = (headMeta.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  if (!title) {
    titleIssues++;
    if (badTitleSamples.length < 3) badTitleSamples.push(`${p}: (empty)`);
  } else if (p !== "/" && title === homeTitle) {
    titleIssues++;
    if (badTitleSamples.length < 3) badTitleSamples.push(`${p}: uses home title`);
  }

  // 5. own canonical
  const canonical = (headMeta.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  if (canonical !== expectedCanonical) {
    canonicalIssues++;
    if (badCanonicalSamples.length < 3) badCanonicalSamples.push(`${p}: ${canonical || "(none)"} != ${expectedCanonical}`);
  }

  // 6. description
  const desc = (headMeta.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  if (!desc) descIssues++;

  // 7. OG
  const ogTitle = (headMeta.match(/<meta property="og:title" content="([^"]*)"/) || [])[1] || "";
  const ogUrl = (headMeta.match(/<meta property="og:url" content="([^"]*)"/) || [])[1] || "";
  if (!ogTitle || ogUrl !== expectedCanonical) ogIssues++;

  // 8. robots for sitemap URLs
  const robots = (headMeta.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
  if (inSitemap && !robots.startsWith("index,follow")) robotsIssues++;

  // 9. markers
  if (!headMeta.includes('name="prerender"') || !head.includes(`name="prerender-path" content="${p}"`)) markerIssues++;

  // 10. wa.me links — only the approved number
  const waDigits = [...h.matchAll(/wa\.me\/(\d+)/g)].map((m) => m[1]);
  if (waDigits.some((d) => d !== APPROVED_WA)) waIssues++;
}

report("per-route static files exist", missing === 0, missing === 0 ? `all ${allPaths.length} pages have a dist file` : `${missing} missing`);
report("real rendered content in #root", contentIssues === 0, contentIssues === 0 ? "no page is placeholder-only" : `${contentIssues} pages look placeholder-only`);
report("exactly one H1 per page", h1Issues === 0, h1Issues === 0 ? `${allPaths.length}/${allPaths.length} pages` : `${h1Issues} pages with !=1 h1`);
report("page-specific titles", titleIssues === 0, titleIssues === 0 ? "no page reuses the home title" : `${titleIssues} issues: ${badTitleSamples.join("; ")}`);
report("self-referencing canonicals", canonicalIssues === 0, canonicalIssues === 0 ? "every canonical is the page's own URL" : `${canonicalIssues} issues: ${badCanonicalSamples.join("; ")}`);
report("meta description present", descIssues === 0, descIssues === 0 ? "all pages" : `${descIssues} missing`);
report("Open Graph title/url consistent", ogIssues === 0, ogIssues === 0 ? "all pages" : `${ogIssues} issues`);
report("robots index,follow for sitemap URLs", robotsIssues === 0, robotsIssues === 0 ? "all sitemap URLs" : `${robotsIssues} wrong`);
report("prerender + path markers", markerIssues === 0, markerIssues === 0 ? "all pages" : `${markerIssues} missing markers`);
report("only the approved wa.me number", waIssues === 0, waIssues === 0 ? "wa.me/966530945626 everywhere" : `${waIssues} pages with a different wa.me number`);

console.log(`\nPRERENDER AUDIT: ${criticals === 0 ? "PASS" : "FAIL"} (${results.length - criticals}/${results.length} checks)`);
process.exit(criticals === 0 ? 0 : 1);
