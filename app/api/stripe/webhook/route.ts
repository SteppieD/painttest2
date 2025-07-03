import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { 
  createOrUpdateSubscription,
  updatePaymentStatus,
  recordWebhookEvent,
  wasWebhookEventProcessed,
  createInvoice,
} from '@/lib/stripe/database';
import { getDatabase } from '@/lib/database/init';
import type { Stripe } from 'stripe';

export const dynamic = 'force-dynamic';

// Disable body parsing, we need the raw body for webhook signature verification
export const runtime = 'nodejs';

async function buffer(readable: ReadableStream<Uint8Array>) {
  const chunks = [];
  const reader = readable.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await buffer(request.body!);
    const signature = headers().get('stripe-signature')!;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhookSecrets.account
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Check if event was already processed (idempotency)
    if (wasWebhookEventProcessed(event.id)) {
      return NextResponse.json({ received: true, skipped: true });
    }

    // Record event
    await recordWebhookEvent(event.id, event.type, event.data);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription' && session.subscription) {
          // Handle subscription creation
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          const companyId = parseInt(session.metadata?.companyId || '0');
          if (companyId) {
            await createOrUpdateSubscription(
              companyId,
              session.customer as string,
              subscription
            );
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const companyId = parseInt(subscription.metadata?.companyId || '0');
        
        if (companyId) {
          await createOrUpdateSubscription(
            companyId,
            subscription.customer as string,
            subscription
          );
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await updatePaymentStatus(
          paymentIntent.id,
          'succeeded',
          new Date()
        );
        
        // Update quote payment status
        const quoteId = paymentIntent.metadata?.quoteId;
        if (quoteId) {
          const db = getDatabase();
          db.prepare(`
            UPDATE quotes 
            SET payment_status = 'paid' 
            WHERE id = ?
          `).run(quoteId);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await updatePaymentStatus(
          paymentIntent.id,
          'failed'
        );
        break;
      }

      case 'invoice.created':
      case 'invoice.updated': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Extract metadata to link invoice to quote
        const quoteId = parseInt(invoice.metadata?.quoteId || '0');
        const companyId = parseInt(invoice.metadata?.companyId || '0');
        const customerId = parseInt(invoice.metadata?.customerId || '0');
        
        if (quoteId && companyId && customerId) {
          await createInvoice(quoteId, companyId, customerId, invoice);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const db = getDatabase();
        
        // Update invoice status
        db.prepare(`
          UPDATE invoices 
          SET status = 'paid', paid_at = ?, amount_paid = ?
          WHERE stripe_invoice_id = ?
        `).run(
          new Date().toISOString(),
          invoice.amount_paid,
          invoice.id
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await recordWebhookEvent(event.id, event.type, event.data, true);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // Record error for debugging
    if (error.id) {
      await recordWebhookEvent(
        error.id,
        error.type || 'unknown',
        error.data || {},
        false,
        error.message
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}