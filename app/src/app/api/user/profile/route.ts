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

        const decoded = await verifyToken(token) as any;
        
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // It is a real user (could be customer or admin), fetch them from MongoDB securely
        await connectToDatabase();
        
        // Exclude the password using .select('-password')
        const user = decoded.role === 'admin' 
            ? await User.findOne({ email: (decoded.email as string).toLowerCase() }).select('-password')
            : await User.findById(decoded.userId).select('-password');

        if (!user) {
            // If it's the admin and not found in DB, return a mock profile
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
        let isEmailBased = false;
        let email = '';
        
        // 1. Try NextAuth
        const session = await auth();
        if (session?.user?.id) {
            userId = session.user.id;
            if ((session.user as any).role === 'admin') {
                isEmailBased = true;
                email = session.user.email!;
            }
        } else {
            // 2. Try JWT
            const cookieStore = await cookies();
            const token = cookieStore.get('auth_token')?.value;
            if (token) {
                const decoded = await verifyToken(token) as any;
                if (decoded) {
                    if (decoded.role === 'admin') {
                        isEmailBased = true;
                        email = decoded.email as string;
                    } else {
                        userId = decoded.userId;
                    }
                }
            }
        }

        if (!userId && !isEmailBased) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        let { phone, name } = body;

        // Normalize Kenyan phone numbers from 07xxx to +2547xxx
        if (phone) {
            phone = phone.trim();
            if (phone.startsWith('0')) phone = '+254' + phone.substring(1);
            else if (phone.startsWith('254')) phone = '+' + phone;
        }

        await connectToDatabase();
        
        // Find user: by ID for customers, by Email for admin (since they might not have a record yet)
        let user = userId ? await User.findById(userId) : await User.findOne({ email: email.toLowerCase() });

        // If admin doesn't exist in DB, create them now with the updated details
        if (!user && isEmailBased) {
            user = new User({
                name: name || 'Store Administrator',
                email: email.toLowerCase(),
                role: 'admin',
                isEmailVerified: true,
                isPhoneVerified: false
            });
        }

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
        const updatedUser = await User.findById(user._id).select('-password');
        
        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
