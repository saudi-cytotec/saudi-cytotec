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
  return api<{ article?: Record<string, unknown>; error?: string; configured?: boolean }>("/api/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function publishRequest(article: unknown, schedule = false) {
  return api<{
    ok?: boolean;
    slug?: string;
    url?: string;
    scheduled?: boolean;
    publishAt?: string;
    error?: string;
    blocker?: string;
    note?: string;
  }>(`/api/publish${schedule ? "?schedule=1" : ""}`, {
    method: "POST",
    body: JSON.stringify({ article }),
  });
}

export function unpublishRequest(slug: string) {
  return api<{ ok?: boolean; error?: string }>(`/api/publish?slug=${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}
