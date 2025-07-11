import Stripe from 'stripe'

// Use a placeholder during build if environment variable is not set
const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build'

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

// Check if we're in a runtime environment and need real keys
export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY

export const PRICE_IDS = {
  PROFESSIONAL_MONTHLY: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || 'price_professional_monthly',
  PROFESSIONAL_YEARLY: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID || 'price_professional_yearly',
  BUSINESS_MONTHLY: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || 'price_business_monthly',
  BUSINESS_YEARLY: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || 'price_business_yearly',
} as const

export const PLANS = {
  FREE: 'free',
  PROFESSIONAL: 'professional',
  BUSINESS: 'business',
} as const

export type Plan = typeof PLANS[keyof typeof PLANS]