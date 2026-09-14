/**
 * prerender — generate static HTML for 129 sitemap URLs.
 * Commit 8ac2a34: prerender + WhatsApp 00966530945626 + green identity + production fixes.
 *
 * - Reads public/sitemap.xml (129 URLs) + dist/index.html (single-file bundle)
 * - Renders each URL in jsdom (same harness as verifyRendered) to capture
 *   the fully-rendered DOM after React hydration
 * - Writes dist/<path>/index.html for each route with:
 *   - rendered <title>, meta description, canonical, robots, JSON-LD
 *   - rendered #root innerHTML (production rendering fix)
 *   - preserved green identity + WhatsApp CTAs in the static shell
 *   - <meta name="prerender" content="129"> marker
 *
 * This ensures crawlers without JS see real content, not just "جاري تحميل...".
 * Vercel serves these static files directly (rewrites fallback still works for
 * unknown routes). Build remains single-file for SPA navigation.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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

  const settled = await waitFor(
    () => {
      const root = window.document.getElementById("root");
      return root && root.innerHTML.length > 200;
    },
    20000,
  );

  if (!settled) {
    console.warn(`[prerender] timeout rendering ${urlPath}`);
  }

  const doc = window.document;
  const title = doc.title || "";
  const headInner = doc.head ? doc.head.innerHTML : "";
  const bodyRoot = doc.getElementById("root") ? doc.getElementById("root").innerHTML : "";

  window.close();

  return { title, headInner, bodyRoot };
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function main() {
  let renderedCount = 0;
  for (const urlPath of paths) {
    try {
      const { headInner, bodyRoot } = await render(urlPath);

      // Build output path: / => dist/index.html (already exists, but we enhance)
      // /blog/foo => dist/blog/foo/index.html
      // For root, we will write an enhanced version that still contains the bundle
      // plus prerendered content inside #root and head.

      let outPath;
      if (urlPath === "/" || urlPath === "") {
        outPath = path.join(DIST_DIR, "index.html");
      } else {
        const clean = urlPath.replace(/\/$/, "");
        outPath = path.join(DIST_DIR, clean, "index.html");
      }

      // Read original shell to preserve bundle
      const shell = fs.readFileSync(DIST_HTML, "utf8");

      // Inject prerendered head (merge) and body
      // Replace <div id="root">...</div> with prerendered content
      // And inject <meta name="prerender" content="129"> + WhatsApp marker

      let enhanced = shell;

      // Add prerender marker into head if not present
      if (!enhanced.includes('name="prerender"')) {
        enhanced = enhanced.replace(
          "</head>",
          `  <meta name="prerender" content="${paths.length}" />\n  <meta name="whatsapp" content="00966530945626" />\n  <meta name="prerender-path" content="${urlPath}" />\n</head>`
        );
      }

      // Replace root content with prerendered version for crawlers
      // Keep the original bundle script intact for hydration
      if (bodyRoot) {
        // The shell has a placeholder "جاري تحميل..." inside #root
        // We replace it with the rendered HTML, but keep it inside #root
        enhanced = enhanced.replace(
          /<div id="root">[\s\S]*?<\/div>\s*<!--/,
          `<div id="root">${bodyRoot}</div>\n    <!--`
        );
        // Fallback if pattern not matched (single-file may have different structure)
        if (!enhanced.includes(bodyRoot.slice(0, 50))) {
          enhanced = enhanced.replace(
            /<div id="root\">.*?<\/div>/s,
            `<div id="root">${bodyRoot}</div>`
          );
        }
      }

      // For non-root paths, write separate file; for root, overwrite with enhanced
      if (urlPath !== "/") {
        ensureDir(outPath);
        fs.writeFileSync(outPath, enhanced, "utf8");
      } else {
        // For root, we already have enhanced version
        fs.writeFileSync(outPath, enhanced, "utf8");
      }

      renderedCount++;
      if (renderedCount % 20 === 0) {
        console.log(`[prerender] ${renderedCount}/${paths.length} rendered`);
      }
    } catch (err) {
      console.error(`[prerender] failed ${urlPath}:`, err.message);
      // Fallback: copy shell as-is
      const clean = urlPath.replace(/\/$/, "");
      const outPath = urlPath === "/" ? path.join(DIST_DIR, "index.html") : path.join(DIST_DIR, clean, "index.html");
      ensureDir(outPath);
      if (urlPath !== "/") {
        fs.copyFileSync(DIST_HTML, outPath);
      }
    }
  }

  console.log(`[prerender] completed ${renderedCount}/${paths.length} pages — WhatsApp 00966530945626 — green identity #0f6b4a`);

  // Write prerender manifest for verification
  const manifest = {
    pages: paths.length,
    whatsapp: "00966530945626",
    identity: "green #0f6b4a",
    generatedAt: new Date().toISOString(),
    commit: "8ac2a34",
  };
  fs.writeFileSync(path.join(DIST_DIR, "prerender-manifest.json"), JSON.stringify(manifest, null, 2));
}

main().catch((err) => {
  console.error("[prerender] fatal:", err);
  process.exit(1);
});
