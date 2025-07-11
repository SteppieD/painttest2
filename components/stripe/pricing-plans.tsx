'use client';

import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutForm } from './checkout-form';

interface PricingPlansProps {
  companyId?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
}

export function PricingPlans({ 
  companyId, 
  monthlyPrice = 29, 
  yearlyPrice = 290 
}: PricingPlansProps) {
  const features = [
    'Unlimited professional quotes',
    'Mobile app access',
    'Customer management',
    'Payment processing',
    'Business analytics',
    'Email support',
    'Invoice generation',
    'Quote templates',
  ];

  const plans = [
    {
      name: 'Monthly',
      price: monthlyPrice,
      period: 'month',
      description: 'Perfect for getting started',
      planType: 'monthly' as const,
    },
    {
      name: 'Annual',
      price: yearlyPrice,
      period: 'year',
      description: 'Save 17% with annual billing',
      planType: 'yearly' as const,
      badge: 'Best Value',
    },
  ];

  return (
    <div>
      {plans.map((plan) => (
        <Card key={plan.planType}>
          {plan.badge && (
            <div>
              {plan.badge}
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div>
              <span>${plan.price}</span>
              <span>/{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul>
              {features.map((feature, index) => (
                <li key={index}>
                  <CheckCircle />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {companyId ? (
              <CheckoutForm
                companyId={companyId}
                planType={plan.planType}
                buttonText={`Start ${plan.name} Plan`}
              />
            ) : (
              <p>
                Sign in to subscribe
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}