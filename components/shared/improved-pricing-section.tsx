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
    <div>
      <div>
        {/* Header Section - Bright & Engaging */}
        <div>
          <div>
            <div>
              <Palette />
            </div>
            <div>
              <h2>Simple, Transparent Pricing</h2>
              <p>Choose the perfect plan for your painting business</p>
            </div>
          </div>

          {/* Trust Indicator */}
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <span>Trusted by 5,000+ contractors</span>
          </div>

          {/* Billing Toggle - Bright Design */}
          <div>
            <div>
              <Label
                htmlFor="billing-toggle"
               `}
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
               `}
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
        </div>

        {/* Pricing Cards - Bright & Modern */}
        <div>
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const IconComponent = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
               
               
               
               `}
              >
                <Card
                  hover:${plan.borderColor.replace('200', '300')} hover:shadow-lg`
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div>
                      <Badge`}>
                        <Star />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Card Header - Colorful */}
                  <div rounded-t-lg border-b-2 ${plan.borderColor}`}>
                    <div>
                      <div`}>
                        <IconComponent`} />
                      </div>
                    </div>
                    
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>

                    {/* Pricing Display */}
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isYearly ? 'yearly' : 'monthly'}
                         
                         
                         
                         
                        >
                          <span>
                            ${isYearly && plan.yearlyMonthlyPrice ? Math.floor(plan.yearlyMonthlyPrice) : price}
                          </span>
                          {price > 0 && (
                            <span>/month</span>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Yearly Savings */}
                    {isYearly && plan.savings && (
                      <motion.div
                       
                       
                       
                      >
                        <p>
                          <span>${plan.monthlyPrice * 12}</span>
                          <span>${plan.yearlyPrice}/year</span>
                        </p>
                        <Badge>
                          You save ${plan.savings}
                        </Badge>
                      </motion.div>
                    )}

                    {/* Free Plan Note */}
                    {plan.id === 'free' && (
                      <p>
                        10 Quotes/Month Limit
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div>
                    <ul>
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                         `}
                        >
                          <div`}>
                            <Check
                             `}
                            />
                          </div>
                          <span`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div>
                      <Button
                        size="lg"
                       `}
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
                        <ArrowRight />
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
         
         
         
         
        >
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <div>4.9/5</div>
              <div>Customer Rating</div>
            </div>
            
            <div>
              <div>5,000+</div>
              <div>Active Contractors</div>
            </div>
            
            <div>
              <div>278%</div>
              <div>Average ROI in 90 days</div>
            </div>
          </div>
          
          <p>
            Join thousands of contractors who've increased their win rates
          </p>
        </motion.div>
      </div>
    </div>
  );
}