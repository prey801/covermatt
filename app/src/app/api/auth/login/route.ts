import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Check against Admin Credentials in .env
        const isValidAdmin = 
            email === process.env.ADMIN_EMAIL && 
            password === process.env.ADMIN_PASSWORD;

        if (!isValidAdmin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate the JWT
        const token = await signToken({ 
            email, 
            role: 'admin' 
        });

        // Set the HTTP-Only cookie to secure the session
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json({ success: true, redirect: '/admin' });

    } catch (error: any) {
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
