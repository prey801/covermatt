import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return false;

    const payload = await verifyToken(token);
    return payload?.role === 'admin';
}
