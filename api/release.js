import crypto from "crypto";
import { json } from "./_lib/session.js";

/**
 * Scheduler — promotes due articles from content/scheduled to content/published.
 *
 * Triggered by the Vercel Cron defined in vercel.json (daily). Vercel sends
 * `Authorization: Bearer $CRON_SECRET`, which is verified below so this route
 * cannot be invoked by an anonymous caller.
 *
 * All moves are applied as ONE atomic commit via the Git Data API, so a run
 * either publishes everything due or nothing.
 */

const OWNER = process.env.GITHUB_REPO_OWNER || "saudi-cytotec";
const REPO = process.env.GITHUB_REPO_NAME || "saudi-cytotec";
const BRANCH = process.env.GITHUB_REPO_BRANCH || "main";
const API = "https://api.github.com";

const PUBLISHED_DIR = "content/published";
const SCHEDULED_DIR = "content/scheduled";

function today() {
  return new Date().toISOString().slice(0, 10);
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

function authorized(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.authorization || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  if (!provided || provided.length !== expected.length) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (!authorized(req)) {
    return json(res, 401, { error: "غير مصرح" });
  }

  const token = process.env.GITHUB_PUBLISH_TOKEN;
  if (!token) {
    return json(res, 501, {
      blocker: "EXTERNAL: GITHUB_PUBLISH_TOKEN is not set.",
      promoted: 0,
    });
  }

  const cutoff = today();

  const listing = await gh(`/repos/${OWNER}/${REPO}/contents/${SCHEDULED_DIR}?ref=${BRANCH}`, { token });
  if (listing.status === 404) return json(res, 200, { promoted: 0, note: "لا توجد مقالات مجدولة." });
  if (!listing.ok) return json(res, 502, { error: "تعذر قراءة قائمة المجدول." });

  const files = (listing.payload || []).filter((f) => f.type === "file" && f.name.endsWith(".json"));

  const due = [];
  for (const file of files) {
    const fetched = await gh(`/repos/${OWNER}/${REPO}/contents/${file.path}?ref=${BRANCH}`, { token });
    if (!fetched.ok || !fetched.payload?.content) continue;
    let parsed;
    try {
      parsed = JSON.parse(Buffer.from(fetched.payload.content, "base64").toString("utf8"));
    } catch {
      continue;
    }
    if (typeof parsed.publishedAt === "string" && parsed.publishedAt <= cutoff) {
      due.push({ file, parsed });
    }
  }

  if (!due.length) return json(res, 200, { promoted: 0, note: "لا شيء مستحق النشر اليوم." });

  // ── Atomic commit ────────────────────────────────────────────────────────
  const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, { token });
  if (!ref.ok) return json(res, 502, { error: "تعذر قراءة مرجع الفرع." });

  const tree = [];
  for (const { file, parsed } of due) {
    const promoted = { ...parsed, status: "published", updatedAt: cutoff };
    tree.push({
      path: `${PUBLISHED_DIR}/${file.name}`,
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify(promoted, null, 2)}\n`,
    });
    tree.push({ path: file.path, mode: "100644", type: "blob", sha: null });
  }

  const newTree = await gh(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    token,
    body: { base_tree: ref.payload.object.sha, tree },
  });
  if (!newTree.ok) return json(res, 502, { error: "تعذر إنشاء الـtree." });

  const commit = await gh(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    token,
    body: {
      message: `Publish ${due.length} scheduled article${due.length > 1 ? "s" : ""} (${cutoff})`,
      tree: newTree.payload.sha,
      parents: [ref.payload.object.sha],
    },
  });
  if (!commit.ok) return json(res, 502, { error: "تعذر إنشاء الـcommit." });

  const update = await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    token,
    body: { sha: commit.payload.sha },
  });
  if (!update.ok) return json(res, 502, { error: "تعذر تحديث الفرع." });

  return json(res, 200, {
    promoted: due.length,
    slugs: due.map((d) => d.parsed.slug),
    commit: commit.payload.sha.slice(0, 7),
  });
}
