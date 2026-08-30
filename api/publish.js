import { json, requireAdmin } from "./_lib/session.js";

/**
 * Publishing endpoint — Git-based CMS
 * -----------------------------------
 * A real publish writes the article as JSON into the repository and commits it.
 * The commit triggers a Vercel redeploy, the file is bundled by
 * src/cms/contentSource.ts, and the article becomes a public, crawlable URL.
 *
 *   POST   /api/publish            create or update a published article
 *   DELETE /api/publish?slug=...   unpublish (delete the file)
 *
 * Publishing is ALWAYS an explicit administrator action (admin session
 * required, button clicked in the CMS). There is NO scheduled, cron, automatic
 * or background publishing path in this system.
 *
 * Requires GITHUB_PUBLISH_TOKEN (a fine-grained PAT with Contents: read/write on
 * this repository only). The token is read from process.env and is never logged
 * or returned in a response body.
 */

const OWNER = process.env.GITHUB_REPO_OWNER || "saudi-cytotec";
const REPO = process.env.GITHUB_REPO_NAME || "saudi-cytotec";
const BRANCH = process.env.GITHUB_REPO_BRANCH || "main";
const API = "https://api.github.com";

const PUBLISHED_DIR = "content/published";

const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "callout"]);

function slugIsSafe(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 90;
}

function dateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : value;
}

function sha256Base64(text) {
  return Buffer.from(text, "utf8").toString("base64");
}

async function gh(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  return { ok: response.ok, status: response.status, payload };
}

async function existingSha(token, filePath) {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`, { token });
  if (res.ok && res.payload?.sha) return res.payload.sha;
  return undefined;
}

async function commitFile(token, filePath, content, message) {
  const sha = await existingSha(token, filePath);
  return gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: "PUT",
    token,
    body: {
      message,
      branch: BRANCH,
      content: sha256Base64(content),
      ...(sha ? { sha } : {}),
    },
  });
}

const IMAGE_FIELDS = ["image", "imageAlt", "bannerImage", "bannerImageAlt", "ogImage"];

function serialize(article) {
  const clean = { ...article };
  // Articles never persist an article-specific image. The public renderer
  // ignores these fields; emptying them here keeps Git JSON in the same state.
  for (const key of IMAGE_FIELDS) {
    clean[key] = "";
  }
  return `${JSON.stringify(
    {
      ...clean,
      blocks: article.blocks.filter((b) => b && BLOCK_TYPES.has(b.type)),
    },
    null,
    2,
  )}\n`;
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  const token = process.env.GITHUB_PUBLISH_TOKEN;
  if (!token) {
    return json(res, 501, {
      error: "النشر إلى المستودع غير مُفعّل.",
      blocker: "EXTERNAL: add GITHUB_PUBLISH_TOKEN (fine-grained PAT, Contents read/write) in Vercel environment variables.",
      configured: false,
      // The edit is still safe: the admin keeps it in localStorage and can
      // retry publishing once the token exists.
      savedLocally: true,
    });
  }

  const url = new URL(req.url, "http://localhost");

  if (req.method === "DELETE") {
    const slug = String(url.searchParams.get("slug") || "");
    if (!slugIsSafe(slug)) return json(res, 400, { error: "رابط غير صالح." });
    const filePath = `${PUBLISHED_DIR}/${slug}.json`;
    const sha = await existingSha(token, filePath);
    if (!sha) return json(res, 404, { error: "لا يوجد مقال منشور بهذا الرابط." });
    const del = await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
      method: "DELETE",
      token,
      body: { message: `Unpublish ${slug}`, branch: BRANCH, sha },
    });
    return json(res, del.ok ? 200 : 502, {
      ok: del.ok,
      slug,
      message: del.ok ? "تم إلغاء النشر. ستُزال الصفحة في النشر التالي." : "تعذر الحذف من المستودع.",
    });
  }

  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  // Scheduled publishing is deliberately unsupported: publishing must be an
  // explicit administrator action, never a background cron promotion.
  if (url.searchParams.get("schedule") === "1") {
    return json(res, 400, { error: "النشر المجدول غير مفعّل — النشر يدوي من المحرر فقط." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const article = body.article;
  if (!article || typeof article !== "object") return json(res, 400, { error: "الحقل article مطلوب." });

  const slug = String(article.slug || "").trim();
  if (!slugIsSafe(slug)) return json(res, 400, { error: "رابط غير صالح: يُسمح بحروف إنجليزية صغيرة وأرقام وشرطات." });
  if (!String(article.title || "").trim()) return json(res, 400, { error: "العنوان مطلوب." });
  if (!Array.isArray(article.blocks) || !article.blocks.some((b) => b && BLOCK_TYPES.has(b.type))) {
    return json(res, 400, { error: "لا يوجد محتوى في المتن." });
  }

  const filePath = `${PUBLISHED_DIR}/${slug}.json`;

  const payload = {
    ...article,
    slug,
    id: article.id || `cms-${slug}`,
    status: "published",
    publishedAt: dateOnly(article.publishedAt) || new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const message = `Publish: ${payload.title} (${slug})`;
  const commit = await commitFile(token, filePath, serialize(payload), message);

  if (!commit.ok) {
    // Surface the class of failure without leaking token or repo internals.
    const hint =
      commit.status === 401 || commit.status === 403
        ? "رفض GitHub الكتابة — تحققي من صلاحيات GITHUB_PUBLISH_TOKEN."
        : commit.status === 409
          ? "تعارض في الملف — أعدي المحاولة."
          : "تعذر إتمام عملية الـcommit.";
    return json(res, 502, { error: hint, status: commit.status });
  }

  return json(res, 200, {
    ok: true,
    slug,
    path: filePath,
    status: payload.status,
    url: `https://saudiersaa.com/blog/${slug}`,
    note: "تم النشر. ستظهر الصفحة بعد اكتمال إعادة النشر على Vercel.",
  });
}
