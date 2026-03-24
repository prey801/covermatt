import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import connectToDatabase from './mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from './resend';
import { cookies } from 'next/headers';

export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
            Facebook({
                clientId: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            }),
        ] : []),
    ],

    session: { strategy: 'jwt' as const },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        // Runs after Google successfully authenticates the user
        async signIn({ user, account, profile }) {
            console.log('🔑 signIn callback started', { provider: account?.provider, email: user.email });
            if (account?.provider !== 'google' && account?.provider !== 'facebook') return true;

            try {
                await connectToDatabase();

                const email = user.email!.toLowerCase();
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    // Link Google account if not already linked
                    if (account?.provider === 'google' && !existingUser.googleId) {
                        existingUser.googleId = account.providerAccountId;
                        existingUser.isEmailVerified = true;
                        await existingUser.save();
                    } else if (account?.provider === 'facebook' && !existingUser.facebookId) {
                        existingUser.facebookId = account.providerAccountId;
                        existingUser.isEmailVerified = true;
                        await existingUser.save();
                    }
                } else {
                    // Create new user from OAuth profile
                    const newUser = await User.create({
                        name: user.name ?? email.split('@')[0],
                        email,
                        googleId: account?.provider === 'google' ? account.providerAccountId : undefined,
                        facebookId: account?.provider === 'facebook' ? account.providerAccountId : undefined,
                        role: 'customer',
                        isEmailVerified: true, // OAuth already verified the email
                    });

                    // Send welcome email (fire-and-forget)
                    sendWelcomeEmail(newUser.email, newUser.name).catch(err =>
                        console.error('Google welcome email failed:', err)
                    );
                }

                console.log('✅ signIn callback successful');
                return true;
            } catch (err: any) {
                console.error('❌ NextAuth signIn callback error:', {
                    provider: account?.provider,
                    email: user.email,
                    error: err.message,
                    stack: err.stack
                });
                return false;
            }
        },

        // Enrich the JWT token with our DB user ID and role
        async jwt({ token, user: nextAuthUser, account }) {
            console.log('🎫 jwt callback started', { hasUser: !!nextAuthUser, email: token.email });
            // 1. If it's the first time signing in (nextAuthUser is present)
            if (nextAuthUser && nextAuthUser.email) {
                try {
                    await connectToDatabase();
                    const dbUser = await User.findOne({ email: nextAuthUser.email.toLowerCase() });
                    if (dbUser) {
                        token.userId = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.name = dbUser.name;
                        token.phone = dbUser.phone;
                        token.addresses = dbUser.addresses;
                    }
                } catch (err) {
                    console.error('JWT initial sign-in error:', err);
                }
            }

            // 2. Fallback for subsequent renders/refreshes if session is lost but token exists
            if (!token.userId && token.email) {
                try {
                    await connectToDatabase();
                    const dbUser = await User.findOne({ email: token.email.toLowerCase() });
                    if (dbUser) {
                        token.userId = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.name = dbUser.name;
                        token.phone = dbUser.phone;
                        token.addresses = dbUser.addresses;
                    }
                } catch { /* non-fatal */ }
            }
            console.log('🎫 jwt callback finished', { userId: token.userId });
            return token;
        },

        // Expose userId and role to the session object used by the client
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.userId as string;
                (session.user as any).role = token.role as string;
                (session.user as any).phone = token.phone as string;
                (session.user as any).addresses = token.addresses;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
