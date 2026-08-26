import {
  authConfigured,
  clearSessionCookie,
  json,
  readSession,
  setSessionCookie,
  signSession,
  verifyCredentials,
} from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const session = readSession(req);
    return json(res, 200, { authenticated: Boolean(session), user: session?.u || "" });
  }

  if (req.method === "DELETE") {
    clearSessionCookie(res);
    return json(res, 200, { authenticated: false });
  }

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!authConfigured()) {
    return json(res, 503, {
      authenticated: false,
      error: "أضيفي ADMIN_PASSWORD وADMIN_SESSION_SECRET في متغيرات بيئة Vercel.",
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!verifyCredentials(username, password)) {
    return json(res, 401, { authenticated: false, error: "بيانات الدخول غير صحيحة." });
  }

  const token = signSession({ u: username, exp: Date.now() + 12 * 60 * 60 * 1000 });
  setSessionCookie(res, token);
  return json(res, 200, { authenticated: true, user: username });
}
