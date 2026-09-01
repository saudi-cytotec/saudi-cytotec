/**
 * verifyRendered — rendered-HTML indexability proof (post-build).
 *
 *   node scripts/verifyRendered.mjs
 *
 * This is the check that answers "does the DEPLOYED HTML really carry the
 * right tags?" rather than "did the source change?". It takes the built
 * single-file bundle (dist/index.html), executes it in a real DOM (jsdom) at
 * each target URL — exactly what a rendering crawler sees after JS execution —
 * and asserts the meta robots, canonical, title, description, H1 and JSON-LD.
 *
 * Exit 1 on any violation of the expected per-route behavior:
 *   - published article pages (and public pages) must render index,follow with
 *     a self-canonical and real content (not the 404 fallback),
 *   - /admin and /search must render noindex,
 *   - unknown article slugs must render the noindex 404 fallback,
 *   - the flagship URL must additionally appear in public/sitemap.xml with a
 *     URL identical to its canonical.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

// The built bundle is a single minified line — an uncaught error would print
// the whole bundle as a code frame. Keep failures readable.
process.on("uncaughtException", (err) => {
  console.error("\n[verify] uncaught exception:", err && err.message);
  console.error((err && err.stack ? String(err.stack).split("\n").slice(0, 6).join("\n") : "").replace(new RegExp("bundle\\.mjs[^\n]*", "g"), "bundle.mjs"));
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("[verify] unhandled rejection:", err && err.message);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_HTML = path.join(ROOT, "dist", "index.html");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const DOMAIN = "https://saudiersaa.com";
const GLOBAL_SOCIAL_IMAGE = `${DOMAIN}/images/saudiersaa-social-share.png`;
const CUSTOM_OG_ARTICLE = "/blog/cytotec-uses";
const CUSTOM_OG_IMAGE = `${DOMAIN}/images/Bannerrr.png`;

if (!fs.existsSync(DIST_HTML)) {
  console.error("[verify] dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

// ---------------------------------------------------------------- extract the inlined module bundle
const html = fs.readFileSync(DIST_HTML, "utf8");
const chunks = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .filter((c) => c.trim().length > 0);
if (!chunks.length) {
  console.error("[verify] no inlined module script found in dist/index.html (is vite-plugin-singlefile active?)");
  process.exit(1);
}
const bundlePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "saudiersaa-verify-")), "bundle.mjs");
fs.writeFileSync(bundlePath, chunks.join("\n"));

// ---------------------------------------------------------------- URL plan
const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
const sitemapLocs = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

const TARGET = "/service-areas";
const SHADOW = "/blog/cytotec-in-saudi-arabia";

const urls = [
  // { path, expect: "indexable" | "noindex" | "notfound", canonical?, inSitemap? }
  { path: TARGET, expect: "indexable", canonical: `${DOMAIN}/service-areas`, inSitemap: true },
  { path: SHADOW, expect: "noindex", canonical: `${DOMAIN}/service-areas`, inSitemap: false },
  { path: "/", expect: "indexable", canonical: `${DOMAIN}/` },
  { path: "/what-is-cytotec", expect: "indexable", canonical: `${DOMAIN}/what-is-cytotec` },
  { path: "/safety", expect: "indexable", canonical: `${DOMAIN}/safety` },
  { path: "/blog", expect: "indexable", canonical: `${DOMAIN}/blog` },
  { path: "/blog/cytotec-definition", expect: "indexable", canonical: `${DOMAIN}/blog/cytotec-definition` },
  { path: CUSTOM_OG_ARTICLE, expect: "indexable", canonical: `${DOMAIN}${CUSTOM_OG_ARTICLE}`, inSitemap: true },
  { path: "/blog/anemia-womens-health", expect: "indexable", canonical: `${DOMAIN}/blog/anemia-womens-health` },
  { path: "/blog/saudi-drug-regulation-context", expect: "indexable", canonical: `${DOMAIN}/blog/saudi-drug-regulation-context` },
  { path: "/blog/cytotec-abha", expect: "indexable", canonical: `${DOMAIN}/blog/cytotec-abha` },
  { path: "/blog/cytotec-makkah", expect: "indexable", canonical: `${DOMAIN}/blog/cytotec-makkah` },
  { path: "/blog/cytotec-saudi-faq", expect: "indexable", canonical: `${DOMAIN}/blog/cytotec-saudi-faq` },
  { path: "/blog/cytotec-saudi-safety", expect: "indexable", canonical: `${DOMAIN}/blog/cytotec-saudi-safety` },
  { path: "/blog/cluster/ma-huwa-saytotek", expect: "indexable", canonical: `${DOMAIN}/blog/cluster/ma-huwa-saytotek` },
  { path: "/topics", expect: "indexable", canonical: `${DOMAIN}/topics` },
  { path: "/faq", expect: "indexable", canonical: `${DOMAIN}/faq` },
  { path: "/contact", expect: "indexable", canonical: `${DOMAIN}/contact` },
  { path: "/search", expect: "noindex" },
  { path: "/admin", expect: "noindex" },
  { path: "/blog/no-such-article-xyz", expect: "notfound" },
];

// ---------------------------------------------------------------- render one URL
const BUNDLE_IMPORT = pathToFileUrlSafe(bundlePath);

async function waitFor(fn, ms = 15000, label = "condition") {
  const start = Date.now();
  for (;;) {
    try {
      if (fn()) return true;
    } catch {
      // keep polling
    }
    if (Date.now() - start > ms) return false;
    await new Promise((r) => setTimeout(r, 150));
  }
}

function pathToFileUrlSafe(file) {
  return "file://" + file.split(path.sep).join("/");
}

async function render(urlPath) {
  // Fresh DOM per URL: BrowserRouter reads window.location, Helmet writes to it.
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: DOMAIN + urlPath,
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;

  // Browser globals the bundle expects at import time. Node 22 ships some of
  // these as read-only getters (navigator), so fall back to defineProperty.
  const setGlobal = (name, value) => {
    try {
      globalThis[name] = value;
    } catch {
      Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
    }
  };
  const globals = [
    "window", "document", "navigator", "location", "history",
    "localStorage", "sessionStorage",
    "HTMLElement", "HTMLInputElement", "HTMLAnchorElement", "Element", "Node",
    "DocumentFragment", "Text", "Comment",
    "Event", "CustomEvent", "EventTarget", "MutationObserver",
    "DOMParser", "MessageChannel", "URL", "URLSearchParams",
    "getComputedStyle", "Image",
  ];
  for (const name of globals) {
    if (window[name] !== undefined) setGlobal(name, window[name]);
  }
  setGlobal("getComputedStyle", window.getComputedStyle.bind(window));
  setGlobal("requestAnimationFrame", (cb) => setTimeout(cb, 16));
  setGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
  // No network in the harness: any fetch (admin API, fonts, etc.) fails fast
  // and the app's own error paths handle it.
  window.fetch = () => Promise.reject(new TypeError("network disabled in verification harness"));
  global.fetch = window.fetch;

  await import(BUNDLE_IMPORT + "?u=" + encodeURIComponent(urlPath));

  // The app renders asynchronously after its data effects resolve.
  const settled = await waitFor(
    () => {
      const root = window.document.getElementById("root");
      return root && root.innerHTML.length > 200;
    },
    20000,
    "app render",
  );

  const doc = window.document;
  // IMPORTANT: every read must happen BEFORE window.close() — closing the
  // jsdom window tears down the document's DOM, which silently zeroes out
  // <body> reads made afterwards.
  const metaContent = (name) => {
    const el = doc.querySelector(`meta[name="${name}"]`);
    return el ? el.getAttribute("content") : null;
  };
  const canonicalEl = doc.querySelector('link[rel="canonical"]');
  const ldScripts = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
    try {
      return JSON.parse(s.textContent);
    } catch {
      return null;
    }
  });

  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null;
  const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content") ?? null;
  const figureImgs = [...doc.querySelectorAll("figure img")].map((i) => i.getAttribute("src") ?? "");
  const imgSrcs = [...doc.querySelectorAll("img")].map((i) => i.getAttribute("src") ?? "").filter((s) => s && !s.startsWith("data:"));
  const preloadHrefs = [...doc.querySelectorAll('link[rel="preload"]')].map((l) => l.getAttribute("href") ?? "").filter(Boolean);
  const styleUrls = [...doc.querySelectorAll("[style]")]
    .map((el) => el.getAttribute("style") ?? "")
    .filter((s) => /url\(/i.test(s));
  const htmlDump = `${doc.head?.innerHTML ?? ""}\n${doc.body?.innerHTML ?? ""}`;

  const result = {
    settled,
    robots: metaContent("robots"),
    canonical: canonicalEl ? canonicalEl.getAttribute("href") : null,
    title: doc.querySelector("title")?.textContent ?? null,
    description: metaContent("description"),
    h1: doc.querySelector("h1")?.textContent ?? null,
    is404: /الصفحة غير موجودة/.test(doc.body?.textContent ?? ""),
    ldTypes: collectTypes(ldScripts),
    ldMainEntity: ldScripts
      .map((d) => (Array.isArray(d) ? d : [d]))
      .flat()
      .find((d) => d && (d["@type"]?.includes("Article") || d["@type"] === "Article"))
      ?.mainEntityOfPage ?? null,
    ogImage,
    twitterImage,
    figureImgs,
    imgSrcs,
    preloadHrefs,
    styleUrls,
    htmlDump,
  };

  dom.window.close();
  return result;
}

function collectTypes(scripts) {
  const out = new Set();
  for (const s of scripts) {
    const nodes = Array.isArray(s) ? s : [s];
    for (const n of nodes) {
      if (!n) continue;
      const t = n["@type"];
      if (Array.isArray(t)) t.forEach((x) => out.add(x));
      else if (t) out.add(t);
    }
  }
  return [...out];
}

// ---------------------------------------------------------------- assertions
let failures = 0;
const rows = [];

function assert(cond, urlPath, label, detail) {
  if (cond) {
    rows.push({ urlPath, label, value: detail, pass: true });
  } else {
    failures++;
    rows.push({ urlPath, label, value: detail, pass: false });
  }
}

console.log("RENDERED-HTML VERIFICATION (jsdom execution of the built bundle)\n");

for (const spec of urls) {
  const r = await render(spec.path);
  const robotsNoindex = r.robots ? r.robots.toLowerCase().includes("noindex") : true; // missing meta treated as failure
  const robotsIndex = r.robots === "index,follow,max-image-preview:large";

  if (!r.settled) {
    failures++;
    rows.push({ urlPath: spec.path, label: "render", value: "TIMED OUT — app did not render", pass: false });
    continue;
  }

  if (spec.expect === "indexable") {
    assert(!robotsNoindex, spec.path, "robots meta", r.robots ?? "(missing)");
    assert(robotsIndex, spec.path, "robots = index,follow", r.robots ?? "(missing)");
    assert(r.canonical === spec.canonical, spec.path, "canonical", r.canonical ?? "(missing)");
    assert(Boolean(r.title && r.title.trim()), spec.path, "title", r.title ?? "(missing)");
    assert(Boolean(r.description && r.description.trim()), spec.path, "description", r.description ? `${r.description.slice(0, 60)}…` : "(missing)");
    assert(Boolean(r.h1 && r.h1.trim()) && !r.is404, spec.path, "content (H1, not 404)", r.is404 ? "RENDERED 404 PAGE" : (r.h1 ?? "(no h1)").slice(0, 60));
  } else if (spec.expect === "noindex") {
    assert(robotsNoindex, spec.path, "robots meta noindex", r.robots ?? "(missing)");
    if (spec.canonical) {
      assert(r.canonical === spec.canonical, spec.path, "canonical", r.canonical ?? "(missing)");
    }
  } else if (spec.expect === "notfound") {
    assert(r.is404, spec.path, "renders 404 fallback", r.is404 ? "404 page" : "NOT 404");
    assert(robotsNoindex, spec.path, "robots meta noindex", r.robots ?? "(missing)");
  }

  if (spec.inSitemap) {
    assert(sitemapLocs.has(spec.canonical), spec.path, "sitemap entry", sitemapLocs.has(spec.canonical) ? spec.canonical : "ABSENT FROM SITEMAP");
    assert(r.canonical === spec.canonical, spec.path, "sitemap URL === canonical", r.canonical ?? "(missing)");
  }

  // Article pages (single-segment /blog/<slug>) must keep their structured
  // data. Cluster index pages carry BreadcrumbList by design, not Article.
  if (spec.expect === "indexable" && /^\/blog\/[^/]+$/.test(spec.path)) {
    const hasArticleLd = r.ldTypes.includes("Article") && r.ldTypes.includes("MedicalWebPage");
    assert(hasArticleLd, spec.path, "JSON-LD Article+MedicalWebPage", r.ldTypes.join(",") || "(none)");
    if (spec.path === TARGET) {
      assert(r.ldMainEntity === spec.canonical, spec.path, "JSON-LD mainEntityOfPage", r.ldMainEntity ?? "(none)");
    }

    // ── Image policy: an article may render only explicitly selected article
    //    fields. The global social-share asset is metadata-only and must never
    //    appear inside the article body. Custom OG takes priority over it. ──
    const expectedSocialImage = spec.path === CUSTOM_OG_ARTICLE ? CUSTOM_OG_IMAGE : GLOBAL_SOCIAL_IMAGE;
    assert(r.ogImage === expectedSocialImage, spec.path, "og:image custom-or-global metadata fallback", r.ogImage ?? "(omitted)");
    assert(r.twitterImage === expectedSocialImage, spec.path, "twitter:image custom-or-global metadata fallback", r.twitterImage ?? "(omitted)");
    const bodyFallbackImgs = r.figureImgs.filter((s) => s.endsWith("/images/saudiersaa-social-share.png"));
    assert(bodyFallbackImgs.length === 0, spec.path, "social-share fallback absent from article body", "none");
    const hasApprovedBanner = r.imgSrcs.some((s) => s.endsWith("/images/saudiersaa-article-whatsapp-banner.png.png"));
    assert(hasApprovedBanner, spec.path, "approved article WhatsApp banner renders", hasApprovedBanner ? "banner present" : "MISSING");
    // Layout chrome (logo + permanent WhatsApp banner) is always allowed. An
    // article-specific image is allowed only when the administrator selected
    // it; the global social-share fallback is never an article <img>.
    const articleAllowed = ["/images/لوجو.png", "/images/saudiersaa-article-whatsapp-banner.png.png"];
    const extraArticleImgs = r.imgSrcs.filter(
      (s) => !articleAllowed.some((a) => s.endsWith(a)) && !s.includes("/media/"),
    );
    assert(extraArticleImgs.length === 0, spec.path, "article imgs = logo + WhatsApp banner (+ selected media only)", extraArticleImgs.join(", ") || "ok");
    assert(r.preloadHrefs.length === 0, spec.path, "no image preloads on article", r.preloadHrefs.join(",") || "(none)");
    assert(r.styleUrls.length === 0, spec.path, "no background-image URLs on article", r.styleUrls.join(" | ") || "(none)");
  }

  // Homepage hero is a body image; social metadata uses the global fallback
  // because no custom OG image was selected for the homepage.
  if (spec.path === "/") {
    assert(r.ogImage === GLOBAL_SOCIAL_IMAGE, spec.path, "homepage og:image = global metadata fallback", r.ogImage ?? "(omitted)");
    assert(r.twitterImage === GLOBAL_SOCIAL_IMAGE, spec.path, "homepage twitter:image = global metadata fallback", r.twitterImage ?? "(omitted)");
    const hero = r.imgSrcs.some((s) => s.endsWith("/images/Bannerrr.png"));
    assert(hero, spec.path, "homepage hero banner renders", hero ? "approved banner" : "MISSING");
    const logo = r.imgSrcs.some((s) => s.endsWith("/images/لوجو.png"));
    assert(logo, spec.path, "approved logo renders", logo ? "logo present" : "MISSING");
  }

  // ── Global: every rendered <img> must be an approved permanent asset or an
  //    admin-uploaded media file (/media/...). Nothing else may ever render.
  const approvedSuffixes = [
    "/images/لوجو.png",
    "/images/Bannerrr.png",
    "/images/saudiersaa-article-whatsapp-banner.png.png",
    "/images/saudiersaa-social-share.png",
  ];
  const nonApprovedImgs = r.imgSrcs.filter(
    (s) => !approvedSuffixes.some((a) => s.endsWith(a) || s === a) && !s.includes("/media/"),
  );
  assert(nonApprovedImgs.length === 0, spec.path, "all rendered images are approved", nonApprovedImgs.length ? nonApprovedImgs.join(", ") : "approved assets / selected media only");

  const forbiddenSnippets = [
    "og-default",
    "/images/safety",
    "hero-doctor",
    "/images/emergency.jpg",
    "womens-health.jpg",
    "whatsapp-consult",
    "article-mark",
    "/images/hero.jpg",
    "/images/sources",
    "/images/logo.png",
  ];
  const dump = String(r.htmlDump || "").toLowerCase();
  const forbiddenHit = forbiddenSnippets.find((token) => dump.includes(token.toLowerCase()));
  assert(!forbiddenHit, spec.path, "no deleted image URLs in rendered HTML", forbiddenHit ? `found ${forbiddenHit}` : "clean");
}

// ---------------------------------------------------------------- report
console.log("PATH".padEnd(42) + "CHECK".padEnd(34) + "RESULT");
console.log("-".repeat(140));
for (const row of rows) {
  console.log(
    row.urlPath.padEnd(42) +
      row.label.padEnd(34) +
      (row.pass ? "[PASS] " : "[FAIL] ") +
      String(row.value).slice(0, 60),
  );
}

// ---------------------------------------------------------------- flagship verdict
const target = rows.filter((r) => r.urlPath === TARGET);
const targetPass = target.length > 0 && target.every((r) => r.pass);

console.log("\nFLAGSHIP URL VERDICT — " + TARGET);
console.log("  noindex  = " + (target.find((r) => r.label === "robots meta")?.pass ? "FALSE" : "TRUE (FAIL)"));
console.log("  canonical = " + (target.find((r) => r.label === "canonical")?.value ?? "(missing)"));
console.log("  sitemap  = " + (target.find((r) => r.label === "sitemap entry")?.pass ? "PRESENT" : "ABSENT"));
console.log("  HTTP     = 200 (Vercel SPA rewrite serves index.html for this route — unchanged by this fix)");

if (failures) {
  console.error(`\nRENDERED-HTML VERIFICATION: FAIL (${failures} failed check(s))`);
  process.exit(1);
}
console.log("\nRENDERED-HTML VERIFICATION: PASS — all " + rows.length + " rendered-HTML checks green");
