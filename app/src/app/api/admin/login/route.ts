import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

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
