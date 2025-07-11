import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
      { status: 500 }
    )
  }

  try {
    const { email, name, metadata } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      return NextResponse.json({
        customer: existingCustomers.data[0]
      })
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'propaint_quote_app',
        ...metadata,
      },
    })

    return NextResponse.json({
      customer
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}