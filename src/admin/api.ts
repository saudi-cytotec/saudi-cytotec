export async function api<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T }> {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  const data = (await response.json().catch(() => ({}))) as T;
  return { ok: response.ok, status: response.status, data };
}

export function sessionCheck() {
  return api<{ authenticated: boolean; user?: string }>("/api/auth");
}

export function loginRequest(username: string, password: string) {
  return api<{ authenticated: boolean; error?: string }>("/api/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logoutRequest() {
  return api("/api/auth", { method: "DELETE" });
}

export function generateRequest(payload: Record<string, unknown>) {
  return api<{ article?: Record<string, unknown>; research?: Record<string, unknown>; outline?: Record<string, unknown>; error?: string; configured?: boolean }>(
    "/api/generate",
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function publishRequest(article: unknown) {
  // Manual publish only. There is no scheduled / cron / automatic publish API.
  return api<{
    ok?: boolean;
    slug?: string;
    url?: string;
    error?: string;
    blocker?: string;
    note?: string;
  }>("/api/publish", {
    method: "POST",
    body: JSON.stringify({ article }),
  });
}

export function unpublishRequest(slug: string) {
  return api<{ ok?: boolean; error?: string }>(`/api/publish?slug=${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}

export function uploadImageRequest(name: string, data: string, alt = "") {
  return api<{
    ok?: boolean;
    url?: string;
    width?: number;
    height?: number;
    bytes?: number;
    note?: string;
    error?: string;
    remedy?: string;
    code?: string;
    detail?: string;
  }>("/api/upload-image", {
    method: "POST",
    body: JSON.stringify({ name, data, alt }),
  });
}

export function deleteImageRequest(file: string) {
  return api<{ ok?: boolean; note?: string; error?: string; remedy?: string; code?: string }>(
    `/api/upload-image?file=${encodeURIComponent(file)}`,
    { method: "DELETE" },
  );
}

export function statusRequest() {
  return api<{
    environment: string;
    repo: { OWNER: string; REPO: string; BRANCH: string };
    configured: Record<string, boolean>;
    capabilities: Record<string, boolean>;
  }>("/api/status");
}

export function saveFileRequest(path: string, content: string, message?: string) {
  return api<{ ok?: boolean; path?: string; commit?: string; note?: string; error?: string; blocker?: string }>("/api/save-file", {
    method: "POST",
    body: JSON.stringify({ path, content, message }),
  });
}

export function syncRedirectsRequest(rules: unknown[], wwwToApex: boolean) {
  return api<{ ok?: boolean; rules?: number; commit?: string; note?: string; error?: string; blocker?: string }>("/api/sync-redirects", {
    method: "POST",
    body: JSON.stringify({ rules, wwwToApex }),
  });
}

export function notFoundLogRequest() {
  return api<{ ok?: boolean; entries?: unknown[]; blocker?: string }>("/api/not-found");
}

export function notFoundSyncRequest(entries: unknown[]) {
  return api<{ ok?: boolean; entries?: number; note?: string; error?: string; blocker?: string }>("/api/not-found", {
    method: "POST",
    body: JSON.stringify({ entries }),
  });
}
