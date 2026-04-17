import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const path = request.nextUrl.pathname;

  // Protect /admin/* pages (except login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!token || token !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect /api/admin/* API routes
  if (path.startsWith('/api/admin')) {
    if (!token || token !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Prevent authenticated users from visiting the login page
  if (path === '/admin/login' && token === 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
