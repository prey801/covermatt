import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        console.log('M-Pesa Callback Data:', JSON.stringify(body, null, 2));

        const result = body?.Body?.stkCallback;
        if (!result) {
            return NextResponse.json({ "ResultCode": 1, "ResultDesc": "Invalid payload" });
        }

        const checkoutRequestId: string = result.CheckoutRequestID;

        await connectToDatabase();

        if (result.ResultCode === 0) {
            // Payment succeeded — update the order linked to this CheckoutRequestID
            await Order.findOneAndUpdate(
                { transactionId: checkoutRequestId },
                { paymentStatus: 'paid', status: 'processing' }
            );
            console.log(`Payment successful: ${checkoutRequestId}`);
        } else {
            // Payment failed — mark order as failed
            await Order.findOneAndUpdate(
                { transactionId: checkoutRequestId },
                { paymentStatus: 'failed' }
            );
            console.log(`Payment failed: ${checkoutRequestId} — ${result.ResultDesc}`);
        }

        return NextResponse.json({ "ResultCode": 0, "ResultDesc": "Accepted" });
    } catch (error) {
        console.error('Callback parsing error:', error);
        return NextResponse.json({ "ResultCode": 1, "ResultDesc": "Server Error" });
    }
}

