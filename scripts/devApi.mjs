/**
 * LOCAL DEV API — testing only (never used in production).
 *
 * `vite dev` does not run the Vercel serverless functions in /api, so this tiny
 * Node server stands in for them during local testing of the admin UI. It:
 *   - mounts the REAL auth/status/session handlers (so login is genuine), and
 *   - simulates publishing by writing the article JSON to content/published/,
 *     which is exactly the file api/publish.js commits in production. Vite's
 *     glob import then bundles it, so the article becomes a real public page.
 *
 * It intentionally enforces ONLY data integrity (valid/unique slug, a title,
 * some body) — the same as api/publish.js — with no SEO/content gate.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authHandler from "../api/auth.js";
import statusHandler from "../api/status.js";
import { requireAdmin, json } from "../api/_lib/session.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLISHED_DIR = path.join(ROOT, "content", "published");
const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "callout"]);
const PORT = process.env.DEV_API_PORT || 8787;

function slugIsSafe(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 90;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  req.body = raw;
  return raw;
}

function publishHandler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  const url = new URL(req.url, "http://localhost");

  if (req.method === "DELETE") {
    const slug = String(url.searchParams.get("slug") || "");
    if (!slugIsSafe(slug)) return json(res, 400, { error: "رابط غير صالح." });
    const filePath = path.join(PUBLISHED_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) return json(res, 404, { error: "لا يوجد مقال منشور بهذا الرابط." });
    fs.unlinkSync(filePath);
    return json(res, 200, { ok: true, slug, message: "تم إلغاء النشر (محلياً)." });
  }

  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const article = body.article;
  if (!article || typeof article !== "object") return json(res, 400, { error: "الحقل article مطلوب." });

  const slug = String(article.slug || "").trim();
  // Integrity only — mirrors api/publish.js. No SEO/content-quality checks.
  if (!slugIsSafe(slug)) return json(res, 400, { error: "رابط غير صالح." });
  if (!String(article.title || "").trim()) return json(res, 400, { error: "العنوان مطلوب." });
  if (!Array.isArray(article.blocks) || !article.blocks.some((b) => b && BLOCK_TYPES.has(b.type))) {
    return json(res, 400, { error: "لا يوجد محتوى في المتن." });
  }

  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    ...article,
    slug,
    id: article.id || `cms-${slug}`,
    status: "published",
    publishedAt: article.publishedAt || today,
    updatedAt: today,
    blocks: article.blocks.filter((b) => b && BLOCK_TYPES.has(b.type)),
  };
  fs.mkdirSync(PUBLISHED_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLISHED_DIR, `${slug}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  return json(res, 200, {
    ok: true,
    slug,
    status: "published",
    url: `/blog/${slug}`,
    note: "تم النشر محلياً — ستظهر الصفحة العامة بعد إعادة تحميل الواجهة.",
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" || req.method === "PUT") await readBody(req);
    const { pathname } = new URL(req.url, "http://localhost");
    if (pathname === "/api/auth") return authHandler(req, res);
    if (pathname === "/api/status") return statusHandler(req, res);
    if (pathname === "/api/publish") return publishHandler(req, res);
    if (pathname === "/api/generate") return json(res, 501, { error: "AI disabled in dev", configured: false });
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(err) }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[devApi] listening on http://0.0.0.0:${PORT}`);
});
