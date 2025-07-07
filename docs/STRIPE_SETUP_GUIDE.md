# Stripe Integration Setup Guide

## Overview

This guide will help you complete the Stripe integration for your painting quote app. The integration supports:
- **Contractor Subscriptions**: Monthly/yearly plans for contractors to use your platform
- **Quote Payments**: Customers paying contractors directly through the platform
- **Platform Fees**: Optional 3-5% fee on customer payments

## Current Implementation Status ✅

### Completed Features:
1. ✅ Stripe SDK installed and configured
2. ✅ Environment variables set up with test keys
3. ✅ Database schema for payments and subscriptions
4. ✅ API routes for creating checkout sessions
5. ✅ API routes for payment intents and payment links
6. ✅ Webhook endpoint for real-time updates
7. ✅ React components for payment forms
8. ✅ Customer portal integration
9. ✅ Subscription status management

### Pending Setup in Stripe Dashboard:
1. ⏳ Create subscription products
2. ⏳ Configure webhook endpoints
3. ⏳ Set up customer portal
4. ⏳ Configure Connect for contractor payouts

## Step-by-Step Setup

### 1. Create Subscription Products in Stripe

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)
2. Click "Add product"
3. Create Monthly Subscription:
   - Name: "ProPaint Quote Monthly"
   - Pricing: $29/month (or your chosen price)
   - Recurring billing
   - Copy the price ID (starts with `price_`)
4. Create Yearly Subscription:
   - Name: "ProPaint Quote Annual"
   - Pricing: $290/year (or your chosen price)
   - Recurring billing
   - Copy the price ID

### 2. Update Environment Variables

Update your `.env.local` file with the price IDs:

```env
STRIPE_CONTRACTOR_MONTHLY_PRICE_ID=price_your_monthly_id_here
STRIPE_CONTRACTOR_YEARLY_PRICE_ID=price_your_yearly_id_here
```

### 3. Configure Webhooks

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.created`
   - `invoice.paid`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Update your `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### 4. Configure Customer Portal

1. Go to [Stripe Settings → Billing → Customer portal](https://dashboard.stripe.com/test/settings/billing/portal)
2. Enable the customer portal
3. Configure features:
   - ✅ Customers can update payment methods
   - ✅ Customers can cancel subscriptions
   - ✅ Customers can switch plans
   - ✅ Customers can view billing history
4. Save settings

### 5. Test the Integration

#### Test Subscription Flow:
1. Navigate to your pricing page
2. Click "Subscribe Now" on a plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription is created in database

#### Test Payment Flow:
1. Create a quote in your app
2. Generate a payment link for the quote
3. Click the payment link
4. Use test card: `4242 4242 4242 4242`
5. Verify payment is recorded

#### Test Customer Portal:
1. As a subscribed contractor, go to billing settings
2. Click "Manage Subscription"
3. Verify portal opens with subscription details

### 6. Database Migrations

Run the Stripe schema migrations:

```bash
# The migrations are automatically applied when the app starts
# Check that these tables exist:
- contractor_subscriptions
- contractor_stripe_accounts
- quote_payments
- payment_links
- invoices
- stripe_webhook_events
```

## Using the Components

### Subscription Checkout:
```tsx
import { CheckoutForm } from '@/components/stripe/checkout-form';

<CheckoutForm 
  companyId={companyId}
  planType="monthly" // or "yearly"
  buttonText="Subscribe Now"
/>
```

### Payment Form:
```tsx
import { PaymentForm } from '@/components/stripe/payment-form';

<PaymentForm 
  quoteId={quoteId}
  amount={totalAmount}
  customerEmail={customerEmail}
  onSuccess={() => console.log('Payment successful!')}
/>
```

### Subscription Status:
```tsx
import { SubscriptionStatus } from '@/components/stripe/subscription-status';

<SubscriptionStatus companyId={companyId} />
```

### Pricing Plans:
```tsx
import { PricingPlans } from '@/components/stripe/pricing-plans';

<PricingPlans 
  companyId={companyId}
  monthlyPrice={29}
  yearlyPrice={290}
/>
```

## Testing Scenarios

### Test Cards:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires 3D Secure**: 4000 0025 0000 3155
- **Insufficient Funds**: 4000 0000 0000 9995

### Test Webhooks Locally:
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

## Going Live Checklist

Before switching to production:

1. [ ] Replace test API keys with live keys
2. [ ] Create live products in Stripe Dashboard
3. [ ] Update webhook endpoints with production URL
4. [ ] Test a real payment with a small amount
5. [ ] Enable Stripe Radar for fraud protection
6. [ ] Set up email receipts in Stripe
7. [ ] Configure tax settings if needed
8. [ ] Review PCI compliance requirements

## Security Best Practices

1. **Never expose secret keys** - Only use `NEXT_PUBLIC_` prefix for publishable key
2. **Verify webhook signatures** - Already implemented in webhook handler
3. **Validate amounts server-side** - Never trust client-side prices
4. **Use HTTPS in production** - Required for PCI compliance
5. **Enable Stripe Radar** - Helps prevent fraudulent payments

## Troubleshooting

### Common Issues:

**"No such price" error:**
- Ensure you've created products in Stripe Dashboard
- Update price IDs in `.env.local`
- Restart your development server

**Webhook signature verification failed:**
- Ensure webhook secret is correctly set
- Check that raw body is being used (not parsed)
- Verify endpoint URL matches exactly

**Customer portal not opening:**
- Enable portal in Stripe Dashboard
- Ensure customer has active subscription
- Check browser console for errors

## Next Steps

1. Complete the Stripe Dashboard setup
2. Test all payment flows
3. Add email notifications for payment events
4. Implement invoice PDF generation
5. Add payment analytics dashboard

For more information, refer to:
- [Stripe Docs](https://stripe.com/docs)
- [Next.js Stripe Example](https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript)