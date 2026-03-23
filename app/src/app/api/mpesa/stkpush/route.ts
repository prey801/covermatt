import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const ip = getClientIp(headersList);
        
        // Rate limit: 5 requests per hour (60 min) per IP
        const { limited, retryAfterSeconds } = rateLimit('mpesa-stk', ip, 5, 60 * 60 * 1000);
        if (limited) {
            return NextResponse.json(
                { success: false, error: `Too many payment requests. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.` },
                { status: 429 }
            );
        }

        const { phone, amount, reference } = await req.json();

        if (!phone || !amount) {
            return NextResponse.json({ success: false, error: 'Phone and amount are required' }, { status: 400 });
        }

        // 1. Get OAuth Token
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
        const url = environment === 'sandbox' 
            ? 'https://sandbox.safaricom.co.ke' 
            : 'https://api.safaricom.co.ke';
        
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const tokenResponse = await fetch(`${url}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: { 
                Authorization: `Basic ${auth}`
            },
            cache: 'no-store'
        });
        
        if (!tokenResponse.ok) {
            const err = await tokenResponse.text();
            console.error('Token fetch failed:', err);
            throw new Error('Failed to authenticate with M-Pesa');
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        if (!token) throw new Error('Failed to get access token');

        // 2. STK Push
        const shortcode = process.env.MPESA_SHORTCODE || '174379';
        const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
        
        // Generate timestamp YYYYMMDDHHmmss
        const date = new Date();
        const timestamp = date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        
        // Format phone number to 254XXXXXXXXX
        let formattedPhone = phone.replace(/\s+/g, '').replace('+', '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        }

        const stkPayload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.ceil(amount),
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://covermatt.co.ke'}/api/mpesa/callback`,
            AccountReference: reference || 'Covermatt Order',
            TransactionDesc: 'Payment for Order'
        };

        const stkResponse = await fetch(`${url}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stkPayload)
        });

        const stkData = await stkResponse.json();
        
        if (stkData.ResponseCode !== '0') {
            console.error('STK Push Error:', stkData);
            return NextResponse.json({ success: false, error: stkData.errorMessage || stkData.ResponseDescription || 'Failed to initiate payment' }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: stkData });
    } catch (error: any) {
        console.error('M-PESA Error:', error);
        return NextResponse.json({ success: false, error: 'Payment initiation failed. Please try again.' }, { status: 500 });
    }
}
