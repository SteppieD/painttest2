import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/init';
import { getStripe } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get customer's Stripe ID from database
    const db = getDatabase();
    const subscription = db.prepare(`
      SELECT stripe_customer_id 
      FROM contractor_subscriptions 
      WHERE company_id = ?
    `).get(companyId) as any;

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      );
    }

    // Create portal session
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}