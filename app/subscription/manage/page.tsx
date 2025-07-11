"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Calendar, AlertTriangle, ExternalLink } from 'lucide-react'

export default function SubscriptionManagePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageBilling = async () => {
    setIsLoading(true)

    try {
      // TODO: Get actual customer ID from user session
      const customerId = 'cus_example_customer_id'

      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.href,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                Subscription Management
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Manage your subscription, billing, and account settings
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary-600" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>
                    Your active subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Plan:</span>
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Professional
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price:</span>
                      <span className="text-lg font-bold">$29/month</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status:</span>
                      <span className="text-green-600 font-semibold">Active</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Quotes Used:</span>
                      <span>47 / Unlimited</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary-600" />
                    Billing Information
                  </CardTitle>
                  <CardDescription>
                    Payment method and billing cycle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Next billing:</span>
                      <span>Jan 15, 2025</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Payment method:</span>
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        •••• 4242
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Amount:</span>
                      <span className="font-bold">$29.00</span>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        Your subscription will automatically renew on Jan 15, 2025
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Management Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Subscription Actions</CardTitle>
                <CardDescription>
                  Manage your subscription, update payment methods, or view billing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleManageBilling}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                    variant="kofi"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {isLoading ? 'Loading...' : 'Manage Billing'}
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <Link href="/pricing">View All Plans</Link>
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">What can you do in the billing portal?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Update your payment method</li>
                    <li>• View and download invoices</li>
                    <li>• Change your billing address</li>
                    <li>• Cancel or modify your subscription</li>
                    <li>• Set up payment reminders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    <strong>Cancellation:</strong> You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                  </p>
                  <p>
                    <strong>Downgrade:</strong> If you downgrade to a lower plan, changes take effect at your next billing cycle.
                  </p>
                  <p>
                    <strong>Upgrade:</strong> Upgrades are prorated and take effect immediately.
                  </p>
                  <p>
                    <strong>Refunds:</strong> We offer a 30-day money-back guarantee for new subscriptions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}