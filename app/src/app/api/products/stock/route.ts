import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAdminAuthenticated } from '@/lib/adminAuth';

/**
 * PATCH /api/products/stock
 * Bulk-update the stockLevel of multiple products.
 * Body: { ids: string[], stockLevel: 'in-stock' | 'low-stock' | 'out-of-stock' }
 */
export async function PATCH(request: Request) {
    try {
        const authed = await isAdminAuthenticated();
        if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { ids, stockLevel } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 });
        }

        const VALID_LEVELS = ['in-stock', 'low-stock', 'out-of-stock'];
        if (!VALID_LEVELS.includes(stockLevel)) {
            return NextResponse.json({ error: `stockLevel must be one of: ${VALID_LEVELS.join(', ')}` }, { status: 400 });
        }

        await connectToDatabase();
        const result = await Product.updateMany(
            { _id: { $in: ids } },
            { $set: { stockLevel } }
        );

        return NextResponse.json({
            success: true,
            modifiedCount: result.modifiedCount,
        });
    } catch (error: any) {
        console.error('Bulk stock update failed:', error);
        return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }
}
