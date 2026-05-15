const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
    const err = new Error(body.message ?? `Request failed: ${res.status}`) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export function createApiClient(token?: string) {
  const opts = (extra?: RequestInit): RequestOptions => ({ ...extra, token });
  return {
    get: <T>(path: string) => request<T>(path, opts()),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, opts({ method: "POST", body: JSON.stringify(body) })),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, opts({ method: "PUT", body: JSON.stringify(body) })),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, opts({ method: "PATCH", body: body ? JSON.stringify(body) : undefined })),
    del: <T>(path: string) => request<T>(path, opts({ method: "DELETE" })),
  };
}

// Public client — no auth (for login/refresh)
export const publicApi = createApiClient();
