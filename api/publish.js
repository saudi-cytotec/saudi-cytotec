import { json, requireAdmin } from "./_lib/session.js";
import { existingSha, gh, publishToken, readFile, REPO_CONTEXT } from "./_lib/repo.js";
import { classifyGitHubFailure, tokenMissingResponse } from "./_lib/errors.js";

/**
 * Publishing endpoint — Git-based CMS
 * -----------------------------------
 * A real publish writes the article as JSON into the repository and commits it:
 *
 *   CMS -> this API -> GitHub commit -> Vercel deployment -> live URL
 *
 * The committed file is bundled by src/cms/contentSource.ts, so a published
 * article is real, crawlable, deployed content — never a record that exists
 * only in one browser's localStorage. The CMS therefore only reports
 * "published" when this endpoint confirms an actual commit.
 *
 *   POST   /api/publish          create or update a published article
 *   DELETE /api/publish?slug=... unpublish (delete the file)
 *
 * Publishing is ALWAYS an explicit administrator action (admin session
 * required, button clicked in the CMS). There is NO scheduled, cron, automatic
 * or background publishing path in this system.
 *
 * Requires GITHUB_PUBLISH_TOKEN (a fine-grained PAT with Contents: read/write
 * on this repository only). The token is read from process.env and is never
 * logged, echoed or returned in a response body.
 */

const { OWNER, REPO, BRANCH } = REPO_CONTEXT;
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

function toBase64(text) {
  return Buffer.from(text, "utf8").toString("base64");
}

/**
 * Image fields are persisted EXACTLY as the administrator selected them.
 * Permitted values: an uploaded media path (/media/...) or one of the three
 * permanent approved assets. This is a strict ALLOWLIST, so external URLs,
 * traversal attempts and every deleted legacy asset all resolve to "no image".
 * Nothing is ever auto-assigned, defaulted or generated.
 */
const APPROVED = [
  "/images/لوجو.png",
  "/images/Bannerrr.png",
  "/images/saudiersaa-article-whatsapp-banner.png.png",
];

function cleanImage(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.includes("..")) return "";
  if (/^(https?:)?\/\//i.test(trimmed)) return "";
  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return "";
  }
  if (decoded.startsWith("/media/")) return trimmed;
  if (APPROVED.includes(decoded)) return decoded;
  return "";
}

