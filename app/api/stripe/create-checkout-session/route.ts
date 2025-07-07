import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { getDatabase } from '@/lib/database/init';
import { updateCompanyStripeCustomerId } from '@/lib/stripe/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, planType, priceId, successUrl, cancelUrl } = body;

    if (!companyId || !planType) {
      return NextResponse.json(
        { error: 'Company ID and plan type are required' },
        { status: 400 }
      );
    }

    // Get company details
    const db = getDatabase();
    const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(companyId) as any;
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    let stripeCustomerId = company.stripe_customer_id;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: company.name,
        metadata: {
          companyId: companyId.toString(),
        },
      });
      
      stripeCustomerId = customer.id;
      updateCompanyStripeCustomerId(companyId, stripeCustomerId);
    }

    // Use provided price ID or fall back to config
    const finalPriceId = priceId || (planType === 'yearly' 
      ? STRIPE_CONFIG.prices.yearlySubscription 
      : STRIPE_CONFIG.prices.monthlySubscription);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      metadata: {
        companyId: companyId.toString(),
        planType,
      },
      subscription_data: {
        metadata: {
          companyId: companyId.toString(),
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id 
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}