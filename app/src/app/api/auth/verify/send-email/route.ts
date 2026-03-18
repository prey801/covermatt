import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/resend';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        const decoded = await verifyToken(token);
        if (!decoded || decoded.role === 'admin') return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (user.isEmailVerified) return NextResponse.json({ message: 'Email already verified' });

        // Generate a secure verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = verificationToken;
        await user.save();

        // Send email via shared utility
        await sendVerificationEmail(user.email, verificationToken);

        return NextResponse.json({ success: true, message: 'Verification email sent' });
    } catch (error) {
        console.error('Send Email Verification Error:', error);
        return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }
}
