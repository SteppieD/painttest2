import { NextResponse } from 'next/server';

export async function GET() {
  const stripeConfig = {
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasProfessionalMonthlyPrice: !!process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID,
    hasProfessionalYearlyPrice: !!process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID,
    hasBusinessMonthlyPrice: !!process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    hasBusinessYearlyPrice: !!process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
  };

  const isConfigured = Object.values(stripeConfig).every(val => val === true);

  return NextResponse.json({
    configured: isConfigured,
    details: stripeConfig,
    recommendation: isConfigured 
      ? 'Stripe is fully configured and ready for payments!' 
      : 'Stripe environment variables are missing. Check your .env.local file.',
    missingKeys: Object.entries(stripeConfig)
      .filter(([_, value]) => !value)
      .map(([key]) => key),
  });
}