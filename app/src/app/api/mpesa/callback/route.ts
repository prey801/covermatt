import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        console.log('M-Pesa Callback Data:', JSON.stringify(body, null, 2));

        const result = body?.Body?.stkCallback;
        if (!result) {
            return NextResponse.json({ "ResultCode": 1, "ResultDesc": "Invalid payload" });
        }

        if (result.ResultCode === 0) {
            // Success
            console.log(`Payment successful for MerchantRequestID: ${result.MerchantRequestID}`);
            // TODO: Update order status to paid in database
        } else {
            // Failed
            console.log(`Payment failed for MerchantRequestID: ${result.MerchantRequestID}. Reason: ${result.ResultDesc}`);
            // TODO: Update order status to failed in database
        }

        return NextResponse.json({ "ResultCode": 0, "ResultDesc": "Accepted" });
    } catch (error) {
        console.error('Callback parsing error:', error);
        return NextResponse.json({ "ResultCode": 1, "ResultDesc": "Server Error" });
    }
}
