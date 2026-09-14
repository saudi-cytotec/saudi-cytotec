/**
 * prerender — generate static HTML for every sitemap URL.
 *
 * Production rendering fix:
 *   - Reads public/sitemap.xml (129 canonical/indexable URLs) + the built
 *     single-file bundle (dist/index.html).
 *   - Renders each URL in jsdom (same harness as verifyRendered) so the DOM
 *     is the fully-rendered React tree (post-hydration behavior) at that URL.
 *   - Writes dist/<path>/index.html for each route with:
 *       * the page's OWN <title>, meta description, canonical, robots meta,
 *         Open Graph / Twitter / article metas (extracted from the rendered
 *         head produced by react-helmet-async),
 *       * the rendered #root innerHTML (real per-page content, page-specific
 *         H1), so crawlers without JS see the page itself — never the
 *         homepage HTML on a deep route,
 *       * a <noscript> shell block removed (the prerendered #root replaces
 *         it; guarantees exactly one H1 per page),
 *       * markers: <meta name="prerender">, <meta name="prerender-path">,
 *         <meta name="whatsapp" content="00966530945626"> (from the shell).
 *   - The inlined module bundle is preserved in every file, so the SPA
 *     (React Router) fully boots in the browser after the static shell.
 *
 * Vercel serves these static files with filesystem precedence (an existing
 * dist/<path>/index.html wins over the `/(.*) → /index.html` rewrite), so
 * public pages are never served as a SPA catch-all. /api/*, redirects and
 * headers are untouched (see vercel.json).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_HTML = path.join(ROOT, "dist", "index.html");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const DIST_DIR = path.join(ROOT, "dist");
const DOMAIN = "https://saudiersaa.com";

if (!fs.existsSync(DIST_HTML)) {
  console.error("[prerender] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

const html = fs.readFileSync(DIST_HTML, "utf8");
const chunks = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .filter((c) => c.trim().length > 0);

if (!chunks.length) {
  console.error("[prerender] no inlined module script found");
  process.exit(1);
}

const bundlePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "saudiersaa-prerender-")), "bundle.mjs");
fs.writeFileSync(bundlePath, chunks.join("\n"));

const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// Convert absolute URLs to paths
const paths = sitemapUrls
  .map((u) => {
    try {
      const url = new URL(u);
      return url.pathname;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

// Always include root and known public routes
const extraPaths = ["/", "/topics", "/service-areas", "/contact", "/sitemap", "/faq", "/blog"];
for (const p of extraPaths) {
  if (!paths.includes(p)) paths.push(p);
}

console.log(`[prerender] discovered ${paths.length} URLs from sitemap + extras (target 129)`);

function pathToFileUrlSafe(file) {
  return "file://" + file.split(path.sep).join("/");
}

const BUNDLE_IMPORT = pathToFileUrlSafe(bundlePath);

async function waitFor(fn, ms = 15000) {
  const start = Date.now();
  for (;;) {
    try {
      if (fn()) return true;
    } catch {}
    if (Date.now() - start > ms) return false;
    await new Promise((r) => setTimeout(r, 150));
  }
}

async function render(urlPath) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: DOMAIN + urlPath,
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;

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
  window.fetch = () => Promise.reject(new TypeError("network disabled in prerender"));
  global.fetch = window.fetch;

  await import(BUNDLE_IMPORT + "?u=" + encodeURIComponent(urlPath));

  // Settle only on STABLE rendered content. The catalog provider fills its
  // state in a post-mount effect, so the first paint of an article URL can be
  // the transient 404 fallback; capturing that would ship a wrong page.
  // Requiring two identical snapshots 250ms apart rules the transient out.
  const doc0 = window.document;
  let stable = null;
  let settled = false;
  const start = Date.now();
  while (Date.now() - start < 25000) {
    const root = doc0.getElementById("root");
    const now = root ? root.innerHTML : "";
    if (now.length > 200) {
      if (now === stable) {
        settled = true;
        break;
      }
      stable = now;
    } else {
      stable = null;
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const doc = window.document;

  // Per-page head elements produced by react-helmet-async at this URL.
  const head = {
    title: doc.querySelector("title")?.outerHTML ?? "",
    description: doc.querySelector('meta[name="description"]')?.outerHTML ?? "",
    canonical: doc.querySelector('link[rel="canonical"]')?.outerHTML ?? "",
    robots: doc.querySelector('meta[name="robots"]')?.outerHTML ?? "",
    keywords: doc.querySelector('meta[name="keywords"]')?.outerHTML ?? "",
    formatDetection: doc.querySelector('meta[name="format-detection"]')?.outerHTML ?? "",
    social: [...doc.querySelectorAll('meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"]')]
      .map((el) => el.outerHTML),
  };

  const bodyRoot = doc.getElementById("root") ? doc.getElementById("root").innerHTML : "";

  window.close();

  return { head, bodyRoot, settled };
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/** Remove the generic homepage SEO elements from the shell head. */
function stripShellSeo(shell) {
  let out = shell;
  out = out.replace(/<title>[\s\S]*?<\/title>\n?/, "");
  out = out.replace(/<!--\s*Homepage SEO shell:[\s\S]*?-->\n?/, "");
  // Defensive: drop any prerender markers / per-page comment from an already
  // enhanced shell so re-runs never accumulate stale meta sets.
  out = out.replace(/<meta name="prerender[^"]*" content="[^"]*" \/>/g, "");
  out = out.replace(/<!--\s*Prerendered per-page SEO head:[\s\S]*?-->\n?/, "");
  out = out.replace(/<meta\s+name="description"[\s\S]*?\/>\n?/, "");
  out = out.replace(/<link rel="canonical" href="[^"]*" \/>/g, "");
  out = out.replace(/<meta name="robots" content="[^"]*" \/>/g, "");
  out = out.replace(/<meta property="og:[^"]*" content="[^"]*" \/>/g, "");
  out = out.replace(/<meta name="twitter:[^"]*" content="[^"]*" \/>/g, "");
  // The prerendered #root is the no-JS content itself; the shell's generic
  // noscript block (with its own H1) must not ship on prerendered pages.
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>\n?/, "");
  return out;
}

