import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Check against Admin Credentials in .env
        const isValidAdmin = 
            email === process.env.ADMIN_EMAIL && 
            password === process.env.ADMIN_PASSWORD;

        if (isValidAdmin) {
            const token = await signToken({ email, role: 'admin' });
            const response = NextResponse.json({ success: true, redirect: '/admin' });
            response.cookies.set('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 24 hours
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

        const token = await signToken({ 
            userId: user._id.toString(), 
            email: user.email, 
            role: user.role 
        });

        const response = NextResponse.json({ success: true, redirect: '/account' });
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
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

