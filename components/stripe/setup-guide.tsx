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
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
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
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              {getIcon(step.status)}
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
                <p className="text-sm text-blue-600 mt-1">{step.action}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Test Card Numbers</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>Success: 4242 4242 4242 4242</li>
            <li>Declined: 4000 0000 0000 0002</li>
            <li>3D Secure: 4000 0025 0000 3155</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}