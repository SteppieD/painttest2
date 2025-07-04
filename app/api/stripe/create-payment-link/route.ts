import { NextRequest, NextResponse } from 'next/server';
import { stripe, calculatePlatformFee, convertToCents } from '@/lib/stripe/config';
import { getDatabase } from '@/lib/database/init';
import { getConnectedAccountByCompanyId } from '@/lib/stripe/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId } = body;

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

    // Check if company has connected account (optional for now)
    const connectedAccount = getConnectedAccountByCompanyId(quote.company_id);
    const hasConnectedAccount = connectedAccount && connectedAccount.charges_enabled;

    // Calculate amounts
    const amountInCents = convertToCents(quote.total_price);
    const platformFee = calculatePlatformFee(amountInCents);

    // Create a product for this quote
    const product = await stripe.products.create({
      name: `Quote #${quote.id} - ${quote.company_name}`,
      description: `Painting services for ${quote.customer_name}`,
      metadata: {
        quoteId: quoteId.toString(),
        companyId: quote.company_id.toString(),
      },
    });

    // Create a price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amountInCents,
      currency: 'usd',
    });

    // Create payment link configuration
    const paymentLinkConfig: any = {
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        quoteId: quoteId.toString(),
        companyId: quote.company_id.toString(),
        customerId: quote.customer_id.toString(),
        paymentType: hasConnectedAccount ? 'connected' : 'platform',
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/quotes/${quoteId}/payment-success`,
        },
      },
      customer_creation: 'always',
    };

    // Only add transfer data if contractor has connected account
    if (hasConnectedAccount) {
      paymentLinkConfig.application_fee_amount = platformFee;
      paymentLinkConfig.transfer_data = {
        destination: connectedAccount.stripe_account_id,
      };
    }

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create(paymentLinkConfig);

    // Save payment link to database
    const stmt = db.prepare(`
      INSERT INTO payment_links (quote_id, company_id, stripe_payment_link_id, stripe_price_id, url, active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    
    stmt.run(quoteId, quote.company_id, paymentLink.id, price.id, paymentLink.url);

    // Update quote with payment link
    db.prepare(`
      UPDATE quotes 
      SET payment_link = ? 
      WHERE id = ?
    `).run(paymentLink.url, quoteId);

    return NextResponse.json({ 
      paymentLink: paymentLink.url,
      paymentLinkId: paymentLink.id,
    });
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment link' },
      { status: 500 }
    );
  }
}