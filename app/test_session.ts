import connectToDatabase from './src/lib/mongodb';
import User from './src/models/User';
import { handlers } from './src/lib/auth';

async function test() {
    await connectToDatabase();
    
    // Find a user or create a mock one
    let user = await User.findOne({ email: 'musyokibrian047@gmail.com' });
    if (!user) {
        console.log("User not found, creating mock...");
        user = await User.create({
            name: 'Test User',
            email: 'musyokibrian047@gmail.com',
            phone: '0712345678',
            addresses: [{
                street: '123 Test St',
                city: 'Nairobi',
                isDefault: true
            }],
            role: 'customer'
        });
    } else {
        // Ensure they have a phone and address for testing
        user.phone = '0712345678';
        user.addresses = [{
            street: '123 Test St',
            city: 'Nairobi',
            isDefault: true
        }];
        await user.save();
    }

    console.log("Testing JWT callback...");
    const jwtCallback = (handlers as any).callbacks.jwt;
    const mockToken = { email: user.email };
    const enrichedToken = await jwtCallback({ token: mockToken });
    console.log("Enriched Token:", JSON.stringify(enrichedToken, null, 2));

    console.log("\nTesting Session callback...");
    const sessionCallback = (handlers as any).callbacks.session;
    const mockSession = { user: { email: user.email } };
    const enrichedSession = await sessionCallback({ session: mockSession, token: enrichedToken });
    console.log("Enriched Session:", JSON.stringify(enrichedSession, null, 2));

    process.exit(0);
}

test().catch(err => {
    console.error(err);
    process.exit(1);
});
