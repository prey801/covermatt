import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { sendOrderConfirmationEmail, sendAdminNewOrderAlert } from '@/lib/resend';
import { sendOrderSMS } from '@/lib/sms';
import { auth } from '@/lib/auth';

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
        
        let query: any = {};
        let authenticated = false;
        
        if (token) {
            const decoded = await verifyToken(token);
            if (decoded) {
                authenticated = true;
                if (decoded.role === 'admin') {
                    query = {}; // admin sees all orders
                } else {
                    // Customer viewing their own orders
                    query = { userId: decoded.userId };
                }
            }
        }
        
        // Fallback: check NextAuth session (Google OAuth users)
        if (!authenticated) {
            const session = await auth();
            if (session?.user) {
                const sessionUser = session.user as any;
                if (sessionUser.role === 'admin') {
                    query = {};
                } else if (sessionUser.id) {
                    query = { userId: sessionUser.id };
                } else {
                    return NextResponse.json([]);
                }
            } else {
                // No auth at all — return nothing for security
                return NextResponse.json([]);
            }
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

        const orderId = newOrder._id.toString();
        const emailPayload = {
            id: orderId,
            customer: newOrder.customer,
            address: newOrder.address,
            items: newOrder.items,
            total: newOrder.total,
            paymentMethod: newOrder.paymentMethod,
        };

        // Send order confirmation to customer (fire-and-forget)
        if (newOrder.customer?.email) {
            sendOrderConfirmationEmail(newOrder.customer.email, emailPayload).catch(err =>
                console.error('Order confirmation email failed:', err)
            );
        }

        // Send SMS to customer's phone with order ID and total (fire-and-forget)
        if (newOrder.customer?.phone) {
            sendOrderSMS(newOrder.customer.phone, orderId, newOrder.total).catch(err =>
                console.error('Order SMS failed:', err)
            );
        }

        // Send new-order alert to admin (fire-and-forget)
        const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
        if (adminEmail && adminEmail !== 'Admin') {
            sendAdminNewOrderAlert(adminEmail, emailPayload).catch(err =>
                console.error('Admin order alert email failed:', err)
            );
        }
        
        return NextResponse.json({ 
            success: true, 
            order: {
                ...newOrder.toObject(),
                id: orderId
            }
        });
    } catch (error: any) {
        console.error('Failed to save order:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }
}

