import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }
    
    try {
        await connectToDatabase();
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
        if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ ...order, id: (order as any)._id.toString() });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid ID or Not Found' }, { status: 404 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    try {
        await connectToDatabase();
        const order = await Order.findById(id).lean() as any;
        
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Mask sensitive PII for public tracking — don't expose address
        const trackingData = {
            id: order._id.toString(),
            status: order.status,
            createdAt: order.createdAt,
            total: order.total,
            items: order.items.map((item: any) => ({
                name: item.name,
                qty: item.qty,
                price: item.price,
            })),
        };

        return NextResponse.json(trackingData);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid ID or Not Found' }, { status: 404 });
    }
}
