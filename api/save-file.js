import { json, requireAdmin } from "./_lib/session.js";
import { publishToken, writeFile } from "./_lib/repo.js";

/**
 * POST /api/save-file
 * ---------------------
 * Commits a whitelisted registry file to the repository. The commit triggers a
 * Vercel redeploy, so the change becomes live in the next deployment.
 *
 * Body: { path: "content/map.json", content: <string>, message: <string> }
 *
 * Only the registry files below may be written. Published articles go through
 * /api/publish (manual, admin-only — no scheduled publishing exists), and
 * redirects through /api/sync-redirects (which also regenerates vercel.json).
 */
const WHITELIST = new Set([
  "content/map.json",
  "content/references.json",
  "content/settings.json",
  "content/clusters.json",
  "content/competitors.json",
  "content/geo-coverage.json",
]);

const MAX_BYTES = 512 * 1024;

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const token = publishToken();
  if (!token) {
    return json(res, 501, {
      ok: false,
      blocker: "EXTERNAL: GITHUB_PUBLISH_TOKEN غير مُعد في بيئة Vercel.",
      note: "التعديل محفوظ محلياً في هذه الجلسة، ويمكن إعادة إرساله بعد إعداد الرمز.",
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const path = String(body.path || "").trim();
  const content = String(body.content ?? "");
  const message = String(body.message || `docs: update ${path}`).slice(0, 200);

  if (!WHITELIST.has(path)) {
    return json(res, 400, { ok: false, error: `مسار غير مسموح: ${path}` });
  }
  if (!content) {
    return json(res, 400, { ok: false, error: "المحتوى فارغ." });
  }
  if (Buffer.byteLength(content, "utf8") > MAX_BYTES) {
    return json(res, 400, { ok: false, error: "الملف أكبر من الحد المسموح (512KB)." });
  }
  try {
    JSON.parse(content);
  } catch (err) {
    return json(res, 400, { ok: false, error: `المحتوى ليس JSON صالحاً: ${String(err.message).slice(0, 120)}` });
  }

  const result = await writeFile(token, path, content, message);
  if (!result.ok) {
    return json(res, 502, {
      ok: false,
      error: "فشل الالتزام في المستودع.",
      detail: result.payload?.message ? String(result.payload.message).slice(0, 200) : `HTTP ${result.status}`,
    });
  }
  return json(res, 200, {
    ok: true,
    path,
    commit: result.payload?.commit?.sha?.slice(0, 7) ?? "",
    note: "حُفظ الملف في المستودع. ستبدأ إعادة النشر تلقائياً ويظهر التغيير بعد اكتمالها.",
  });
}
