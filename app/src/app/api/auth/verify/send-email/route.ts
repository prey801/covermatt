import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/resend';
import { rateLimit } from '@/lib/rateLimit';

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

        // Rate limit: 3 email verification sends per 15 minutes per user
        const userId = user._id.toString();
        const { limited, retryAfterSeconds } = rateLimit('email-verify-send', userId, 3, 15 * 60 * 1000);
        if (limited) {
            return NextResponse.json(
                { error: `Too many requests. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
                { status: 429 }
            );
        }

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
