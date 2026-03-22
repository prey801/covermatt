import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16' as any, // Using stable API version
    });
    try {
        const { amount } = await request.json();

        // Validate amount
        if (!amount || typeof amount !== 'number' || amount < 100) {
            return NextResponse.json({ error: 'Invalid amount. Minimum is KSh 100.' }, { status: 400 });
        }

        if (amount > 500000) {
            return NextResponse.json({ error: 'Amount exceeds maximum allowed.' }, { status: 400 });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'kes',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: 'Payment processing failed. Please try again.' },
            { status: 500 }
        );
    }
}

