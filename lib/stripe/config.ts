import Stripe from 'stripe';

// Server-side Stripe instance - lazy initialization to avoid build errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver);
  }
});

// Configuration constants
export const STRIPE_CONFIG = {
  // Secret key for server-side operations
  secretKey: process.env.STRIPE_SECRET_KEY!,
  
  // Platform fee percentage (3-5%)
  platformFeePercent: parseInt(process.env.STRIPE_APPLICATION_FEE_PERCENT || '3'),
  
  // Currency
  currency: 'usd',
  
  // Subscription price IDs
  prices: {
    monthlySubscription: process.env.STRIPE_CONTRACTOR_MONTHLY_PRICE_ID!,
    yearlySubscription: process.env.STRIPE_CONTRACTOR_YEARLY_PRICE_ID!,
  },
  
  // Webhook secrets
  webhookSecrets: {
    account: process.env.STRIPE_WEBHOOK_SECRET!,
    connect: process.env.STRIPE_CONNECT_WEBHOOK_SECRET!,
  },
  
  // Public key for client-side
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
};

// Helper to format amount from cents to dollars
export function formatAmountFromCents(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100);
}

// Helper to convert dollars to cents
export function convertToCents(amountInDollars: number): number {
  return Math.round(amountInDollars * 100);
}

// Calculate platform fee (0% for Jobber model)
export function calculatePlatformFee(amountInCents: number): number {
  // Following Jobber model - no platform fee, just pass through Stripe's fees
  return 0;
}

// Calculate contractor payout after platform fee
export function calculateContractorPayout(amountInCents: number): number {
  return amountInCents - calculatePlatformFee(amountInCents);
}