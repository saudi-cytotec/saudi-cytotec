/**
 * prerender — generate static HTML for every sitemap URL.
 *
 * Uses one jsdom/React runtime for the full route set. Importing the same
 * bundle with a different query string per URL would duplicate the bundled
 * React instance and can trigger React error #321.
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

let bundlePath;
const assetsDir = path.join(ROOT, "dist", "assets");
if (fs.existsSync(assetsDir)) {
  // Use the exact production entry referenced by Vite in dist/index.html.
  // Do not guess by filename: this build can contain more than one
  // index-*.js chunk, and choosing the wrong one leaves React.lazy routes
  // suspended during prerender.
  const entrySrc = html.match(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+\.js)["'][^>]*>/i)?.[1]
    ?? html.match(/<script[^>]+src=["']([^"']+\.js)["'][^>]+type=["']module["'][^>]*>/i)?.[1];
  if (entrySrc?.startsWith("/assets/")) {
    const candidate = path.join(ROOT, "dist", entrySrc.slice("/".length));
    if (fs.existsSync(candidate)) bundlePath = candidate;
  }

  if (!bundlePath) {
    const assetJs = fs.readdirSync(assetsDir).find((f) => f.endsWith(".js") && (f.startsWith("index-") || f.startsWith("index.")));
    if (assetJs) bundlePath = path.join(assetsDir, assetJs);
  }
}

if (!bundlePath) {
  const chunks = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .filter((c) => c.trim().length > 0);
  if (chunks.length) {
    bundlePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "saudiersaa-prerender-")), "bundle.mjs");
    fs.writeFileSync(bundlePath, chunks.join("\n"));
  }
}

if (!bundlePath) {
  console.error("[prerender] no module script found in dist/assets or dist/index.html");
  process.exit(1);
}

// Vite emits lazy chunks with browser-rooted /assets/ URLs. The prerenderer
// executes the production entry through Node, so stage JS assets into a
// temporary file:// tree and rewrite only that temporary copy. This keeps
// client-side code splitting intact while allowing React.lazy routes to load
// during prerender instead of timing out once per page.
if (fs.existsSync(assetsDir)) {
  const stagedRoot = fs.mkdtempSync(path.join(os.tmpdir(), "saudiersaa-prerender-assets-"));
  const stagedAssets = path.join(stagedRoot, "assets");
  fs.mkdirSync(stagedAssets, { recursive: true });
  const assetsBaseUrl = pathToFileUrlSafe(stagedAssets).replace(/\/$/, "") + "/";

  for (const file of fs.readdirSync(assetsDir).filter((name) => name.endsWith(".js"))) {
    const sourcePath = path.join(assetsDir, file);
    const stagedPath = path.join(stagedAssets, file);
    const source = fs.readFileSync(sourcePath, "utf8");
    const rewritten = source.replace(/(["'])\/assets\//g, `$1${assetsBaseUrl}`);
    fs.writeFileSync(stagedPath, rewritten, "utf8");
  }

  const stagedEntry = path.join(stagedAssets, path.basename(bundlePath));
  if (fs.existsSync(stagedEntry)) bundlePath = stagedEntry;
}

const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const paths = sitemapUrls
  .map((u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const extraPaths = ["/", "/topics", "/service-areas", "/contact", "/sitemap", "/faq", "/blog"];
for (const p of extraPaths) {
  if (!paths.includes(p)) paths.push(p);
}

console.log(`[prerender] discovered ${paths.length} URLs from sitemap + extras`);

function pathToFileUrlSafe(file) {
  return "file://" + file.split(path.sep).join("/");
}

const BUNDLE_IMPORT = pathToFileUrlSafe(bundlePath);

const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
  url: DOMAIN + (paths[0] || "/"),
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

for (const name of [
  "window", "document", "navigator", "location", "history",
  "localStorage", "sessionStorage",
  "HTMLElement", "HTMLInputElement", "HTMLAnchorElement", "Element", "Node",
  "DocumentFragment", "Text", "Comment",
  "Event", "CustomEvent", "EventTarget", "MutationObserver",
  "DOMParser", "MessageChannel", "URL", "URLSearchParams",
  "getComputedStyle", "Image",
]) {
  if (window[name] !== undefined) setGlobal(name, window[name]);
}

setGlobal("getComputedStyle", window.getComputedStyle.bind(window));
setGlobal("requestAnimationFrame", (cb) => setTimeout(cb, 16));
setGlobal("cancelAnimationFrame", (id) => clearTimeout(id));

window.fetch = async () => ({
  ok: true,
  status: 200,
  headers: new Map(),
  text: async () => "",
  json: async () => ({}),
  arrayBuffer: async () => new ArrayBuffer(0),
});
global.fetch = window.fetch;

let bundleLoaded = false;

async function ensureBundleLoaded() {
  if (!bundleLoaded) {
    await import(BUNDLE_IMPORT);
    bundleLoaded = true;
  }
}

async function render(urlPath) {
  const firstPath = paths[0] || "/";
  window.history.replaceState({}, "", DOMAIN + urlPath);
  await ensureBundleLoaded();

  if (urlPath !== firstPath) {
    window.dispatchEvent(new window.PopStateEvent("popstate"));
  }

  const doc0 = window.document;
  let stableHead = null;
  let stableRootLength = 0;
  let stablePasses = 0;
  let settled = false;
  const start = Date.now();

  // Route changes can trigger small React DOM mutations that make a full
  // innerHTML equality check never settle. For prerendering we only need the
  // route-specific SEO head and a non-trivial rendered root to be stable for
  // two consecutive polls. This avoids spending the full timeout on every URL.
  while (Date.now() - start < 2000) {
    const root = doc0.getElementById("root");
    const rootHtml = root?.innerHTML ?? "";
    const rootLength = rootHtml.length;
    const title = doc0.querySelector("title")?.textContent ?? "";
    const description = doc0.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const canonical = doc0.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
    const ogTitle = doc0.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "";
    const ogUrl = doc0.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "";
    const headNow = [title, description, canonical, ogTitle, ogUrl].join("\u001f");

    const expectedCanonical = `${DOMAIN}${urlPath === "/" ? "/" : urlPath.replace(/\/$/, "")}`;
    const footerReady = rootHtml.includes("<footer");
    const routeHeadReady =
      rootLength > 200 &&
      footerReady &&
      title &&
      description &&
      canonical === expectedCanonical &&
      ogUrl === expectedCanonical;

    if (routeHeadReady) {
      if (headNow === stableHead && Math.abs(rootLength - stableRootLength) < 256) {
        stablePasses += 1;
      } else {
        stableHead = headNow;
        stableRootLength = rootLength;
        stablePasses = 1;
      }

      if (stablePasses >= 2) {
        settled = true;
        break;
      }
    } else {
      stableHead = null;
      stableRootLength = 0;
      stablePasses = 0;
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  const doc = window.document;
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
  return { head, bodyRoot, settled };
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function stripShellSeo(shell) {
  let out = shell;
  out = out.replace(/<title>[\s\S]*?<\/title>\n?/gi, "");
  out = out.replace(/<!--[\s\S]*?Homepage SEO shell:[\s\S]*?-->\n?/gi, "");
  out = out.replace(/<meta\s+name=["']prerender[^"']*["'][^>]*>\n?/gi, "");
  out = out.replace(/<!--[\s\S]*?Prerendered per-page SEO head:[\s\S]*?-->\n?/gi, "");
  out = out.replace(/<meta\s+name=["']description["'][^>]*>\n?/gi, "");
  out = out.replace(/<link\s+rel=["']canonical["'][^>]*>\n?/gi, "");
  out = out.replace(/<meta\s+name=["']robots["'][^>]*>\n?/gi, "");
  out = out.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>\n?/gi, "");
  out = out.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>\n?/gi, "");
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>\n?/gi, "");
  return out;
}

function seoBlock(head, urlPath, total) {
  const lines = [`    <!-- Prerendered per-page SEO head: ${urlPath} -->`];
  if (head.title) lines.push(`    ${head.title}`);
  if (head.description) lines.push(`    ${head.description}`);
  const expectedCanonical = `${DOMAIN}${urlPath === "/" ? "/" : urlPath.replace(/\/$/, "")}`;
  lines.push(`    <link rel="canonical" href="${expectedCanonical}" />`);
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
  const ORIGINAL_SHELL = fs.readFileSync(DIST_HTML, "utf8");

  for (const urlPath of paths) {
    try {
      const { head, bodyRoot, settled } = await render(urlPath);

      const outPath =
        urlPath === "/" || urlPath === ""
          ? path.join(DIST_DIR, "index.html")
          : path.join(DIST_DIR, urlPath.replace(/\/$/, ""), "index.html");

      // Keep the homepage's explicit static SEO shell intact. It is already
      // the approved root metadata in index.html, while non-root routes
      // receive their route-specific Helmet/prerender SEO block below.
      let enhanced = urlPath === "/" ? ORIGINAL_SHELL : stripShellSeo(ORIGINAL_SHELL);
      const headOk = Boolean(settled && head.title && head.canonical && head.description);

      if (urlPath !== "/" && headOk) {
        enhanced = enhanced.replace("</head>", `${seoBlock(head, urlPath, paths.length)}\n  </head>`);
      } else if (urlPath !== "/") {
        enhanced = enhanced.replace(
          "</head>",
          `  <meta name="prerender" content="${paths.length}" />\n  <meta name="prerender-path" content="${urlPath}" />\n  <meta name="prerender-fallback" content="no-head" />\n  </head>`,
        );
        if (settled) fallbacks++;
      }

      if (bodyRoot) {
        enhanced = enhanced.replace(
          /<div id="root">[\s\S]*?<\/div>\s*<!--/,
          `<div id="root">${bodyRoot}</div>\n    <!--`,
        );
        if (!enhanced.includes(bodyRoot.slice(0, 50))) {
          enhanced = enhanced.replace(/<div id="root".*?<\/div>/s, `<div id="root">${bodyRoot}</div>`);
        }
      }

      ensureDir(outPath);
      fs.writeFileSync(outPath, enhanced, "utf8");
      renderedCount++;
      if (renderedCount % 20 === 0) console.log(`[prerender] ${renderedCount}/${paths.length} rendered`);
    } catch (err) {
      failures.push(`${urlPath}: ${err.message}`);
      const outPath =
        urlPath === "/"
          ? path.join(DIST_DIR, "index.html")
          : path.join(DIST_DIR, urlPath.replace(/\/$/, ""), "index.html");
      ensureDir(outPath);
      if (urlPath !== "/") fs.copyFileSync(DIST_HTML, outPath);
    }
  }

  try {
    const { bodyRoot } = await render("/404");
    let notFoundShell = stripShellSeo(ORIGINAL_SHELL);
    notFoundShell = notFoundShell.replace(
      "</head>",
      `    <title>الصفحة غير موجودة 404 | صحة المرأة السعودية</title>\n    <meta name="robots" content="noindex,nofollow">\n  </head>`,
    );
    if (bodyRoot) notFoundShell = notFoundShell.replace(/<div id="root".*?<\/div>/s, `<div id="root">${bodyRoot}</div>`);
    fs.writeFileSync(path.join(DIST_DIR, "404.html"), notFoundShell, "utf8");
    console.log("[prerender] wrote dist/404.html for true HTTP 404 responses");
  } catch (e) {
    console.warn("[prerender] 404.html generation warning:", e.message);
  }

  let commit = "unknown";
  try {
    commit = execSync("git rev-parse --short=7 HEAD", { cwd: ROOT }).toString().trim();
  } catch {}

  fs.writeFileSync(
    path.join(DIST_DIR, "prerender-manifest.json"),
    JSON.stringify(
      {
        pages: paths.length,
        whatsapp: "00966530945626",
        identity: "green #0f6b4a",
        commit,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  window.close();
  console.log(
    `[prerender] completed ${renderedCount}/${paths.length} pages — head-merged: ${renderedCount - fallbacks}, head fallbacks: ${fallbacks}, hard failures: ${failures.length}`,
  );
  if (failures.length) {
    console.error("[prerender] failures:");
    for (const f of failures) console.error(`  - ${f}`);
  }
}

main().catch((err) => {
  console.error("[prerender] fatal:", err);
  process.exit(1);
});
