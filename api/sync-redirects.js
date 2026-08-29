import { json, requireAdmin } from "./_lib/session.js";
import { commitFilesAtomic, publishToken, readFile } from "./_lib/repo.js";

/**
 * POST /api/sync-redirects
 * --------------------------
 * The Redirect Manager's save action. Takes the full rule set, validates it
 * (status codes, duplicates, redirect loops), then commits BOTH files in one
 * atomic Git commit:
 *
 *   1. content/redirects.json   — the canonical registry (CMS source of truth)
 *   2. vercel.json              — regenerated edge `redirects` array
 *
 * The commit triggers a redeploy, so the new edge rules take effect on the
 * next deployment. Mirrors scripts/emitRedirects.mjs, which does the same
 * locally before every build.
 */

/** Percent-encode non-ASCII code points, preserving ASCII regex syntax. */
function encodePath(source) {
  let out = "";
  for (const ch of source) {
    if (ch.codePointAt(0) > 127) out += encodeURIComponent(ch);
    else out += ch;
  }
  return out;
}

function validate(rules) {
  const problems = [];
  const sources = new Map();
  for (const rule of rules) {
    if (!rule || typeof rule.source !== "string" || !rule.source) {
      problems.push("قاعدة بلا source");
      continue;
    }
    if (![301, 410].includes(rule.statusCode)) {
      problems.push(`${rule.source}: statusCode غير مدعوم (301/410 فقط)`);
    }
    if (rule.statusCode === 301 && !rule.destination) {
      problems.push(`${rule.source}: قاعدة 301 تحتاج destination`);
    }
    const key = encodePath(rule.source);
    if (sources.has(key)) problems.push(`${rule.source}: مصدر مكرر`);
    sources.set(key, rule);
  }
  // Loop protection: a destination must not itself be another rule's source.
  for (const rule of rules) {
    if (rule.destination && sources.has(rule.destination)) {
      problems.push(`${rule.source} -> ${rule.destination}: حلقة إعادة توجيه`);
    }
  }
  return problems;
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const token = publishToken();
  if (!token) {
    return json(res, 501, {
      ok: false,
      blocker: "EXTERNAL: GITHUB_PUBLISH_TOKEN غير مُعد في بيئة Vercel.",
      note: "القواعد محفوظة محلياً في هذه الجلسة، ويمكن إعادة إرسالها بعد إعداد الرمز.",
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const rules = Array.isArray(body.rules)
    ? body.rules.map((rule) => ({
        source: String(rule?.source ?? "").trim(),
        destination: rule?.destination ? String(rule.destination).trim() : null,
        statusCode: Number(rule?.statusCode) === 410 ? 410 : 301,
        isRegex: Boolean(rule?.isRegex),
        reason: String(rule?.reason ?? "").slice(0, 300),
        createdAt: String(rule?.createdAt ?? new Date().toISOString().slice(0, 10)),
      }))
    : [];

  if (rules.length > 300) {
    return json(res, 400, { ok: false, error: "أكثر من 300 قاعدة — قسّمي الملف." });
  }

  const problems = validate(rules);
  if (problems.length) {
    return json(res, 400, { ok: false, error: "فشل التحقق: " + problems.join("؛ ") });
  }

  const currentVercel = await readFile(token, "vercel.json");
  if (!currentVercel) {
    return json(res, 502, { ok: false, error: "تعذر قراءة vercel.json من المستودع." });
  }
  let config;
  try {
    config = JSON.parse(currentVercel.text);
  } catch (err) {
    return json(res, 502, { ok: false, error: `vercel.json غير صالح: ${String(err.message).slice(0, 120)}` });
  }

  const registry = {
    version: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    wwwToApex: Boolean(body.wwwToApex),
    rules,
  };

  const redirects = [];
  if (registry.wwwToApex) {
    redirects.push({
      source: "https://www.saudiersaa.com/(.*)",
      destination: "https://saudiersaa.com/$1",
      permanent: true,
    });
  }
  for (const rule of rules) {
    redirects.push({
      source: encodePath(rule.source),
      ...(rule.statusCode === 301 ? { destination: rule.destination } : {}),
      statusCode: rule.statusCode,
    });
  }
  config.redirects = redirects;

  const result = await commitFilesAtomic(
    token,
    [
      { path: "content/redirects.json", content: JSON.stringify(registry, null, 2) + "\n" },
      { path: "vercel.json", content: JSON.stringify(config, null, 2) + "\n" },
    ],
    "redirects: update registry and edge rules",
  );

  if (!result.ok) {
    return json(res, 502, {
      ok: false,
      error: "فشل الالتزام في المستودع.",
      detail: result.payload?.message ? String(result.payload.message).slice(0, 200) : `HTTP ${result.status}`,
    });
  }
  return json(res, 200, {
    ok: true,
    rules: rules.length,
    commit: result.payload?.object?.sha?.slice(0, 7) ?? "",
    note: "حُفظت القواعد وأعيد توليد vercel.json. ستبدأ إعادة النشر تلقائياً وتُفعَّل القواعد بعد اكتمالها.",
  });
}
