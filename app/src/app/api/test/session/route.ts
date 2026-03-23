import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { authConfig } from '@/lib/auth';

export async function GET() {
    try {
        await connectToDatabase();
        
        // Use the admin email for testing
        const email = process.env.ADMIN_EMAIL || 'musyokibrian047@gmail.com';
        let user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 1. Manually trigger the JWT callback
        const jwtCallback = authConfig.callbacks!.jwt!;
        const mockToken = { email: user.email };
        const enrichedToken = await (jwtCallback as any)({ token: mockToken });

        // 2. Manually trigger the Session callback
        const sessionCallback = authConfig.callbacks!.session!;
        const mockSession = { user: { email: user.email } };
        const enrichedSession = await (sessionCallback as any)({ session: mockSession, token: enrichedToken });

        return NextResponse.json({
            success: true,
            userInDb: {
                email: user.email,
                phone: user.phone,
                addresses: user.addresses
            },
            enrichedSession
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
