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

        // Create a PaymentIntent with the order amount and currency
        // Stripe requires the amount in the smallest currency unit (e.g., cents)
        // KES is treated as a 2-decimal currency by Stripe (1 KES = 100 cents)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
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
            { error: error.message || 'Failed to create PaymentIntent' },
            { status: 500 }
        );
    }
}
