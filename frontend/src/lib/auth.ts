import type { User } from "@/types/api/auth";

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 < Date.now();
}

export function getUserFromPayload(
  payload: Record<string, unknown>
): User | null {
  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string" ||
    typeof payload.name !== "string"
  ) {
    return null;
  }

  if (payload.role !== "admin" && payload.role !== "user") return null;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    phone: typeof payload.phone === "string" ? payload.phone : undefined,
  };
}
