import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { Resend } from 'resend';

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
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

        // Construct verification URL
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        // Send Email via Resend
        await resend.emails.send({
            from: 'Covermatt <onboarding@resend.dev>', // Depending on Resend settings, onboarding@ works for testing, or use a verified custom domain.
            to: user.email,
            subject: 'Verify your Covermatt Account',
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 40px 20px;">
                    <h2 style="color: #10b981;">Welcome to Covermatt!</h2>
                    <p style="color: #4b5563; font-size: 16px;">We're thrilled to have you. Please click the button below to instantly verify your email address.</p>
                    <a href="${verificationUrl}" style="display:inline-block; margin-top: 20px; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Verify Email
                    </a>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 40px;">If you did not request this, please safely ignore this email.</p>
                </div>
            `
        });

        return NextResponse.json({ success: true, message: 'Verification email sent' });
    } catch (error) {
        console.error('Send Email Verification Error:', error);
        return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }
}
