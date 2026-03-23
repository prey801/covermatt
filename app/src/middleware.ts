import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Apply to all routes except static files
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// Allowed origins for CSRF validation (set in env, comma-separated)
function getAllowedOrigins(): string[] {
    const origins = process.env.ALLOWED_ORIGINS || '';
    const list = origins.split(',').map(o => o.trim()).filter(Boolean);
    // Always allow localhost in development
    if (process.env.NODE_ENV !== 'production') {
        list.push(
            'http://localhost:3000', 
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001'
        );
    }
    return list;
}

// State-changing HTTP methods that need CSRF protection
const CSRF_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);

function addSecurityHeaders(response: NextResponse): NextResponse {
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    // Prevent MIME-type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // HSTS - enforce HTTPS
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
    );
    // Prevent XSS - Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' https://*.stripe.com https://*.googleapis.com",
            "frame-src 'self' https://*.stripe.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; ')
    );
    // Prevent information leakage
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    // Permissions policy
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self)'
    );
    return response;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- CSRF Protection for state-changing requests ---
    if (CSRF_METHODS.has(request.method)) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');

        // Skip CSRF for webhook callbacks (they come from external services)
        const isWebhook = pathname.startsWith('/api/mpesa/callback') ||
                          pathname.startsWith('/api/stripe/webhook');

        if (!isWebhook) {
            const allowedOrigins = getAllowedOrigins();

            // Must have an Origin or Referer header
            const requestOrigin = origin || (referer ? new URL(referer).origin : null);

            if (!requestOrigin) {
                return NextResponse.json(
                    { error: 'Forbidden: missing origin' },
                    { status: 403 }
                );
            }

            if (allowedOrigins.length > 0 && !allowedOrigins.includes(requestOrigin)) {
                return NextResponse.json(
                    { error: 'Forbidden: invalid origin' },
                    { status: 403 }
                );
            }
        }
    }

    // --- Admin Auth Protection ---
    if (pathname.startsWith('/admin')) {
        // Allow the login page through without auth
        if (pathname === '/admin/login') {
            return addSecurityHeaders(NextResponse.next());
        }

        // Allow admin API routes to handle their own auth
        if (pathname.startsWith('/api/')) {
            return addSecurityHeaders(NextResponse.next());
        }

        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return addSecurityHeaders(
                NextResponse.redirect(new URL('/admin/login', request.url))
            );
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            const res = NextResponse.redirect(new URL('/admin/login', request.url));
            res.cookies.delete('auth_token');
            return addSecurityHeaders(res);
        }
    }

    // Add security headers to all responses
    return addSecurityHeaders(NextResponse.next());
}
