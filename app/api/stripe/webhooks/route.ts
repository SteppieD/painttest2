import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
      { status: 500 }
    )
  }
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)
  
  // TODO: Update user's subscription status in your database
  // This would typically involve:
  // 1. Finding the user by customer ID
  // 2. Updating their plan status
  // 3. Setting subscription limits (quote limits, etc.)
  
  const customerId = subscription.customer as string
  const plan = subscription.metadata.plan || 'professional'
  
  console.log(`Customer ${customerId} subscribed to ${plan} plan`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  
  // TODO: Update user's subscription in database
  const customerId = subscription.customer as string
  const status = subscription.status
  
  console.log(`Customer ${customerId} subscription status: ${status}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  // TODO: Downgrade user to free plan
  const customerId = subscription.customer as string
  
  console.log(`Customer ${customerId} subscription cancelled - downgrading to free plan`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id)
  
  // TODO: Update user's payment status, extend subscription
  const customerId = invoice.customer as string
  
  console.log(`Payment succeeded for customer ${customerId}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id)
  
  // TODO: Handle failed payment (send email, update status, etc.)
  const customerId = invoice.customer as string
  
  console.log(`Payment failed for customer ${customerId}`)
}