function serialize(article) {
  const image = cleanImage(article.image);
  const thumbnail = cleanImage(article.thumbnail);
  const bannerImage = cleanImage(article.bannerImage);
  const ogImage = cleanImage(article.ogImage);
  const str = (value) => (typeof value === "string" ? value : "");

  const payload = {
    ...article,
    blocks: article.blocks.filter((b) => b && BLOCK_TYPES.has(b.type)),
    // Selected images survive verbatim; the alt text is the admin's exact
    // wording and is only dropped when its image is absent.
    image,
    imageAlt: image ? str(article.imageAlt) : "",
    thumbnail,
    thumbnailAlt: thumbnail ? str(article.thumbnailAlt) : "",
    bannerImage,
    bannerImageAlt: bannerImage ? str(article.bannerImageAlt) : "",
    ogImage,
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  const token = publishToken();
  if (!token) {
    const { status, body } = tokenMissingResponse(req.method === "DELETE" ? "إلغاء النشر" : "النشر");
    return json(res, status, body);
  }

  const url = new URL(req.url, "http://localhost");

  /* ----------------------------------------------------------- UNPUBLISH */
  if (req.method === "DELETE") {
    const slug = String(url.searchParams.get("slug") || "");
    if (!slugIsSafe(slug)) {
      return json(res, 400, { code: "INVALID_SLUG", error: "رابط غير صالح." });
    }
    const filePath = `${PUBLISHED_DIR}/${slug}.json`;
    const sha = await existingSha(token, filePath);
    if (!sha) {
      return json(res, 404, {
        code: "NOT_PUBLISHED",
        error: "لا يوجد مقال منشور بهذا الرابط في المستودع.",
        remedy: "المقال غير منشور أصلاً — يمكنك تحريره كمسودة.",
      });
    }
    const del = await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
      method: "DELETE",
      token,
      body: { message: `Unpublish ${slug}`, branch: BRANCH, sha },
    });
    if (!del.ok) {
      const failure = classifyGitHubFailure(del);
      return json(res, failure.status, failure.body);
    }
    return json(res, 200, {
      ok: true,
      slug,
      commit: del.payload?.commit?.sha ?? "",
      note: "أُلغي النشر والتُزم الحذف في المستودع. ستُزال الصفحة بعد اكتمال إعادة النشر على Vercel.",
    });
  }

  if (req.method !== "POST") {
    return json(res, 405, { code: "METHOD_NOT_ALLOWED", error: "Method not allowed" });
  }

  // Scheduled publishing is deliberately unsupported: publishing must be an
  // explicit administrator action, never a background cron promotion.
  if (url.searchParams.get("schedule") === "1") {
    return json(res, 400, {
      code: "SCHEDULING_DISABLED",
      error: "النشر المجدول غير مفعّل — النشر يدوي من المحرر فقط.",
    });
  }

  /* ------------------------------------------------------------- PUBLISH */
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return json(res, 400, { code: "BAD_JSON", error: "تعذر قراءة الطلب: JSON غير صالح." });
  }

  const article = body.article;
  if (!article || typeof article !== "object") {
    return json(res, 400, { code: "INVALID_ARTICLE", error: "بيانات المقال مفقودة أو تالفة." });
  }

  // ── Data-integrity gate ONLY. No SEO / word-count / FAQ / image gate. ──
  const slug = String(article.slug || "").trim();
  if (!slugIsSafe(slug)) {
    return json(res, 400, {
      code: "INVALID_SLUG",
      error: "رابط غير صالح: يُسمح بحروف إنجليزية صغيرة وأرقام وشرطات فقط (3–90 حرفاً).",
    });
  }
  if (!String(article.title || "").trim()) {
    return json(res, 400, { code: "MISSING_TITLE", error: "العنوان مطلوب — لا يمكن نشر صفحة بلا عنوان." });
  }
  if (!String(article.h1 || article.title || "").trim()) {
    return json(res, 400, { code: "MISSING_H1", error: "العنوان الرئيسي H1 مطلوب." });
  }
  if (!Array.isArray(article.blocks) || !article.blocks.some((b) => b && BLOCK_TYPES.has(b.type))) {
    return json(res, 400, { code: "EMPTY_BODY", error: "لا يوجد محتوى في المتن — لا يوجد ما يُنشر." });
  }

  const filePath = `${PUBLISHED_DIR}/${slug}.json`;
  const current = await readFile(token, filePath);

  // Duplicate-slug protection: a different article already owns this URL.
  if (current) {
    let ownerId = "";
    try {
      ownerId = String(JSON.parse(current.text)?.id ?? "");
    } catch {
      ownerId = "";
    }
    const incomingId = String(article.id || `cms-${slug}`);
    if (ownerId && ownerId !== incomingId) {
      return json(res, 409, {
        code: "DUPLICATE_SLUG",
        error: `الرابط "${slug}" مستخدم بالفعل لمقال منشور آخر.`,
        remedy: "غيّري الرابط (slug) أو حرّري المقال الأصلي بدلاً من إنشاء نسخة جديدة.",
      });
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    ...article,
    slug,
    id: article.id || `cms-${slug}`,
    status: "published",
    publishedAt: dateOnly(article.publishedAt) || today,
    updatedAt: today,
  };

  const commit = await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: "PUT",
    token,
    body: {
      message: `Publish: ${payload.title} (${slug})`,
      branch: BRANCH,
      content: toBase64(serialize(payload)),
      ...(current?.sha ? { sha: current.sha } : {}),
    },
  });

  if (!commit.ok) {
    const failure = classifyGitHubFailure(commit);
    return json(res, failure.status, failure.body);
  }

  return json(res, 200, {
    ok: true,
    slug,
    path: filePath,
    status: "published",
    commit: commit.payload?.commit?.sha ?? "",
    url: `https://saudiersaa.com/blog/${slug}`,
    note: "تم النشر والتُزم المقال في المستودع. ستظهر الصفحة العامة بعد اكتمال إعادة النشر على Vercel.",
  });
}
