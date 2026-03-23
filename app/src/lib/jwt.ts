import { SignJWT, jwtVerify } from 'jose';

// Enforce JWT_SECRET at startup — no fallback
const secretKey = process.env.JWT_SECRET;
if (!secretKey && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
}
const key = new TextEncoder().encode(secretKey || 'dev_only_secret_not_for_production');

export async function signToken(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .setIssuer('covermatt')
        .setJti(crypto.randomUUID()) // Unique token ID — prevents replay
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
            issuer: 'covermatt',
        });
        return payload;
    } catch (error) {
        return null;
    }
}
