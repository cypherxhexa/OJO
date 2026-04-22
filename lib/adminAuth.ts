/**
 * Shared authorization helper for /api/admin/* route handlers.
 * These run on the Node.js runtime (not Edge), so we can use Node's `crypto`.
 *
 * Verifies the same HMAC-SHA256 signed cookie that middleware.ts validates
 * using the Web Crypto API. Both produce identical results.
 */
import { createHmac } from "crypto";
import { cookies } from "next/headers";

function verifyToken(value: string): boolean {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const lastDot = value.lastIndexOf(".");
  if (lastDot === -1) return false;

  const raw = value.slice(0, lastDot);
  const sig = value.slice(lastDot + 1);
  const expected = createHmac("sha256", secret).update(raw).digest("hex");

  return sig.length === expected.length && sig === expected;
}

/**
 * Returns true if the current request has a valid admin session cookie.
 * Use this at the top of every /api/admin/* handler.
 */
export function isAdminAuthorized(): boolean {
  const token = cookies().get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token);
}
