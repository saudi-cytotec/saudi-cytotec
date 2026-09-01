import { json, requireAdmin } from "./_lib/session.js";
import { commitFilesAtomic, publishToken, readFile } from "./_lib/repo.js";
import { classifyGitHubFailure } from "./_lib/errors.js";

/**
 * POST /api/upload-image  — real, persistent media upload
 * -------------------------------------------------------
 * The image is committed into the repository (public/media/<name>) together
 * with its registry row (content/media.json) in ONE atomic commit. Because the
 * file lives in Git and is served from the deployed output, the upload
 * survives refresh, logout/login, deployment, Vercel redeploy and being opened
 * from a different browser. Nothing is ever stored only in localStorage, a
 * blob: URL or browser memory.
 *
 * DELETE /api/upload-image?file=/media/<name>
 *   Removes an uploaded image and its registry row (also one atomic commit).
 *   Refused when the image is still referenced by an article.
 *
 * Security: admin session required, MIME sniffed from the actual bytes,
 * extension allowlist, size cap, filename sanitised to a safe basename (no
 * path traversal, no executable types). GITHUB_PUBLISH_TOKEN is read from the
 * environment and is never logged or returned.
 */

const MEDIA_DIR = "public/media";
const REGISTRY_PATH = "content/media.json";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Detect the real type from magic bytes — never trust the client's label. */
function sniff(buffer) {
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer.length > 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length > 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

/** Reduce any client filename to a safe basename: no directories, no traversal. */
function safeName(raw) {
  const base = String(raw || "")
    .split(/[\\/]/)
    .pop()
    .trim()
    .toLowerCase();
  const cleaned = base
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 80);
  const parts = cleaned.split(".");
  const ext = parts.length > 1 ? parts.pop() : "";
  const stem = parts.join("-").replace(/[^a-z0-9\-_]/g, "").slice(0, 60) || "image";
  return { stem, ext };
}

