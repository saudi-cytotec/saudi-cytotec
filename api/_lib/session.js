import crypto from "crypto";

const COOKIE = "sa_admin_session";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function expectedUser() {
  return process.env.ADMIN_USERNAME || "";
}

function expectedPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function authConfigured() {
  return Boolean(expectedPassword() && secret());
}

export function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSession(req) {
  const header = req.headers.cookie || "";
  const part = header.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE}=`));
  if (!part || !secret()) return null;
  const token = part.slice(COOKIE.length + 1);
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

export function verifyCredentials(username, password) {
  const user = expectedUser();
  const pass = expectedPassword();
  if (!pass) return false;
  const userOk = user ? username === user : Boolean(username);
  const left = Buffer.from(String(password));
  const right = Buffer.from(pass);
  if (left.length !== right.length) return false;
  return userOk && crypto.timingSafeEqual(left, right);
}

export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=43200; SameSite=Lax${secure}`);
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

export function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export function requireAdmin(req, res) {
  const session = readSession(req);
  if (!session) {
    json(res, 401, { authenticated: false, error: "غير مصرح" });
    return null;
  }
  return session;
}
