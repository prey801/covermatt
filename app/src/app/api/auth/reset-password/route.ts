import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        await connectToDatabase();

        // Find user by token and ensure it's not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password, clear reset fields, and increment tokenVersion
        // This invalidates all previously issued JWTs for this user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        return NextResponse.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
