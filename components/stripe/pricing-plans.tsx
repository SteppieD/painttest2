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
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.planType} className={plan.badge ? 'border-2 border-blue-500' : ''}>
          {plan.badge && (
            <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
              {plan.badge}
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-600">/{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
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
              <p className="text-center text-sm text-gray-600 w-full">
                Sign in to subscribe
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}