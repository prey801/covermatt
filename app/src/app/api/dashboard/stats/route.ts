import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET() {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectToDatabase();
        const products = await Product.find({}).lean();
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

        const formattedProducts = products.map((p: any) => ({ ...p, id: p._id.toString(), _id: undefined }));
        const formattedOrders = orders.map((o: any) => ({ ...o, id: o._id.toString(), _id: undefined }));

        const totalRevenue = formattedOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0);

        const lowStockCount = formattedProducts.filter(p => p.stockLevel === 'low-stock' || p.stockLevel === 'out-of-stock').length;

        return NextResponse.json({
            totalRevenue,
            totalOrders: formattedOrders.length,
            totalProducts: formattedProducts.length,
            lowStockCount,
            recentOrders: formattedOrders.slice(0, 5),
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
