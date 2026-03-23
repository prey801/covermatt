import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        // 1. Try NextAuth Session (Google Login)
        const session = await auth();
        if (session?.user?.email) {
            await connectToDatabase();
            const user = await User.findOne({ email: session.user.email.toLowerCase() }).select('-password').lean();
            if (user) {
                return NextResponse.json({ user: { ...user, id: user._id?.toString() } });
            }
        }

        // 2. Fallback to Custom JWT (Email Login)
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // If it's the admin, return a mock profile since they don't exist in MongoDB
        if (decoded.role === 'admin') {
            return NextResponse.json({
                user: {
                    id: 'admin-001',
                    name: 'Store Administrator',
                    email: decoded.email,
                    role: 'admin',
                    phone: '',
                    addresses: [],
                    isEmailVerified: true,
                    isPhoneVerified: true
                }
            });
        }

        // It is a real customer, fetch them from MongoDB securely
        await connectToDatabase();
        
        // Exclude the password using .select('-password')
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });

    } catch (error: any) {
        console.error('Profile Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        // Authenticate user
        let userId = null;
        
        // 1. Try NextAuth
        const session = await auth();
        if (session?.user?.id) {
            userId = session.user.id;
        } else {
            // 2. Try JWT
            const cookieStore = await cookies();
            const token = cookieStore.get('auth_token')?.value;
            if (token) {
                const decoded = await verifyToken(token);
                if (decoded && decoded.role !== 'admin') {
                    userId = decoded.userId;
                }
            }
        }

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { phone, name } = body;

        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let updated = false;

        if (phone && phone !== user.phone) {
            user.phone = phone;
            user.isPhoneVerified = false; // Require re-verification if changed
            user.phoneOtp = undefined;
            user.otpExpiry = undefined;
            updated = true;
        }

        if (name && name !== user.name) {
            user.name = name;
            updated = true;
        }

        if (updated) {
            await user.save();
        }

        // Return user without password
        const updatedUser = await User.findById(userId).select('-password');
        
        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
