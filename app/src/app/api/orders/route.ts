import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

export async function GET() {
    const orders = readData('orders.json');
    return NextResponse.json(orders);
}

export async function POST(req: Request) {
    try {
        const orderData = await req.json();
        const orders = readData<any>('orders.json');
        
        // Ensure id is unique
        if (orders.some((o: any) => o.id === orderData.id)) {
            orderData.id = `${orderData.id}-${Math.floor(Math.random() * 1000)}`;
        }
        
        orders.unshift(orderData); // Add to the top
        writeData('orders.json', orders);
        
        return NextResponse.json({ success: true, order: orderData });
    } catch (error: any) {
        console.error('Failed to save order:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
