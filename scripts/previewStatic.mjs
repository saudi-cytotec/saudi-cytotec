/**
 * previewStatic — local static preview that simulates Vercel filesystem
 * precedence for the dist/ build:
 *
 *   1. an exact static file in dist wins  (/robots.txt, /images/..., .xml)
 *   2. then dist/<path>/index.html        (a prerendered route)
 *   3. otherwise dist/index.html           (Vercel rewrite `/(.*) → /index.html`
 *      — SPA boot for /search, /admin and unknown routes → in-app 404)
 *
 * /api/* is a Vercel Function in production and does not exist in a static
 * preview → 404 here.
 *
 * Usage:  npm run preview:static    (binds 0.0.0.0:4173)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4173);
const HOST = "0.0.0.0";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
};

function safeJoin(p) {
  const resolved = path.normalize(path.join(DIST, p));
  return resolved === DIST || resolved.startsWith(DIST + path.sep) ? resolved : null;
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" }).end("bad request");
    return;
  }

  if (pathname.startsWith("/api/")) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("api unavailable in static preview (Vercel Function in production)");
    return;
  }

  const candidates = [safeJoin(pathname), safeJoin(pathname + "/index.html"), safeJoin(pathname + ".html")].filter(Boolean);
  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      const ext = path.extname(file).toLowerCase();
      const isHtml = ext === ".html";
      res.writeHead(200, {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": isHtml ? "no-cache" : "public, max-age=300",
      });
      fs.createReadStream(file).pipe(res);
      return;
    }
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/search" || pathname.startsWith("/search/")) {
    const shell = path.join(DIST, "index.html");
    if (!fs.existsSync(shell)) {
      res.writeHead(503, { "Content-Type": "text/plain" }).end("dist/index.html missing — run `npm run build` first");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    fs.createReadStream(shell).pipe(res);
    return;
  }

  // Edge 404 response for unknown routes
  const notFound = path.join(DIST, "404.html");
  if (fs.existsSync(notFound)) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    fs.createReadStream(notFound).pipe(res);
    return;
  }

  // Fallback if 404.html missing
  const shell = path.join(DIST, "index.html");
  if (!fs.existsSync(shell)) {
    res.writeHead(503, { "Content-Type": "text/plain" }).end("dist/index.html missing — run `npm run build` first");
    return;
  }
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
  fs.createReadStream(shell).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`[preview:static] Vercel-precedence static preview listening on http://${HOST}:${PORT}`);
  console.log(`[preview:static] serving: ${DIST}`);
});
