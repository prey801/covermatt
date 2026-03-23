import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import africastalking from 'africastalking';
import crypto from 'crypto';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
    const AT = africastalking({
        apiKey: process.env.AT_API_KEY || 'sandbox',
        username: process.env.AT_USERNAME || 'sandbox'
    });
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        const decoded = await verifyToken(token);
        if (!decoded || decoded.role === 'admin') return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (user.isPhoneVerified) return NextResponse.json({ message: 'Phone already verified' });
        if (!user.phone) return NextResponse.json({ error: 'No phone number associated with account' }, { status: 400 });

        // Rate limit: 3 OTP sends per 15 minutes per user
        const userId = user._id.toString();
        const { limited, retryAfterSeconds } = rateLimit('otp-send', userId, 3, 15 * 60 * 1000);
        if (limited) {
            return NextResponse.json(
                { error: `Too many OTP requests. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
                { status: 429 }
            );
        }

        // Check if an active OTP exists and hasn't expired — reject to prevent flooding
        if (user.otpExpiry && new Date() < user.otpExpiry && user.phoneOtp) {
            return NextResponse.json({ success: true, message: 'OTP was already sent. Please check your phone or wait for it to expire.' });
        }

        // Generate cryptographically secure 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.phoneOtp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minute expiry
        user.otpAttempts = 0; // Reset attempts for new OTP
        user.otpLockedUntil = undefined; // Clear any lockout
        await user.save();

        // Format Kenyan Phone Number for Africa's Talking (e.g., from 0700 to +254700)
        let formattedPhone = user.phone.trim();
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '+254' + formattedPhone.substring(1);
        }

        // Send SMS via Africa's Talking
        await AT.SMS.send({
            to: [formattedPhone],
            message: `Your Covermatt verification code is: ${otp}. Do not share this code with anyone. It expires in 10 minutes.`
        });

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        return NextResponse.json({ error: 'Failed to send OTP message' }, { status: 500 });
    }
}
