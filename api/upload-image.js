import { json, requireAdmin } from "./_lib/session.js";
import { existingSha, gh, publishToken } from "./_lib/repo.js";

/**
 * POST /api/upload-image
 * ------------------------
 * Uploads an image into public/images/uploads/ as a repository commit
 * (which triggers a redeploy). The uploaded file is then served from
 * /images/uploads/<name> with the long-cache image header configured in
 * vercel.json.
 *
 * Body: { name: "filename.jpg", data: "<base64>" }
 *
 * Constraints: extension whitelist, 2 MB cap, safe filename only.
 */
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "svg"]);
const MAX_BYTES = 2 * 1024 * 1024;

const OWNER = process.env.GITHUB_REPO_OWNER || "saudi-cytotec";
const REPO = process.env.GITHUB_REPO_NAME || "saudi-cytotec";
const BRANCH = process.env.GITHUB_REPO_BRANCH || "main";

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const token = publishToken();
  if (!token) {
    return json(res, 501, {
      ok: false,
      blocker: "EXTERNAL: GITHUB_PUBLISH_TOKEN غير مُعد في بيئة Vercel.",
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const rawName = String(body.name || "").trim();
  const name = rawName.toLowerCase().replace(/[^a-z0-9._-]/g, "-").slice(0, 80);
  const ext = name.split(".").pop() || "";
  if (!ALLOWED_EXT.has(ext)) {
    return json(res, 400, { ok: false, error: "امتداد غير مسموح (jpg/jpeg/png/webp/svg فقط)." });
  }
  const data = String(body.data ?? "");
  if (!data) return json(res, 400, { ok: false, error: "لا توجد بيانات صورة." });

  let buffer;
  try {
    buffer = Buffer.from(data, "base64");
  } catch {
    return json(res, 400, { ok: false, error: "البيانات ليست base64 صالحة." });
  }
  if (!buffer.length || buffer.length > MAX_BYTES) {
    return json(res, 400, { ok: false, error: "حجم الصورة خارج الحدود (2MB كحد أقصى)." });
  }

  const path = `public/images/uploads/${name}`;
  const sha = await existingSha(token, path);
  const result = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    token,
    body: {
      message: `media: upload ${name}`,
      branch: BRANCH,
      content: buffer.toString("base64"),
      ...(sha ? { sha } : {}),
    },
  });
  if (!result.ok) {
    return json(res, 502, {
      ok: false,
      error: "فشل رفع الصورة إلى المستودع.",
      detail: result.payload?.message ? String(result.payload.message).slice(0, 200) : `HTTP ${result.status}`,
    });
  }
  return json(res, 200, {
    ok: true,
    url: `/images/uploads/${name}`,
    commit: result.payload?.commit?.sha?.slice(0, 7) ?? "",
    note: "رُفعت الصورة. ستظهر بعد اكتمال إعادة النشر.",
  });
}
