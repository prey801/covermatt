import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { Order } from '../route';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();
    const orders = readData<Order>('orders.json');
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    orders[index].status = status;
    writeData('orders.json', orders);
    return NextResponse.json(orders[index]);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const orders = readData<Order>('orders.json');
    const order = orders.find(o => o.id === id);
    
    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Mask sensitive PII for public tracking
    const trackingData = {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        address: order.address,
        total: order.total,
        items: order.items,
    };

    return NextResponse.json(trackingData);
}
