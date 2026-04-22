import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

/**
 * Verify a `<raw>.<sig>` admin_token cookie value.
 *
 * The login action (app/actions/auth.ts) generates:
 *   raw  = crypto.randomBytes(32).toString('hex')
 *   sig  = HMAC-SHA256(raw, ADMIN_SECRET)
 *   cookie value = `${raw}.${sig}`
 *
 * We re-derive the HMAC here and compare — no DB call, safe for Edge runtime.
 */
function verifyToken(value: string): boolean {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const lastDot = value.lastIndexOf('.');
  if (lastDot === -1) return false;

  const raw = value.slice(0, lastDot);
  const sig = value.slice(lastDot + 1);
  const expected = createHmac('sha256', secret).update(raw).digest('hex');

  // Length check + comparison (not constant-time in JS, but adequate for this threat model)
  return sig.length === expected.length && sig === expected;
}

export function middleware(request: NextRequest) {
  const tokenValue = request.cookies.get('admin_token')?.value ?? '';
  const isAuthenticated = tokenValue ? verifyToken(tokenValue) : false;
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
