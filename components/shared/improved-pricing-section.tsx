'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, Crown, Palette, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ImprovedPricingSectionProps {
  companyId?: number;
}

export function ImprovedPricingSection({ companyId }: ImprovedPricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Perfect Start',
      description: 'Ideal for solo contractors getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: null,
      popular: false,
      borderColor: 'border-gray-200',
      headerGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
      features: [
        { text: '10 professional quotes per month', highlighted: true },
        { text: 'All core features included', highlighted: false },
        { text: 'Mobile app access', highlighted: false },
        { text: 'Professional branded templates', highlighted: false },
        { text: 'Basic customer management', highlighted: false },
        { text: 'PDF quote generation', highlighted: false },
        { text: 'Email support', highlighted: false },
      ],
      cta: 'Start Free Forever',
      ctaClass: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
      iconColor: 'text-gray-600',
      icon: Palette,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Perfect for growing painting businesses',
      monthlyPrice: 79,
      yearlyPrice: 758,
      yearlyMonthlyPrice: 63.17,
      savings: 190,
      badge: 'Most Popular',
      popular: true,
      borderColor: 'border-blue-300',
      headerGradient: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      features: [
        { text: 'Unlimited quotes per month', highlighted: true },
        { text: 'Everything in Free, plus:', highlighted: false },
        { text: 'Custom branding & logos', highlighted: true },
        { text: 'Customer management system', highlighted: false },
        { text: 'Analytics dashboard', highlighted: true },
        { text: 'Digital signatures', highlighted: false },
        { text: 'Payment processing', highlighted: true },
        { text: 'Automated follow-ups', highlighted: false },
        { text: 'Priority phone support', highlighted: true },
        { text: 'QuickBooks integration', highlighted: false },
      ],
      cta: 'Start 14-Day Trial',
      ctaClass: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg',
      iconColor: 'text-blue-600',
      icon: Zap,
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For established contractors with teams',
      monthlyPrice: 149,
      yearlyPrice: 1430,
      yearlyMonthlyPrice: 119.17,
      savings: 358,
      badge: 'Enterprise',
      popular: false,
      borderColor: 'border-purple-200',
      headerGradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
      features: [
        { text: 'Everything in Professional, plus:', highlighted: false },
        { text: 'Multi-user access (up to 5)', highlighted: true },
        { text: 'Advanced analytics & reporting', highlighted: true },
        { text: 'Multi-location management', highlighted: false },
        { text: 'Team collaboration tools', highlighted: true },
        { text: 'API access for integrations', highlighted: false },
        { text: 'Custom quote workflows', highlighted: true },
        { text: 'Bulk operations', highlighted: false },
        { text: 'Advanced paint database (50k+ colors)', highlighted: true },
        { text: 'White-label options', highlighted: false },
        { text: 'Dedicated success manager', highlighted: true },
      ],
      cta: 'Start 14-Day Trial',
      ctaClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg',
      iconColor: 'text-purple-600',
      icon: Crown,
    },
  ];

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header Section - Bright & Engaging */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-600 mt-2">Choose the perfect plan for your painting business</p>
            </div>
          </div>

          {/* Trust Indicator */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full mb-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <span className="font-medium">Trusted by 5,000+ contractors</span>
          </div>

          {/* Billing Toggle - Bright Design */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-50 p-2 rounded-2xl inline-flex items-center gap-3 border-2 border-gray-100">
              <Label
                htmlFor="billing-toggle"
                className={`px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                  !isYearly ? 'bg-white text-gray-900 shadow-md border-2 border-blue-100' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
              />
              <Label
                htmlFor="billing-toggle"
                className={`px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isYearly ? 'bg-white text-gray-900 shadow-md border-2 border-green-100' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  Save 20%
                </Badge>
              </Label>
            </div>
          </div>

          {/* Savings Banner */}
          <AnimatePresence mode="wait">
            {isYearly && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 text-green-800 px-6 py-3 rounded-2xl border-2 border-green-100">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Get 2 months free with yearly billing!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Cards - Bright & Modern */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const IconComponent = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'lg:-mt-4 lg:scale-105' : ''}`}
              >
                <Card
                  className={`relative h-full bg-white border-2 transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? 'border-blue-300 shadow-2xl ring-4 ring-blue-100'
                      : `${plan.borderColor} hover:${plan.borderColor.replace('200', '300')} hover:shadow-lg`
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className={`px-6 py-2 text-sm font-bold shadow-lg ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      }`}>
                        <Star className="w-4 h-4 mr-1.5 fill-current" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Card Header - Colorful */}
                  <div className={`p-8 text-center ${plan.headerGradient} rounded-t-lg border-b-2 ${plan.borderColor}`}>
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border-2 ${plan.borderColor}`}>
                        <IconComponent className={`w-8 h-8 ${plan.iconColor}`} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    {/* Pricing Display */}
                    <div className="mb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isYearly ? 'yearly' : 'monthly'}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-baseline justify-center gap-1"
                        >
                          <span className="text-5xl font-bold text-gray-900">
                            ${isYearly && plan.yearlyMonthlyPrice ? Math.floor(plan.yearlyMonthlyPrice) : price}
                          </span>
                          {price > 0 && (
                            <span className="text-lg text-gray-600">/month</span>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Yearly Savings */}
                    {isYearly && plan.savings && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <p className="text-sm text-gray-600">
                          <span className="line-through">${plan.monthlyPrice * 12}</span>
                          <span className="ml-2 font-semibold text-gray-900">${plan.yearlyPrice}/year</span>
                        </p>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          You save ${plan.savings}
                        </Badge>
                      </motion.div>
                    )}

                    {/* Free Plan Note */}
                    {plan.id === 'free' && (
                      <p className="text-sm font-semibold mt-3 text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        10 Quotes/Month Limit
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="p-8 space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className={`flex items-start gap-3 ${
                            feature.highlighted ? 'font-semibold' : ''
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            feature.highlighted
                              ? 'bg-blue-100'
                              : 'bg-green-100'
                          }`}>
                            <Check
                              className={`w-4 h-4 ${
                                feature.highlighted
                                  ? 'text-blue-600'
                                  : 'text-green-600'
                              }`}
                            />
                          </div>
                          <span className={`text-sm ${
                            feature.highlighted ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="pt-6">
                      <Button
                        size="lg"
                        className={`w-full text-base font-semibold py-6 transition-all ${plan.ctaClass}`}
                        onClick={() => {
                          if (plan.id === 'free') {
                            window.location.href = '/trial-signup';
                          } else if (companyId) {
                            // Handle checkout with company ID
                            console.log('Start checkout for', plan.id);
                          } else {
                            window.location.href = '/access-code';
                          }
                        }}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Social Proof - Matches Footer Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-12 rounded-3xl border-2 border-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-gray-700 font-medium">Customer Rating</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-700 font-medium">Active Contractors</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">278%</div>
              <div className="text-gray-700 font-medium">Average ROI in 90 days</div>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 font-medium">
            Join thousands of contractors who've increased their win rates
          </p>
        </motion.div>
      </div>
    </div>
  );
}