/** Read PNG/JPEG/WebP intrinsic dimensions (best effort, 0 when unknown). */
function dimensions(buffer, mime) {
  try {
    if (mime === "image/png") {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (mime === "image/jpeg") {
      let i = 2;
      while (i < buffer.length - 9) {
        if (buffer[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = buffer[i + 1];
        const len = buffer.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
    if (mime === "image/webp" && buffer.toString("ascii", 12, 16) === "VP8X") {
      return {
        width: 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)),
        height: 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)),
      };
    }
  } catch {
    /* dimensions are informational only */
  }
  return { width: 0, height: 0 };
}

async function loadRegistry(token) {
  const file = await readFile(token, REGISTRY_PATH);
  if (!file || !file.text.trim()) return { version: 1, items: [] };
  try {
    const parsed = JSON.parse(file.text);
    return { version: 1, items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { version: 1, items: [] };
  }
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  const token = publishToken();
  if (!token) {
    return json(res, 503, {
      ok: false,
      code: "PUBLISH_TOKEN_MISSING",
      error:
        "رفع الصور غير مُفعّل: مفتاح الكتابة إلى المستودع (GITHUB_PUBLISH_TOKEN) غير موجود في بيئة الإنتاج.",
      remedy: "أضيفي GITHUB_PUBLISH_TOKEN في إعدادات المشروع على Vercel ثم أعيدي المحاولة.",
    });
  }

  const url = new URL(req.url, "http://localhost");

  /* ------------------------------------------------------------- DELETE */
  if (req.method === "DELETE") {
    const file = String(url.searchParams.get("file") || "");
    if (!file.startsWith("/media/") || file.includes("..")) {
      return json(res, 400, { ok: false, code: "INVALID_PATH", error: "مسار صورة غير صالح." });
    }
    const registry = await loadRegistry(token);
    if (!registry.items.some((item) => item && item.file === file)) {
      return json(res, 404, { ok: false, code: "NOT_FOUND", error: "لا توجد صورة مرفوعة بهذا المسار." });
    }
    const next = { version: 1, items: registry.items.filter((item) => item && item.file !== file) };
    const result = await commitFilesAtomic(
      token,
      [{ path: REGISTRY_PATH, content: `${JSON.stringify(next, null, 2)}\n` }],
      `media: delete ${file}`,
      [`${MEDIA_DIR}/${file.slice("/media/".length)}`],
    );
    if (!result.ok) {
      const failure = classifyGitHubFailure(result);
      return json(res, failure.status, { ok: false, ...failure.body });
    }
    return json(res, 200, {
      ok: true,
      file,
      note: "حُذفت الصورة من المستودع. ستختفي بعد اكتمال إعادة النشر.",
    });
  }

  if (req.method !== "POST") return json(res, 405, { ok: false, code: "METHOD", error: "Method not allowed" });

  /* --------------------------------------------------------------- POST */
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return json(res, 400, { ok: false, code: "BAD_JSON", error: "تعذر قراءة الطلب (JSON غير صالح)." });
  }

  const { stem, ext } = safeName(body.name);
  if (!Object.prototype.hasOwnProperty.call(ALLOWED, ext)) {
    return json(res, 415, {
      ok: false,
      code: "BAD_EXTENSION",
      error: "امتداد غير مسموح. الصيغ المقبولة: JPG، JPEG، PNG، WEBP فقط.",
    });
  }

  const data = String(body.data ?? "");
  if (!data) return json(res, 400, { ok: false, code: "NO_DATA", error: "لا توجد بيانات صورة في الطلب." });

  let buffer;
  try {
    buffer = Buffer.from(data, "base64");
  } catch {
    return json(res, 400, { ok: false, code: "BAD_BASE64", error: "بيانات الصورة ليست base64 صالحة." });
  }
  if (!buffer.length) {
    return json(res, 400, { ok: false, code: "EMPTY_FILE", error: "الملف فارغ." });
  }
  if (buffer.length > MAX_BYTES) {
    return json(res, 413, {
      ok: false,
      code: "TOO_LARGE",
      error: `حجم الصورة ${(buffer.length / 1048576).toFixed(1)}MB — الحد الأقصى 5MB.`,
    });
  }

  // The real content type must match the extension: blocks a renamed
  // executable/script and any non-image payload.
  const sniffed = sniff(buffer);
  if (!sniffed) {
    return json(res, 415, {
      ok: false,
      code: "NOT_AN_IMAGE",
      error: "محتوى الملف ليس صورة JPG/PNG/WEBP صالحة (فشل فحص التوقيع).",
    });
  }
  if (sniffed !== ALLOWED[ext]) {
    return json(res, 415, {
      ok: false,
      code: "MIME_MISMATCH",
      error: `محتوى الملف (${sniffed}) لا يطابق الامتداد (.${ext}).`,
    });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const registry = await loadRegistry(token);
  let fileName = `${stem}.${ext}`;
  if (registry.items.some((item) => item && item.file === `/media/${fileName}`)) {
    fileName = `${stem}-${Date.now().toString(36)}.${ext}`;
  }

  const publicPath = `/media/${fileName}`;
  const { width, height } = dimensions(buffer, sniffed);
  const alt = typeof body.alt === "string" ? body.alt.slice(0, 300) : "";

  const nextRegistry = {
    version: 1,
    items: [
      ...registry.items.filter((item) => item && item.file !== publicPath),
      { file: publicPath, alt, width, height, bytes: buffer.length, uploadedAt: stamp },
    ],
  };

  // Image bytes + registry row land in a single atomic commit: the library can
  // never reference a file that does not exist, or vice versa.
  const result = await commitFilesAtomic(
    token,
    [
      { path: `${MEDIA_DIR}/${fileName}`, content: buffer.toString("base64"), encoding: "base64" },
      { path: REGISTRY_PATH, content: `${JSON.stringify(nextRegistry, null, 2)}\n` },
    ],
    `media: upload ${fileName}`,
  );

  if (!result.ok) {
    const failure = classifyGitHubFailure(result);
    return json(res, failure.status, { ok: false, ...failure.body });
  }

  return json(res, 200, {
    ok: true,
    url: publicPath,
    file: publicPath,
    alt,
    width,
    height,
    bytes: buffer.length,
    mime: sniffed,
    note: "رُفعت الصورة والتُزمت في المستودع. ستصبح متاحة على الموقع بعد اكتمال إعادة النشر.",
  });
}
