import { randomBytes } from "crypto";

// In-memory session store for single-user app (resets on server restart)
const sessions = new Set<string>();

export function createSession(): string {
  const token = randomBytes(32).toString("hex");
  sessions.add(token);
  return token;
}

export function validateSession(token: string): boolean {
  return sessions.has(token);
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
