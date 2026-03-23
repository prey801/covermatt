import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(request: Request) {
    try {
        const { otp } = await request.json();
        if (!otp) return NextResponse.json({ error: 'OTP is required' }, { status: 400 });

        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        const decoded = await verifyToken(token);
        if (!decoded || decoded.role === 'admin') return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Check if OTP matches and is not expired
        if (!user.phoneOtp || !user.otpExpiry) {
            return NextResponse.json({ error: 'No OTP requested' }, { status: 400 });
        }

        // Check lockout
        if (user.otpLockedUntil && new Date() < user.otpLockedUntil) {
            const minutesLeft = Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 60000);
            return NextResponse.json(
                { error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` },
                { status: 429 }
            );
        }

        if (new Date() > user.otpExpiry) {
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        if (user.phoneOtp !== otp.toString()) {
            // Track failed attempt
            user.otpAttempts = (user.otpAttempts || 0) + 1;

            if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
                // Lock user out and clear OTP
                user.otpLockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
                user.phoneOtp = undefined;
                user.otpExpiry = undefined;
                user.otpAttempts = 0;
                await user.save();
                return NextResponse.json(
                    { error: 'Too many failed attempts. Your OTP has been invalidated. Please request a new one in 30 minutes.' },
                    { status: 429 }
                );
            }

            await user.save();
            const attemptsLeft = MAX_OTP_ATTEMPTS - user.otpAttempts;
            return NextResponse.json(
                { error: `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.` },
                { status: 400 }
            );
        }

        // Success
        user.isPhoneVerified = true;
        user.phoneOtp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
        user.otpLockedUntil = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: 'Phone verified successfully' });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}
