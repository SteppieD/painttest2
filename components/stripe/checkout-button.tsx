"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutButtonProps {
  priceId: string
  planName: string
  variant?: "default" | "outline" | "kofi"
  className?: string
}

export function CheckoutButton({ priceId, planName, variant = "default", className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Create customer first (you might want to collect email in a modal)
      const customerResponse = await fetch('/api/stripe/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'customer@example.com', // TODO: Replace with actual user email
          name: 'Customer Name', // TODO: Replace with actual user name
        }),
      })

      const { customer } = await customerResponse.json()

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId: customer.id,
        }),
      })

      const { sessionId, url } = await response.json()

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        // Fallback to Stripe.js redirect
        const stripe = await stripePromise
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) {
            console.error('Stripe checkout error:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error starting checkout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? 'Loading...' : `Start ${planName}`}
    </Button>
  )
}