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
    <div>
      {/* Annual/Monthly Toggle */}
      <div>
        <Label htmlFor="annual-toggle">
          Monthly
        </Label>
        <Switch
          id="annual-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label htmlFor="annual-toggle">
          Annual
          <Badge>Save 20%</Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div>
        {plans.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          const displayPrice = plan.monthlyPrice === 0 
            ? '$0'
            : isAnnual 
              ? `$${plan.annualPrice}`
              : `$${plan.monthlyPrice}`;
          
          return (
            <Card 
              key={plan.planType} 
             `}
            >
              {plan.popular && (
                <div>
                  <Badge>
                    <Star />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div>{plan.tagline}</div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div>
                  <div>
                    <span>{displayPrice}</span>
                    {plan.monthlyPrice > 0 && (
                      <span>
                        {isAnnual ? '/year' : '/month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.annualSavings && (
                    <div>
                      <Badge variant="outline">
                        Save 20% (${plan.annualSavings}/year)
                      </Badge>
                      <p>
                        Only ${Math.round(plan.annualPrice / 12)}/month
                      </p>
                    </div>
                  )}
                  <div>
                    {plan.quotaLimit}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <CheckCircle />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div>
                    <p>Limitations:</p>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index}>
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {plan.testimonial && (
                  <div>
                    <p>
                      "{plan.testimonial.quote}"
                    </p>
                    <p>
                      - {plan.testimonial.author}
                    </p>
                    <p>
                      {plan.testimonial.revenue}
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                {plan.planType === 'free' ? (
                  <Button 
                    
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
                      ? (isAnnual ? process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID : process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID)
                      : (isAnnual ? process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID : process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID)
                    }
                    buttonText={plan.cta}
                  />
                ) : (
                  <Button 
                    
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
      <div>
        <p>
          ⚡ Most contractors see ROI within their first quote
        </p>
        <p>
          Join 5,000+ contractors who've increased their revenue with transparent pricing
        </p>
      </div>
    </div>
  );
}