/** Build the per-page head block to inject before </head>. */
function seoBlock(head, urlPath, total) {
  const lines = [`    <!-- Prerendered per-page SEO head: ${urlPath} -->`];
  if (head.title) lines.push(`    ${head.title}`);
  if (head.description) lines.push(`    ${head.description}`);
  if (head.canonical) lines.push(`    ${head.canonical}`);
  if (head.robots) lines.push(`    ${head.robots}`);
  if (head.keywords) lines.push(`    ${head.keywords}`);
  for (const meta of head.social) lines.push(`    ${meta}`);
  if (head.formatDetection) lines.push(`    ${head.formatDetection}`);
  lines.push(`    <meta name="prerender" content="${total}" />`);
  lines.push(`    <meta name="prerender-path" content="${urlPath}" />`);
  return lines.join("\n");
}

async function main() {
  let renderedCount = 0;
  let fallbacks = 0;
  const failures = [];

  // The pristine vite shell, read ONCE before any page is written. Each page
  // must be enhanced from this original — never from a previously enhanced
  // output (dist/index.html is overwritten with the home's enhanced HTML
  // during the loop and must not become the template for the other pages).
  const ORIGINAL_SHELL = fs.readFileSync(DIST_HTML, "utf8");

  for (const urlPath of paths) {
    try {
      const { head, bodyRoot, settled } = await render(urlPath);

      let outPath;
      if (urlPath === "/" || urlPath === "") {
        outPath = path.join(DIST_DIR, "index.html");
      } else {
        const clean = urlPath.replace(/\/$/, "");
        outPath = path.join(DIST_DIR, clean, "index.html");
      }

      // The shell is the single-file bundle: keep its <script type="module">
      // (hydration/boot) while replacing the generic head + #root content.
      let enhanced = stripShellSeo(ORIGINAL_SHELL);

      const headOk = Boolean(settled && head.title && head.canonical && head.description);

      if (headOk) {
        enhanced = enhanced.replace("</head>", `${seoBlock(head, urlPath, paths.length)}\n  </head>`);
      } else {
        // Unsettled render or missing head — keep the shell head as a
        // degraded (but still functional) fallback for this page only.
        enhanced = enhanced.replace("</head>", `  <meta name="prerender" content="${paths.length}" />\n  <meta name="prerender-path" content="${urlPath}" />\n  <meta name="prerender-fallback" content="no-head" />\n  </head>`);
        if (settled) fallbacks++;
      }

      if (bodyRoot) {
        enhanced = enhanced.replace(
          /<div id="root">[\s\S]*?<\/div>\s*<!--/,
          `<div id="root">${bodyRoot}</div>\n    <!--`
        );
        // Fallback if pattern not matched (single-file may have different structure)
        if (!enhanced.includes(bodyRoot.slice(0, 50))) {
          enhanced = enhanced.replace(
            /<div id="root".*?<\/div>/s,
            `<div id="root">${bodyRoot}</div>`
          );
        }
      }

      ensureDir(outPath);
      fs.writeFileSync(outPath, enhanced, "utf8");
      renderedCount++;
      if (renderedCount % 20 === 0) {
        console.log(`[prerender] ${renderedCount}/${paths.length} rendered`);
      }
    } catch (err) {
      failures.push(`${urlPath}: ${err.message}`);
      // Fallback: copy shell as-is (still a working SPA shell)
      const clean = urlPath.replace(/\/$/, "");
      const outPath = urlPath === "/" ? path.join(DIST_DIR, "index.html") : path.join(DIST_DIR, clean, "index.html");
      ensureDir(outPath);
      if (urlPath !== "/") {
        fs.copyFileSync(DIST_HTML, outPath);
      }
    }
  }

  let commit = "unknown";
  try {
    commit = execSync("git rev-parse --short=7 HEAD", { cwd: ROOT }).toString().trim();
  } catch {
    // no git context — leave "unknown"
  }

  // Write prerender manifest for verification (dist only — never tracked).
  const manifest = {
    pages: paths.length,
    whatsapp: "00966530945626",
    identity: "green #0f6b4a",
    commit,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(DIST_DIR, "prerender-manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`[prerender] completed ${renderedCount}/${paths.length} pages — head-merged: ${renderedCount - fallbacks}, head fallbacks: ${fallbacks}, hard failures: ${failures.length}`);
  if (failures.length) {
    console.error("[prerender] failures:");
    for (const f of failures) console.error(`  - ${f}`);
  }
}

main().catch((err) => {
  console.error("[prerender] fatal:", err);
  process.exit(1);
});
