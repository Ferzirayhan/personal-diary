import type { AuthPayload } from "@/types";

const KEY = "personal-diary-auth";

export function saveAuth(payload: AuthPayload) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getAuth(): AuthPayload | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}
