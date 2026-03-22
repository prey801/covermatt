import mongoose from 'mongoose';
import path from 'path';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_URI_FALLBACK = process.env.MONGODB_URI_FALLBACK;

    if (!MONGODB_URI && !MONGODB_URI_FALLBACK) {
        throw new Error('Please define MONGODB_URI or MONGODB_URI_FALLBACK in .env.local');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = (async () => {
            // ── Attempt 1: X.509 certificate auth ──
            if (MONGODB_URI) {
                try {
                    const certPath = process.env.MONGODB_X509_CERT_PATH
                        || path.resolve(process.cwd(), 'X509-cert-1795631679681400780.pem');

                    const x509Opts: mongoose.ConnectOptions = {
                        bufferCommands: false,
                        tls: true,
                        tlsCertificateKeyFile: certPath,
                        authMechanism: 'MONGODB-X509',
                        authSource: '$external',
                        serverSelectionTimeoutMS: 10000,
                    };

                    const conn = await mongoose.connect(MONGODB_URI, x509Opts);
                    console.log('✅ Connected to MongoDB with X.509 certificate');
                    return conn;
                } catch (err: any) {
                    console.warn('⚠️  X.509 connection failed:', err.message);
                    if (!MONGODB_URI_FALLBACK) throw err;
                    console.log('🔄 Trying fallback (password auth)...');
                }
            }

            // ── Attempt 2: Password-based fallback ──
            if (MONGODB_URI_FALLBACK) {
                const fallbackOpts: mongoose.ConnectOptions = {
                    bufferCommands: false,
                };

                const conn = await mongoose.connect(MONGODB_URI_FALLBACK, fallbackOpts);
                console.log('✅ Connected to MongoDB with password auth (fallback)');
                return conn;
            }

            throw new Error('All MongoDB connection attempts failed');
        })();
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;

