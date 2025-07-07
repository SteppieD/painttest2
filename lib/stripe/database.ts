import { getDatabase } from '@/lib/database/init';
import { stripe } from './config';
import type { Stripe } from 'stripe';

// Subscription Management
export async function createOrUpdateSubscription(
  companyId: number,
  stripeCustomerId: string,
  subscription: Stripe.Subscription
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO contractor_subscriptions (
      company_id, stripe_customer_id, stripe_subscription_id, 
      status, plan_type, current_period_start, current_period_end,
      cancel_at_period_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(stripe_subscription_id) DO UPDATE SET
      status = excluded.status,
      plan_type = excluded.plan_type,
      current_period_start = excluded.current_period_start,
      current_period_end = excluded.current_period_end,
      cancel_at_period_end = excluded.cancel_at_period_end,
      updated_at = CURRENT_TIMESTAMP
  `);
  
  const planType = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly';
  
  return stmt.run(
    companyId,
    stripeCustomerId,
    subscription.id,
    subscription.status,
    planType,
    new Date(subscription.current_period_start * 1000).toISOString(),
    new Date(subscription.current_period_end * 1000).toISOString(),
    subscription.cancel_at_period_end ? 1 : 0
  );
}

// Get subscription by company ID
export function getSubscriptionByCompanyId(companyId: number) {
  const db = getDatabase();
  return db.prepare(`
    SELECT * FROM contractor_subscriptions 
    WHERE company_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(companyId);
}

// Create or update Stripe Connected Account
export async function createOrUpdateConnectedAccount(
  companyId: number,
  account: Stripe.Account
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO contractor_stripe_accounts (
      company_id, stripe_account_id, charges_enabled,
      payouts_enabled, details_submitted, account_type
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(company_id) DO UPDATE SET
      stripe_account_id = excluded.stripe_account_id,
      charges_enabled = excluded.charges_enabled,
      payouts_enabled = excluded.payouts_enabled,
      details_submitted = excluded.details_submitted,
      updated_at = CURRENT_TIMESTAMP
  `);
  
  return stmt.run(
    companyId,
    account.id,
    account.charges_enabled ? 1 : 0,
    account.payouts_enabled ? 1 : 0,
    account.details_submitted ? 1 : 0,
    account.type || 'express'
  );
}

// Get connected account by company ID
export function getConnectedAccountByCompanyId(companyId: number) {
  const db = getDatabase();
  return db.prepare(`
    SELECT * FROM contractor_stripe_accounts 
    WHERE company_id = ?
  `).get(companyId);
}

// Create payment record
export async function createPayment(
  quoteId: number,
  companyId: number,
  paymentIntent: Stripe.PaymentIntent,
  platformFee: number
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO quote_payments (
      quote_id, company_id, stripe_payment_intent_id,
      amount, currency, status, platform_fee, contractor_payout,
      payment_method_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const contractorPayout = paymentIntent.amount - platformFee;
  
  return stmt.run(
    quoteId,
    companyId,
    paymentIntent.id,
    paymentIntent.amount,
    paymentIntent.currency,
    paymentIntent.status,
    platformFee,
    contractorPayout,
    paymentIntent.payment_method_types[0] || 'card'
  );
}

// Update payment status
export function updatePaymentStatus(
  paymentIntentId: string,
  status: string,
  paidAt?: Date
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    UPDATE quote_payments 
    SET status = ?, paid_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE stripe_payment_intent_id = ?
  `);
  
  return stmt.run(
    status,
    paidAt ? paidAt.toISOString() : null,
    paymentIntentId
  );
}

// Create invoice record
export async function createInvoice(
  quoteId: number,
  companyId: number,
  customerId: number,
  invoice: Stripe.Invoice
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO invoices (
      quote_id, company_id, customer_id, stripe_invoice_id,
      invoice_number, status, amount_due, amount_paid,
      currency, due_date, pdf_url, hosted_invoice_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    quoteId,
    companyId,
    customerId,
    invoice.id,
    invoice.number || `INV-${Date.now()}`,
    invoice.status || 'draft',
    invoice.amount_due,
    invoice.amount_paid,
    invoice.currency,
    invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    invoice.pdf,
    invoice.hosted_invoice_url
  );
}

// Record webhook event for idempotency
export async function recordWebhookEvent(
  eventId: string,
  eventType: string,
  payload: any,
  processed: boolean = false,
  errorMessage?: string
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO stripe_webhook_events (
      stripe_event_id, event_type, processed, error_message, payload
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(stripe_event_id) DO UPDATE SET
      processed = excluded.processed,
      error_message = excluded.error_message
  `);
  
  return stmt.run(
    eventId,
    eventType,
    processed ? 1 : 0,
    errorMessage || null,
    JSON.stringify(payload)
  );
}

// Check if webhook event was already processed
export function wasWebhookEventProcessed(eventId: string): boolean {
  const db = getDatabase();
  const result = db.prepare(`
    SELECT processed FROM stripe_webhook_events 
    WHERE stripe_event_id = ?
  `).get(eventId) as { processed: number } | undefined;
  
  return result?.processed === 1;
}

// Update company with Stripe customer ID
export function updateCompanyStripeCustomerId(
  companyId: number,
  stripeCustomerId: string
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    UPDATE companies 
    SET stripe_customer_id = ?
    WHERE id = ?
  `);
  
  return stmt.run(stripeCustomerId, companyId);
}

// Update customer with Stripe customer ID
export function updateCustomerStripeCustomerId(
  customerId: number,
  stripeCustomerId: string
) {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    UPDATE customers 
    SET stripe_customer_id = ?
    WHERE id = ?
  `);
  
  return stmt.run(stripeCustomerId, customerId);
}