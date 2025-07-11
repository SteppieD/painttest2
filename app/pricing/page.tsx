"use client"

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
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Perfect for trying our AI quote system",
    features: [
      "3 AI-powered quotes",
      "Basic project templates",
      "Email support",
      "Standard response time"
    ],
    limitations: [
      "Watermarked quotes",
      "No client portal access",
      "Limited customization"
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
    popular: false,
    icon: Zap
  },
  {
    name: "Professional",
    price: "$29",
    period: "per month",
    description: "For painting contractors who want more quotes",
    features: [
      "Unlimited AI quotes",
      "Professional templates",
      "Remove watermarks",
      "Client portal access",
      "Priority email support",
      "Quote analytics",
      "Custom branding"
    ],
    limitations: [],
    cta: "Start Professional",
    ctaVariant: "kofi" as const,
    popular: true,
    icon: Crown,
    priceId: PRICE_IDS.PROFESSIONAL_MONTHLY
  },
  {
    name: "Business",
    price: "$79",
    period: "per month",
    description: "For growing painting businesses",
    features: [
      "Everything in Professional",
      "Team collaboration (5 users)",
      "Advanced analytics",
      "API access",
      "Phone support",
      "Custom integrations",
      "Priority AI processing",
      "Dedicated account manager"
    ],
    limitations: [],
    cta: "Start Business",
    ctaVariant: "outline" as const,
    popular: false,
    icon: Rocket,
    priceId: PRICE_IDS.BUSINESS_MONTHLY
  }
]

export default function PricingPage() {
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
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-base mt-3">
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
                        priceId={plan.priceId!}
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