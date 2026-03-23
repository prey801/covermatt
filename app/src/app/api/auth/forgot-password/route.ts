import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/resend';
import { headers } from 'next/headers';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
    try {
        // Rate limit: 3 requests per 15 minutes per IP
        const headersList = await headers();
        const ip = getClientIp(headersList);
        const { limited, retryAfterSeconds } = rateLimit('forgot-password', ip, 3, 15 * 60 * 1000);
        if (limited) {
            return NextResponse.json(
                { error: `Too many requests. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
                { status: 429 }
            );
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Return generic OK message to prevent email enumeration
            return NextResponse.json({ message: 'If an account exists, a password reset link has been sent.' });
        }

        // Generate a cryptographically secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = tokenExpiry;
        await user.save();

        // Send email via shared utility
        await sendPasswordResetEmail(user.email, resetToken);

        return NextResponse.json({ message: 'If an account exists, a password reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
