'use client';

import { useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckoutForm } from './checkout-form';
import { Button } from '@/components/ui/button';

interface PricingPlansV2Props {
  companyId?: number;
}

export function PricingPlansV2({ companyId }: PricingPlansV2Props) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Perfect Start',
      tagline: 'Free Forever',
      description: 'Perfect for Solo Contractors',
      monthlyPrice: 0,
      annualPrice: 0,
      planType: 'free' as const,
      quotaLimit: '10 Quotes/Month',
      features: [
        '10 professional quotes per month',
        'All core features included',
        'Mobile app access',
        'Professional branded templates',
        'Basic customer management',
        'PDF quote generation',
        'Email support',
      ],
      limitations: [
        '10 quotes monthly limit',
        'Email support only',
      ],
      cta: 'Start Free Forever',
      testimonial: {
        quote: 'Perfect for my solo business. Win rate went from 25% to 45% with professional quotes.',
        author: 'Mike J.',
        revenue: 'Average revenue increase: $2,800/month',
      },
    },
    {
      name: 'Professional',
      tagline: 'Most Popular',
      description: 'For Active Contractors',
      monthlyPrice: 79,
      annualPrice: 758,
      annualSavings: 190,
      planType: 'professional' as const,
      quotaLimit: 'Unlimited',
      popular: true,
      features: [
        'Unlimited quotes per month',
        'All features included',
        'Mobile app access',
        'Custom branding & logos',
        'Customer management system',
        'Quote templates library',
        'Analytics dashboard',
        'Digital signatures',
        'Payment processing',
        'Automated follow-ups',
        'Priority phone support',
        'QuickBooks integration',
      ],
      cta: 'Start 14-Day Trial',
      testimonial: {
        quote: 'ROI paid for itself with the first job. Win rate went from 30% to 65%.',
        author: 'Sarah M.',
        revenue: 'ROI: 12,600% annually',
      },
    },
    {
      name: 'Business',
      tagline: 'Best Value',
      description: 'For Growing Teams',
      monthlyPrice: 149,
      annualPrice: 1430,
      annualSavings: 358,
      planType: 'business' as const,
      quotaLimit: 'Unlimited',
      features: [
        'Everything in Professional, plus:',
        'Multi-user access (up to 5 team members)',
        'Advanced analytics & reporting',
        'Multi-location management',
        'Team collaboration tools',
        'API access for integrations',
        'Custom quote workflows',
        'Bulk operations',
        'Advanced paint database (50k+ colors)',
        'White-label options',
        'Dedicated success manager',
        'Crew assignment tools',
      ],
      cta: 'Start 14-Day Trial',
      testimonial: {
        quote: 'Managing 3 crews across 2 cities is now effortless. Profit margins up 25%.',
        author: 'Tom W.',
        revenue: 'Enterprise ROI: $25,200 revenue increase',
      },
    },
  ];

  return (
    <div className="w-full">
      {/* Annual/Monthly Toggle */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <Label htmlFor="annual-toggle" className="text-base font-medium">
          Monthly
        </Label>
        <Switch
          id="annual-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label htmlFor="annual-toggle" className="text-base font-medium">
          Annual
          <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          const displayPrice = isAnnual && plan.annualPrice > 0 
            ? `$${Math.round(plan.annualPrice / 12)}`
            : `$${plan.monthlyPrice}`;
          
          return (
            <Card 
              key={plan.planType} 
              className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pt-8">
                <div className="text-sm font-semibold text-gray-600">{plan.tagline}</div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">{displayPrice}</span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-600 ml-2">
                        /{isAnnual ? 'month' : 'per month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.annualSavings && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-green-600">
                        Save ${plan.annualSavings}/year
                      </Badge>
                    </div>
                  )}
                  <div className="text-lg font-semibold text-blue-600 mt-2">
                    {plan.quotaLimit}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-600 mb-2">Limitations:</p>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {plan.testimonial && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm italic text-gray-700">
                      "{plan.testimonial.quote}"
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      - {plan.testimonial.author}
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      {plan.testimonial.revenue}
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                {plan.planType === 'free' ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => window.location.href = '/trial-signup'}
                  >
                    {plan.cta}
                  </Button>
                ) : companyId ? (
                  <CheckoutForm
                    companyId={companyId}
                    planType={isAnnual ? 'yearly' : 'monthly'}
                    priceId={plan.planType === 'professional' 
                      ? (isAnnual ? process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID : process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID)
                      : (isAnnual ? process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID : process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID)
                    }
                    buttonText={plan.cta}
                  />
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => window.location.href = '/access-code'}
                  >
                    Sign in to {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-lg text-gray-600 mb-4">
          ⚡ Most contractors see ROI within their first quote
        </p>
        <p className="text-sm text-gray-500">
          Join 5,000+ contractors who've increased their revenue with transparent pricing
        </p>
      </div>
    </div>
  );
}