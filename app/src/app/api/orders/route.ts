import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export interface OrderType {
    id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    address: string;
    items: any[];
    total: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
}

export async function GET() {
    try {
        await connectToDatabase();
        
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        let query = {};
        
        if (token) {
            const decoded = await verifyToken(token);
            if (decoded && decoded.role !== 'admin') {
                // Customer viewing their own orders
                query = { 'userId': decoded.userId };
            }
            // If admin, query remains {} (fetch all)
        } else {
             // If not logged in at all, return nothing for security
             // Optional: You could rely on email alone for guest tracking, but tying it to an account is safer.
             return NextResponse.json([]);
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        
        // Map _id to id for backwards frontend compatibility
        const mappedOrders = orders.map(o => ({
            ...o.toObject(),
            id: o._id.toString()
        }));
        
        return NextResponse.json(mappedOrders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const orderData = await req.json();
        
        // Check if user is logged in to link the order to their account
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        let userId = undefined;
        if (token) {
            const decoded = await verifyToken(token);
            if (decoded && decoded.role === 'customer') {
                userId = decoded.userId;
            }
        }
        
        // Create MongoDB Order
        const newOrder = await Order.create({
            ...orderData,
            userId, // Links order to customer account if present
            status: orderData.status || 'pending',
            paymentStatus: orderData.paymentStatus || 'pending'
        });
        
        return NextResponse.json({ 
            success: true, 
            order: {
                ...newOrder.toObject(),
                id: newOrder._id.toString()
            }
        });
    } catch (error: any) {
        console.error('Failed to save order:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }
}
