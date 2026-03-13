import { createHash, timingSafeEqual } from "crypto";

/**
 * Verifies the provided password against ADMIN_PASSWORD env var.
 * Both sides are hashed with SHA-256 to ensure equal-length buffers
 * for timing-safe comparison.
 */
export function verifyPassword(input: string): boolean {
  // process.env is read at runtime — never baked into the bundle
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const inputHash = createHash("sha256").update(input).digest();
  const storedHash = createHash("sha256").update(adminPassword).digest();

  return timingSafeEqual(inputHash, storedHash);
}
