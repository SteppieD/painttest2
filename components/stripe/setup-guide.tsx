import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

export function StripeSetupGuide() {
  const steps = [
    {
      title: 'Test Mode Active',
      description: 'You are currently using test API keys. No real payments will be processed.',
      status: 'complete',
      action: 'Test keys are configured',
    },
    {
      title: 'Create Subscription Products',
      description: 'Set up your monthly and yearly subscription products in Stripe Dashboard.',
      status: 'pending',
      action: 'Go to Stripe Dashboard → Products',
    },
    {
      title: 'Configure Webhooks',
      description: 'Set up webhook endpoints to receive real-time payment updates.',
      status: 'pending',
      action: 'Add webhook endpoint: /api/stripe/webhook',
    },
    {
      title: 'Enable Customer Portal',
      description: 'Configure the customer portal for subscription management.',
      status: 'pending',
      action: 'Go to Stripe Dashboard → Settings → Billing → Customer portal',
    },
    {
      title: 'Switch to Live Mode',
      description: 'When ready, replace test keys with live keys.',
      status: 'pending',
      action: 'Update .env.local with live keys',
    },
  ];

  const getIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle />;
      case 'pending':
        return <Circle />;
      default:
        return <AlertCircle />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Setup Guide</CardTitle>
        <CardDescription>
          Complete these steps to fully configure Stripe payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {steps.map((step, index) => (
            <div key={index}>
              {getIcon(step.status)}
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <p>{step.action}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4>Test Card Numbers</h4>
          <ul>
            <li>Success: 4242 4242 4242 4242</li>
            <li>Declined: 4000 0000 0000 0002</li>
            <li>3D Secure: 4000 0025 0000 3155</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}