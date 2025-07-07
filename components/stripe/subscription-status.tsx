'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { formatAmountFromCents } from '@/lib/stripe/config';

interface SubscriptionStatusProps {
  companyId: number;
}

interface Subscription {
  id: number;
  status: string;
  plan_type: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function SubscriptionStatus({ companyId }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, [companyId]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}/subscription`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setPortalLoading(true);
      const response = await fetch('/api/stripe/create-customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { portalUrl } = await response.json();
      window.location.href = portalUrl;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to open billing portal',
        variant: 'destructive',
      });
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPlanName = (planType: string) => {
    return planType === 'yearly' ? 'Annual Plan' : 'Monthly Plan';
  };

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Subscribe to unlock all features and start accepting payments.
          </p>
          <Button onClick={() => window.location.href = '/pricing'}>
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const nextBillingDate = new Date(subscription.current_period_end).toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subscription Status</CardTitle>
          {getStatusBadge(subscription.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">{getPlanName(subscription.plan_type)}</p>
            <p className="text-sm text-gray-600">
              {subscription.cancel_at_period_end 
                ? `Cancels on ${nextBillingDate}`
                : `Renews on ${nextBillingDate}`
              }
            </p>
          </div>
        </div>

        {subscription.status === 'past_due' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              Your payment is past due. Please update your payment method.
            </p>
          </div>
        )}

        {subscription.status === 'active' && !subscription.cancel_at_period_end && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm">
              Your subscription is active and all features are enabled.
            </p>
          </div>
        )}

        <Button
          onClick={openCustomerPortal}
          disabled={portalLoading}
          variant="outline"
          className="w-full"
        >
          {portalLoading ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </CardContent>
    </Card>
  );
}