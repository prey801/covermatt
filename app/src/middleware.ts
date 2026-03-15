import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Define which routes to protect with the JWT middleware
export const config = {
  matcher: ['/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // 1. If hitting a protected route but no token is found, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Verify the JWT token securely
  const payload = await verifyToken(token);

  if (!payload || payload.role !== 'admin') {
    // Token is invalid or expired
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 3. User is authorized! Allow the request to proceed
  return NextResponse.next();
}
