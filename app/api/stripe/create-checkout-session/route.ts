import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICE_IDS, isStripeConfigured } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
      { status: 500 }
    )
  }

  try {
    const { priceId, customerId, successUrl, cancelUrl } = await req.json()

    // Validate priceId
    const validPriceIds = Object.values(PRICE_IDS)
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: successUrl || `${req.nextUrl.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/pricing`,
      metadata: {
        priceId,
      },
      subscription_data: {
        metadata: {
          plan: priceId.includes('professional') ? 'professional' : 'business',
        },
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}