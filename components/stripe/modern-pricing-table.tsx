'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckoutForm } from './checkout-form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ModernPricingTableProps {
  companyId?: number;
}

export function ModernPricingTable({ companyId: propCompanyId }: ModernPricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [companyId, setCompanyId] = useState<number | undefined>(propCompanyId);

  useEffect(() => {
    // Check session storage for company ID if not passed as prop
    if (!propCompanyId && typeof window !== 'undefined') {
      const storedCompanyId = sessionStorage.getItem('companyId');
      if (storedCompanyId) {
        setCompanyId(parseInt(storedCompanyId));
      }
    }
  }, [propCompanyId]);

  const plans = [
    {
      id: 'free',
      name: 'Perfect Start',
      description: 'Ideal for solo contractors getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: null,
      popular: false,
      gradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
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
      ctaVariant: 'outline' as const,
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
      gradient: 'gradient-blue-contrast',
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
      ctaVariant: 'default' as const,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID,
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For established contractors with teams',
      monthlyPrice: 149,
      yearlyPrice: 1430,
      yearlyMonthlyPrice: 119.17,
      savings: 358,
      badge: null,
      popular: false,
      gradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
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
      ctaVariant: 'default' as const,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID,
    },
  ];

  return (
    <div className="w-full py-8">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1.5 rounded-xl inline-flex items-center gap-2">
          <Label
            htmlFor="billing-toggle"
            className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
              !isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-blue-600"
          />
          <Label
            htmlFor="billing-toggle"
            className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2 ${
              isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Yearly
            <Badge className="bg-green-100 text-green-700 border-green-200">
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
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Get 2 months free with yearly billing!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const isMiddle = index === 1;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${isMiddle ? 'lg:-mt-4' : ''}`}
            >
              <Card
                className={`relative h-full border-2 transition-all duration-300 ${
                  plan.popular
                    ? 'border-blue-500 shadow-2xl scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-1.5 text-sm font-semibold shadow-lg">
                      <Star className="w-4 h-4 mr-1.5 fill-current" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Card Header */}
                <div className={`p-8 pb-6 text-center ${plan.gradient} rounded-t-lg`}>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <p className={`mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>{plan.description}</p>

                  {/* Pricing */}
                  <div className="mb-2">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isYearly ? 'yearly' : 'monthly'}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-baseline justify-center gap-1"
                      >
                        <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                          ${isYearly && plan.yearlyMonthlyPrice ? Math.floor(plan.yearlyMonthlyPrice) : price}
                        </span>
                        {price > 0 && (
                          <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                            /{isYearly ? 'month' : 'month'}
                          </span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Yearly pricing details */}
                  {isYearly && plan.savings && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1"
                    >
                      <p className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                        <span className="line-through">${plan.monthlyPrice * 12}</span>
                        <span className={`ml-2 font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>${plan.yearlyPrice}/year</span>
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        You save ${plan.savings}
                      </Badge>
                    </motion.div>
                  )}

                  {/* Free plan specifics */}
                  {plan.id === 'free' && (
                    <p className={`text-sm font-semibold mt-2 ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      10 Quotes/Month Limit
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="p-8 pt-6 space-y-4">
                  <TooltipProvider>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className={`flex items-start gap-3 ${
                            feature.highlighted ? 'font-medium' : ''
                          }`}
                        >
                          <Check
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              feature.highlighted
                                ? 'text-blue-600'
                                : 'text-green-500'
                            }`}
                          />
                          <span className="text-gray-700 text-sm">
                            {feature.text}
                            {feature.text.includes('API') && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Connect your existing tools and automate workflows</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TooltipProvider>

                  {/* CTA Button */}
                  <div className="pt-6">
                    {plan.id === 'free' ? (
                      <Button
                        size="lg"
                        variant={plan.ctaVariant}
                        className="w-full text-base font-semibold py-6"
                        onClick={() => (window.location.href = '/trial-signup')}
                      >
                        {plan.cta}
                      </Button>
                    ) : companyId ? (
                      <CheckoutForm
                        companyId={companyId}
                        planType={isYearly ? 'yearly' : 'monthly'}
                        priceId={
                          isYearly ? plan.yearlyPriceId : plan.monthlyPriceId
                        }
                        buttonText={plan.cta}
                        buttonClassName="w-full text-base font-semibold py-6"
                      />
                    ) : (
                      <Button
                        size="lg"
                        variant={plan.ctaVariant}
                        className={`w-full text-base font-semibold py-6 ${
                          plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : ''
                        }`}
                        onClick={() => (window.location.href = '/access-code')}
                      >
                        Sign in to {plan.cta}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12 space-y-4"
      >
        <div className="flex justify-center items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-600">
          Trusted by <span className="font-semibold text-gray-900">5,000+</span> painting contractors
        </p>
        <p className="text-sm text-gray-500">
          Average ROI: <span className="font-semibold">278%</span> in the first 90 days
        </p>
      </motion.div>
    </div>
  );
}