import { getDatabase } from '@/lib/database/init';
import { stripe } from './config';
import type { Stripe } from 'stripe';

// Mock implementations for Supabase compatibility
// All database operations are replaced with mock implementations

// Subscription Management
export async function createOrUpdateSubscription(
  companyId: number,
  stripeCustomerId: string,
  subscription: Stripe.Subscription
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Create/update subscription', companyId, stripeCustomerId, subscription.id);
  return { changes: 1 };
}

// Payment Processing
export async function createPaymentRecord(
  quoteId: number,
  companyId: number,
  customerId: number,
  paymentIntent: Stripe.PaymentIntent
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Create payment record', quoteId, paymentIntent.id);
  return { changes: 1 };
}

// Update payment status
export function updatePaymentStatus(
  paymentIntentId: string,
  status: string,
  paidAt?: Date
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Update payment status', paymentIntentId, status);
  return { changes: 1 };
}

// Create invoice record
export async function createInvoice(
  quoteId: number,
  companyId: number,
  customerId: number,
  invoice: Stripe.Invoice
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Create invoice', quoteId, invoice.id);
  return { changes: 1 };
}

// Record webhook event for idempotency
export async function recordWebhookEvent(
  eventId: string,
  eventType: string,
  payload: any,
  processed: boolean = false,
  errorMessage?: string
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Record webhook event', eventId, eventType, processed);
  return { changes: 1 };
}

// Check if webhook event was already processed
export function wasWebhookEventProcessed(eventId: string): boolean {
  // Mock implementation for Supabase compatibility
  // In a real implementation, this would query the database
  return false;
}

// Update company with Stripe customer ID
export function updateCompanyStripeCustomerId(
  companyId: number,
  stripeCustomerId: string
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Update company Stripe customer ID', companyId, stripeCustomerId);
  return { changes: 1 };
}

// Update customer with Stripe customer ID
export function updateCustomerStripeCustomerId(
  customerId: number,
  stripeCustomerId: string
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Update customer Stripe customer ID', customerId, stripeCustomerId);
  return { changes: 1 };
}

// Get subscription by company ID
export async function getSubscriptionByCompanyId(companyId: number) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get subscription by company ID', companyId);
  return null;
}

// Get subscription by Stripe subscription ID
export async function getSubscriptionByStripeId(subscriptionId: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get subscription by Stripe ID', subscriptionId);
  return null;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Cancel subscription', subscriptionId);
  return { changes: 1 };
}

// Get payment by payment intent ID
export async function getPaymentByIntentId(paymentIntentId: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get payment by intent ID', paymentIntentId);
  return null;
}

// Get invoice by Stripe invoice ID
export async function getInvoiceByStripeId(invoiceId: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get invoice by Stripe ID', invoiceId);
  return null;
}

// Update invoice status
export async function updateInvoiceStatus(invoiceId: string, status: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Update invoice status', invoiceId, status);
  return { changes: 1 };
}

// Get customer by Stripe customer ID
export async function getCustomerByStripeId(customerId: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get customer by Stripe ID', customerId);
  return null;
}

// Get company by Stripe customer ID
export async function getCompanyByStripeId(customerId: string) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get company by Stripe ID', customerId);
  return null;
}

// Get connected account by company ID
export async function getConnectedAccountByCompanyId(companyId: number) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Get connected account by company ID', companyId);
  return null;
}

// Create payment
export async function createPayment(
  quoteId: number,
  companyId: number,
  paymentIntent: any,
  platformFee: number
) {
  // Mock implementation for Supabase compatibility
  console.log('Mock: Create payment', quoteId, companyId, paymentIntent.id, platformFee);
  return { changes: 1 };
}