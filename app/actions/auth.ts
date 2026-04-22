"use server";

import { cookies, headers } from "next/headers";
import { createHmac, randomBytes } from "crypto";
import { rateLimit } from "@/lib/rateLimit";

/**
 * The secret used to sign session tokens.
 * Must be set in .env / Vercel environment variables as ADMIN_SECRET.
 * Falls back to ADMIN_PASSWORD so existing deployments don't break
 * immediately, but ADMIN_SECRET should be set explicitly.
 */
function getSecret(): string {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_SECRET is not configured.");
  return secret;
}

/**
 * Sign a raw token with HMAC-SHA256.
 * The cookie stores the raw token; middleware re-signs it and compares.
 */
function signToken(raw: string): string {
  return createHmac("sha256", getSecret()).update(raw).digest("hex");
}

/**
 * Build the cookie value: `<raw>.<signature>`
 * Middleware splits on "." and re-signs the raw part to verify.
 */
function buildSignedCookieValue(raw: string): string {
  return `${raw}.${signToken(raw)}`;
}



function getClientIp(): string {
  const hdrs = headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown"
  );
}

export async function loginAdmin(formData: FormData) {
  const ip = getClientIp();

  // Rate-limit: 5 attempts per IP per 15 minutes
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterMs / 60000);
    return {
      success: false,
      error: `Too many login attempts. Try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.`,
    };
  }

  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not configured in the environment.");
  }

  if (password === adminPassword) {
    const raw = randomBytes(32).toString("hex");
    const cookieValue = buildSignedCookieValue(raw);

    cookies().set("admin_token", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
  cookies().delete("admin_token");
}
