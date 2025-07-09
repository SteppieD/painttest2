import { NextRequest, NextResponse } from 'next/server';
import { stripe, calculatePlatformFee, convertToCents } from '@/lib/stripe/config';
import { getDatabase } from '@/lib/database/init';
import { getConnectedAccountByCompanyId, createPayment, updateCustomerStripeCustomerId } from '@/lib/stripe/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, customerEmail, customerName } = body;

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Get quote details
    const db = getDatabase();
    const quote = db.prepare(`
      SELECT q.*, c.id as customer_id, c.name as customer_name, c.email as customer_email,
             comp.id as company_id, comp.name as company_name, comp.stripe_account_id
      FROM quotes q
      JOIN customers c ON q.customer_id = c.id
      JOIN companies comp ON q.company_id = comp.id
      WHERE q.id = ?
    `).get(quoteId) as any;
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Check if company has connected account
    const connectedAccount = getConnectedAccountByCompanyId(quote.company_id);
    if (!connectedAccount || !(connectedAccount as any).charges_enabled) {
      return NextResponse.json(
        { error: 'Contractor has not set up payment processing yet' },
        { status: 400 }
      );
    }

    // Calculate amounts
    const amountInCents = convertToCents(quote.total_price);
    const platformFee = calculatePlatformFee(amountInCents);

    // Get or create customer
    let stripeCustomerId = quote.stripe_customer_id;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: customerEmail || quote.customer_email,
        name: customerName || quote.customer_name,
        metadata: {
          customerId: quote.customer_id.toString(),
          companyId: quote.company_id.toString(),
        },
      });
      
      stripeCustomerId = customer.id;
      updateCustomerStripeCustomerId(quote.customer_id, stripeCustomerId);
    }

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: stripeCustomerId,
      receipt_email: customerEmail || quote.customer_email,
      metadata: {
        quoteId: quoteId.toString(),
        companyId: quote.company_id.toString(),
        customerId: quote.customer_id.toString(),
      },
      application_fee_amount: platformFee,
      transfer_data: {
        destination: (connectedAccount as any).stripe_account_id,
      },
      description: `Payment for Quote #${quote.id} - ${quote.company_name}`,
    });

    // Create payment record
    await createPayment(
      quoteId,
      quote.company_id,
      paymentIntent,
      platformFee
    );

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      platformFee,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}