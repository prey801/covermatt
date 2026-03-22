import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { headers } from 'next/headers';

// Simple in-memory rate limiter for admin login
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(headersList: Headers): string {
    return headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
        || headersList.get('x-real-ip')
        || 'unknown';
}

export async function POST(request: Request) {
    const headersList = await headers();
    const ip = getRateLimitKey(headersList);

    // Check rate limit
    const now = Date.now();
    const attempts = loginAttempts.get(ip);
    if (attempts) {
        if (now - attempts.firstAttempt > WINDOW_MS) {
            loginAttempts.delete(ip); // Window expired, reset
        } else if (attempts.count >= MAX_ATTEMPTS) {
            const retryAfter = Math.ceil((WINDOW_MS - (now - attempts.firstAttempt)) / 1000);
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
                { status: 429 }
            );
        }
    }

    const { email, password } = await request.json();

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        // Track failed attempt
        const current = loginAttempts.get(ip);
        if (current) {
            current.count++;
        } else {
            loginAttempts.set(ip, { count: 1, firstAttempt: now });
        }
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success — clear rate limit for this IP
    loginAttempts.delete(ip);

    // Sign a JWT with the admin role
    const token = await signToken({ email, role: 'admin' });

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
    return response;
}

