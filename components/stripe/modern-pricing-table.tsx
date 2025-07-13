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
    // Check for company ID if not passed as prop
    if (!propCompanyId && typeof window !== 'undefined') {
      // First check sessionStorage
      const storedCompanyId = sessionStorage.getItem('companyId');
      if (storedCompanyId) {
        setCompanyId(parseInt(storedCompanyId));
      } else {
        // Also check localStorage for company data
        const companyData = localStorage.getItem('paintquote_company');
        if (companyData) {
          try {
            const company = JSON.parse(companyData);
            if (company.id) {
              setCompanyId(company.id);
            }
          } catch (e) {
            console.error('Error parsing company data:', e);
          }
        }
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
    <div>
      {/* Billing Toggle */}
      <div>
        <div>
          <Label
            htmlFor="billing-toggle"
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
           
          />
          <Label
            htmlFor="billing-toggle"
          >
            Yearly
            <Badge>
              Save 20%
            </Badge>
          </Label>
        </div>
      </div>

      {/* Savings Banner */}
      <AnimatePresence mode="wait">
        {isYearly && (
          <motion.div
           
           
           
           
          >
            <div>
              <Zap />
              <span>Get 2 months free with yearly billing!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Cards */}
      <div>
        {plans.map((plan, index) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const isMiddle = index === 1;
          
          return (
            <motion.div
              key={plan.id}
             
             
             
             
            >
              <Card
               
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div>
                    <Badge>
                      <Star />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Card Header */}
                <div>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>

                  {/* Pricing */}
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isYearly ? 'yearly' : 'monthly'}
                       
                       
                       
                       
                      >
                        <span>
                          ${isYearly && plan.yearlyMonthlyPrice ? Math.floor(plan.yearlyMonthlyPrice) : price}
                        </span>
                        {price > 0 && (
                          <span>
                            /{isYearly ? 'month' : 'month'}
                          </span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Yearly pricing details */}
                  {isYearly && plan.savings && (
                    <motion.div
                     
                     
                     
                    >
                      <p>
                        <span>${plan.monthlyPrice * 12}</span>
                        <span>${plan.yearlyPrice}/year</span>
                      </p>
                      <Badge variant="outline">
                        You save ${plan.savings}
                      </Badge>
                    </motion.div>
                  )}

                  {/* Free plan specifics */}
                  {plan.id === 'free' && (
                    <p>
                      10 Quotes/Month Limit
                    </p>
                  )}
                </div>

                {/* Features */}
                <div>
                  <TooltipProvider>
                    <ul>
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                         
                        >
                          <Check
                           
                          />
                          <span>
                            {feature.text}
                            {feature.text.includes('API') && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle />
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
                  <div>
                    {plan.id === 'free' ? (
                      <Button
                        size="lg"
                        variant={plan.ctaVariant}
                       
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
       
       
       
       
      >
        <div>
          {[...Array(5)].map((_, i) => (
            <Star key={i} />
          ))}
        </div>
        <p>
          Trusted by <span>5,000+</span> painting contractors
        </p>
        <p>
          Average ROI: <span>278%</span> in the first 90 days
        </p>
      </motion.div>
    </div>
  );
}