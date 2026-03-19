import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import connectToDatabase from './mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from './resend';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: { strategy: 'jwt' },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        // Runs after Google successfully authenticates the user
        async signIn({ user, account }) {
            if (account?.provider !== 'google') return true;

            try {
                await connectToDatabase();

                const email = user.email!.toLowerCase();
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    // Link Google account if not already linked
                    if (!existingUser.googleId) {
                        existingUser.googleId = account.providerAccountId;
                        existingUser.isEmailVerified = true;
                        await existingUser.save();
                    }
                } else {
                    // Create new user from Google profile
                    const newUser = await User.create({
                        name: user.name ?? email.split('@')[0],
                        email,
                        googleId: account.providerAccountId,
                        role: 'customer',
                        isEmailVerified: true, // Google already verified the email
                    });

                    // Send welcome email (fire-and-forget)
                    sendWelcomeEmail(newUser.email, newUser.name).catch(err =>
                        console.error('Google welcome email failed:', err)
                    );
                }

                return true;
            } catch (err) {
                console.error('NextAuth signIn callback error:', err);
                return false;
            }
        },

        // Enrich the JWT token with our DB user ID and role
        async jwt({ token, account }) {
            // Always ensure userId is in the token — runs on first sign-in AND every refresh
            if (!token.userId && token.email) {
                try {
                    await connectToDatabase();
                    const dbUser = await User.findOne({ email: token.email.toLowerCase() });
                    if (dbUser) {
                        token.userId = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.name = dbUser.name;
                    }
                } catch { /* non-fatal */ }
            }
            return token;
        },

        // Expose userId and role to the session object used by the client
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.userId as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },
});
