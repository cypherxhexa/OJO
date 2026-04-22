import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Verify a `<raw>.<sig>` admin_token cookie value.
 *
 * Uses the Web Crypto API (crypto.subtle) — the ONLY crypto available
 * in the Edge runtime. Node's `crypto` module is NOT available here.
 *
 * The login action (app/actions/auth.ts) signs with Node's createHmac
 * using HMAC-SHA256 over UTF-8 encoded data — this produces the same
 * output as crypto.subtle with the same inputs.
 */
async function verifyToken(value: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const lastDot = value.lastIndexOf('.');
  if (lastDot === -1) return false;

  const raw = value.slice(0, lastDot);
  const sig = value.slice(lastDot + 1);

  const encoder = new TextEncoder();

  // Import the HMAC key from the secret
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the raw token with the same key
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(raw)
  );

  // Convert ArrayBuffer → hex string (same format as Node's .digest('hex'))
  const expected = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return sig.length === expected.length && sig === expected;
}

export async function middleware(request: NextRequest) {
  const tokenValue = request.cookies.get('admin_token')?.value ?? '';
  const isAuthenticated = tokenValue ? await verifyToken(tokenValue) : false;
  const path = request.nextUrl.pathname;

  // Protect /admin/* pages (except login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect /api/admin/* API routes
  if (path.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Prevent authenticated users from visiting the login page
  if (path === '/admin/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
