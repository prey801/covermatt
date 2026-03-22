import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        
        const { name, email, password, phone } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ success: false, error: 'User already exists with this email' }, { status: 409 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone: phone || '',
            role: 'customer'
        });

        // Send welcome email (fire-and-forget — don't block registration on email failure)
        sendWelcomeEmail(newUser.email, newUser.name).catch(err =>
            console.error('Welcome email failed:', err)
        );

        // Auto-login after registration
        const token = await signToken({ 
            userId: newUser._id.toString(), 
            email: newUser.email, 
            role: newUser.role 
        });

        const response = NextResponse.json({ success: true, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
        
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;
    } catch (error: any) {
        console.error('Registration API Error:', error);
        return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
