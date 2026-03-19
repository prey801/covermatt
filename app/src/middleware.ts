import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Match /admin and all sub-paths except the login page itself
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through without auth (prevents redirect loop)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  // 1. No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Verify the JWT token securely
  const payload = await verifyToken(token);

  if (!payload || payload.role !== 'admin') {
    // Token is invalid or expired — clear cookie and redirect
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    res.cookies.delete('auth_token');
    return res;
  }

  // 3. User is authorized — also redirect away from login if already authed
  return NextResponse.next();
}
