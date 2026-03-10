import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
        }

        // Mark as verified and clear the token
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email Verification Match Error:', error);
        return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
    }
}
