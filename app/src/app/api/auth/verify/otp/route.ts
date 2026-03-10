import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

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

        if (new Date() > user.otpExpiry) {
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        if (user.phoneOtp !== otp.toString()) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Success
        user.isPhoneVerified = true;
        user.phoneOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: 'Phone verified successfully' });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}
