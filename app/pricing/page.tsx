"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react'
import { CheckoutButton } from '@/components/stripe/checkout-button'
import { PRICE_IDS } from '@/lib/stripe'

const plans = [
  {
    name: "Perfect Start",
    subtitle: "For solo contractors",
    price: "$0",
    period: "month",
    description: "10 quotes per month",
    features: [
      "All core features",
      "Mobile app access", 
      "Email support"
    ],
    limitations: [],
    cta: "Start Free",
    ctaVariant: "outline" as const,
    popular: false,
    icon: Zap
  },
  {
    name: "Professional",
    subtitle: "For growing businesses", 
    price: "$79",
    period: "month",
    yearlyPrice: "$63",
    yearlyTotal: "$756",
    description: "Unlimited quotes",
    features: [
      "Everything in Free",
      "Custom branding",
      "Priority support",
      "Analytics dashboard"
    ],
    limitations: [],
    cta: "Start 14-Day Trial",
    ctaVariant: "kofi" as const,
    popular: true,
    icon: Crown,
    priceId: PRICE_IDS.PROFESSIONAL_MONTHLY,
    yearlyPriceId: PRICE_IDS.PROFESSIONAL_YEARLY
  },
  {
    name: "Business",
    subtitle: "For teams & enterprises",
    price: "$149",
    period: "month",
    yearlyPrice: "$119", 
    yearlyTotal: "$1,428",
    description: "Everything included",
    features: [
      "Everything in Pro",
      "Multi-user access",
      "API access",
      "Dedicated manager"
    ],
    limitations: [],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    popular: false,
    icon: Rocket,
    priceId: PRICE_IDS.BUSINESS_MONTHLY,
    yearlyPriceId: PRICE_IDS.BUSINESS_YEARLY
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that fits your business. All plans include our AI-powered quote system 
              that saves you hours and impresses your clients.
            </p>
            
            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mt-8 mb-8">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-primary-600' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-primary-600' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span>4.9/5 contractor rating</span>
              </div>
              <div className="text-gray-600">
                30-day money-back guarantee
              </div>
              <div className="text-gray-600">
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <Card 
                  key={plan.name} 
                  className={`relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-2 border-primary-500 shadow-lg scale-105' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl w-fit">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1 mb-4">
                      {plan.subtitle}
                    </CardDescription>
                    <div className="mt-4">
                      {billingCycle === 'yearly' && plan.yearlyPrice ? (
                        <>
                          <span className="text-4xl font-bold">{plan.yearlyPrice}</span>
                          <span className="text-gray-600 ml-2">/month</span>
                          <div className="text-sm text-gray-500 mt-1">
                            Billed annually ({plan.yearlyTotal})
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-gray-600 ml-2">/{plan.period}</span>
                        </>
                      )}
                    </div>
                    <CardDescription className="text-base mt-3 font-medium">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                          {plan.limitations.map((limitation, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto mt-1"></div>
                              </div>
                              <span className="text-sm text-gray-500">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {plan.name === "Free Trial" ? (
                      <Button 
                        asChild 
                        variant={plan.ctaVariant} 
                        className="w-full h-12 text-lg font-semibold"
                      >
                        <Link href="/trial-signup">
                          {plan.cta}
                        </Link>
                      </Button>
                    ) : (
                      <CheckoutButton
                        priceId={billingCycle === 'yearly' && plan.yearlyPriceId ? plan.yearlyPriceId : plan.priceId!}
                        planName={plan.name}
                        variant={plan.ctaVariant}
                        className="w-full h-12 text-lg font-semibold"
                      />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">How does the AI quote system work?</h3>
                <p className="text-gray-600 mb-6">
                  Simply describe your painting project in natural language. Our AI understands 
                  room dimensions, surfaces, paint preferences, and generates professional quotes 
                  in under 30 seconds.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Can I upgrade or downgrade anytime?</h3>
                <p className="text-gray-600 mb-6">
                  Yes! You can change your plan at any time. Upgrades take effect immediately, 
                  and downgrades take effect at your next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">What if I need more than 3 trial quotes?</h3>
                <p className="text-gray-600 mb-6">
                  You can upgrade to Professional anytime during your trial to get unlimited quotes. 
                  We also offer a 30-day money-back guarantee.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Do you offer phone support?</h3>
                <p className="text-gray-600 mb-6">
                  Business plan includes phone support and a dedicated account manager. 
                  Professional and Free plans include priority email support.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Quoting Process?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join 2,000+ painting contractors who save 5+ hours per week with AI quotes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-primary-600 border-white hover:bg-gray-100">
                <Link href="/get-quote">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                <Link href="/demo">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}