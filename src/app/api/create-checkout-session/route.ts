import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51S511OJX1lXBUH9q4uBSEAanOT2PeN3UntVSyMLlP0pKJo3R7y3IhlLQJoX6rSQyZdiPmT34DFsBqCjH60g8XgC800AGBPDQNm", {
    apiVersion: '2025-10-29.clover', // Add API version
});

export async function POST(request: NextRequest) {
    try {
        const {
            amount,
            currency,
            planName,
            planId,
            customerEmail,
            successUrl,
            cancelUrl,
            credits,
            productType = 'subscription' // 'subscription' or 'credits'
        } = await request.json();

        console.log('Creating checkout session for:', {
            amount,
            currency,
            planName,
            planId,
            customerEmail,
            credits,
            productType
        });

        // Validate required fields
        if (!customerEmail) {
            return NextResponse.json(
                { error: 'Customer email is required' },
                { status: 400 }
            );
        }

        if (!amount) {
            return NextResponse.json(
                { error: 'Amount is required' },
                { status: 400 }
            );
        }

        if (productType === 'subscription' && !planId) {
            return NextResponse.json(
                { error: 'Plan ID is required for subscriptions' },
                { status: 400 }
            );
        }

        if (productType === 'credits' && !credits) {
            return NextResponse.json(
                { error: 'Credits amount is required for credit purchases' },
                { status: 400 }
            );
        }

        // Determine product details based on type
        let productName, productDescription, mode, successUrlFinal, cancelUrlFinal;

        const baseUrl = request.headers.get('origin') || 'http://localhost:3000';

        if (productType === 'credits') {
            productName = `${credits} Verification Credits`;
            productDescription = `Purchase of ${credits} verification credits for vendor scanning`;
            mode = 'payment'; // One-time payment for credits
            successUrlFinal = successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&credits=${credits}&type=credits`;
            cancelUrlFinal = cancelUrl || `${baseUrl}/subscribe/dashboard?canceled=true`;
        } else {
            productName = `${planName} Plan`;
            productDescription = `Subscription to ${planName} plan`;
            mode = 'subscription';
            successUrlFinal = successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}&type=subscription`;
            cancelUrlFinal = cancelUrl || `${baseUrl}/pricing?canceled=true`;
        }

        // Create price data with proper TypeScript structure
        const priceData: any = {
            currency: currency || 'usd',
            product_data: {
                name: productName,
                description: productDescription,
            },
            unit_amount: Math.round(amount), // Convert to cents
        };

        // Add recurring data for subscriptions
        if (mode === 'subscription') {
            priceData.recurring = {
                interval: 'month',
            };
        }

        // Create metadata based on product type
        const metadata: Record<string, string> = productType === 'credits' ? {
            product_type: 'credits',
            credits: credits.toString(),
            plan_name: 'credits_purchase'
        } : {
            product_type: 'subscription',
            planId: planId,
            plan_name: planName || 'Unknown Plan'
        };

        // Create checkout session with proper typing
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: priceData,
                    quantity: 1,
                },
            ],
            mode: mode as 'payment' | 'subscription',
            customer_email: customerEmail,
            success_url: successUrlFinal,
            cancel_url: cancelUrlFinal,
            metadata: metadata,
            ...(mode === 'subscription' && {
                subscription_data: {
                    metadata: {
                        planId: planId!,
                        plan_name: planName || 'Unknown Plan'
                    }
                }
            })
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        console.log(`Stripe ${productType} checkout session created:`, session.id);

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
            productType: productType
        });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}