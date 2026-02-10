const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(data.message || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function publicPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function privateRequest<T>(
  path: string,
  token: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  return request<T>(path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
