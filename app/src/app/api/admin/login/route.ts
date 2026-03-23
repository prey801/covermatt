import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { rateLimit, getClientIp, clearRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
    const headersList = await headers();
    const ip = getClientIp(headersList);

    // Rate limit: 5 attempts per 15 minutes per IP
    const { limited, retryAfterSeconds } = rateLimit('admin-login', ip, 5, 15 * 60 * 1000);
    if (limited) {
        return NextResponse.json(
            { error: `Too many login attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
            { status: 429 }
        );
    }

    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminHash) {
        console.error('Admin credentials not properly configured in environment');
        return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    if (email !== adminEmail) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, adminHash);
    if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success — clear rate limit for this IP
    clearRateLimit('admin-login', ip);

    // Sign a JWT with the admin role
    const token = await signToken({ email, role: 'admin' });

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
    return response;
}
