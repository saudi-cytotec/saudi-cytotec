import { json, requireAdmin } from "./_lib/session.js";
import { publishToken, readFile, writeFile } from "./_lib/repo.js";

/**
 * /api/not-found — 404 Monitor sync (admin-only).
 *
 * 404 hits are collected in the admin's browser session (no per-visitor
 * network calls), and the editor explicitly syncs them here. The log is
 * committed to content/404-log.json (capped at 300 entries) so the team has a
 * durable record and can convert hits into redirect rules.
 *
 *   GET  /api/not-found          -> current committed log
 *   POST /api/not-found          -> append entries {path, firstSeen, lastSeen, count}
 */
const LOG_PATH = "content/404-log.json";
const MAX_ENTRIES = 300;

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const token = publishToken();
    if (!token) return json(res, 501, { ok: false, blocker: "EXTERNAL: GITHUB_PUBLISH_TOKEN غير مُعد." });
    const file = await readFile(token, LOG_PATH);
    if (!file) return json(res, 200, { ok: true, entries: [] });
    try {
      const parsed = JSON.parse(file.text);
      return json(res, 200, { ok: true, entries: Array.isArray(parsed.entries) ? parsed.entries : [] });
    } catch {
      return json(res, 200, { ok: true, entries: [] });
    }
  }

  if (req.method === "POST") {
    const token = publishToken();
    if (!token) {
      return json(res, 501, {
        ok: false,
        blocker: "EXTERNAL: GITHUB_PUBLISH_TOKEN غير مُعد. السجل محفوظ محلياً.",
      });
    }
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const incoming = Array.isArray(body.entries)
      ? body.entries
          .filter((entry) => entry && typeof entry.path === "string")
          .map((entry) => ({
            path: String(entry.path).slice(0, 300),
            firstSeen: String(entry.firstSeen ?? new Date().toISOString().slice(0, 10)),
            lastSeen: String(entry.lastSeen ?? new Date().toISOString().slice(0, 10)),
            count: Math.max(1, Number(entry.count) || 1),
            handled: Boolean(entry.handled),
            handledBy: entry.handledBy ? String(entry.handledBy) : undefined,
          }))
          .slice(0, 100)
      : [];

    if (!incoming.length) return json(res, 400, { ok: false, error: "لا توجد مسارات لإضافتها." });

    const file = await readFile(token, LOG_PATH);
    let existing = [];
    if (file) {
      try {
        existing = JSON.parse(file.text).entries ?? [];
      } catch {
        existing = [];
      }
    }
    const merged = new Map(existing.map((entry) => [entry.path, entry]));
    for (const entry of incoming) {
      const current = merged.get(entry.path);
      if (current) {
        current.lastSeen = entry.lastSeen;
        current.count += entry.count;
        current.handled = current.handled || entry.handled;
      } else {
        merged.set(entry.path, entry);
      }
    }
    const entries = [...merged.values()].slice(-MAX_ENTRIES);
    const content = JSON.stringify({ version: 1, updatedAt: new Date().toISOString().slice(0, 10), entries }, null, 2) + "\n";

    const result = await writeFile(token, LOG_PATH, content, "404-log: sync monitor entries");
    if (!result.ok) {
      return json(res, 502, {
        ok: false,
        error: "فشل الالتزام في المستودع.",
        detail: result.payload?.message ? String(result.payload.message).slice(0, 200) : `HTTP ${result.status}`,
      });
    }
    return json(res, 200, { ok: true, entries: entries.length, note: "تمت مزامنة سجل 404 إلى المستودع." });
  }

  return json(res, 405, { error: "Method not allowed" });
}
