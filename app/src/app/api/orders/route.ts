import { NextResponse } from 'next/server';
import { readData } from '@/lib/dataStore';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export interface OrderItem {
    productId: string;
    name: string;
    qty: number;
    price: number;
}

export interface Order {
    id: string;
    customer: { name: string; email: string; phone: string };
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    address: string;
}

export async function GET() {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orders = readData<Order>('orders.json');
    return NextResponse.json(orders);
}
