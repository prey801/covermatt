import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { rateLimit, getClientIp, clearRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
    try {
        // Rate limit: 10 attempts per 15 minutes per IP
        const headersList = await headers();
        const ip = getClientIp(headersList);
        const { limited, retryAfterSeconds } = rateLimit('customer-login', ip, 10, 15 * 60 * 1000);
        if (limited) {
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
                { status: 429 }
            );
        }

        const { email, password, remember } = await request.json();

        // Check against Admin Credentials in .env
        const isValidAdmin = 
            email === process.env.ADMIN_EMAIL && 
            password === process.env.ADMIN_PASSWORD;

        if (isValidAdmin) {
            clearRateLimit('customer-login', ip);
            const token = await signToken({ email, role: 'admin' });
            const response = NextResponse.json({ success: true, redirect: '/admin' });
            response.cookies.set('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 24 hours
            });
            return response;
        }

        // --- 2. Customer DB Login Fallback ---
        await connectToDatabase();
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        clearRateLimit('customer-login', ip);

        const token = await signToken({ 
            userId: user._id.toString(), 
            email: user.email, 
            role: user.role 
        });

        const response = NextResponse.json({ success: true, redirect: '/account' });
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 24 hours
        });
        return response;

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}

