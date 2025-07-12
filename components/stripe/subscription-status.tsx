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
        <CardContent>
          <div>
            <div></div>
            <div></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge>Active</Badge>;
      case 'trialing':
        return <Badge>Trial</Badge>;
      case 'past_due':
        return <Badge>Past Due</Badge>;
      case 'canceled':
        return <Badge>Canceled</Badge>;
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
          <p>
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
        <div>
          <CardTitle>Subscription Status</CardTitle>
          {getStatusBadge(subscription.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <CreditCard />
          <div>
            <p>{getPlanName(subscription.plan_type)}</p>
            <p>
              {subscription.cancel_at_period_end 
                ? `Cancels on ${nextBillingDate}`
                : `Renews on ${nextBillingDate}`
              }
            </p>
          </div>
        </div>

        {subscription.status === 'past_due' && (
          <div>
            <AlertCircle />
            <p>
              Your payment is past due. Please update your payment method.
            </p>
          </div>
        )}

        {subscription.status === 'active' && !subscription.cancel_at_period_end && (
          <div>
            <CheckCircle />
            <p>
              Your subscription is active and all features are enabled.
            </p>
          </div>
        )}

        <Button
          onClick={openCustomerPortal}
          disabled={portalLoading}
          variant="outline"
         
        >
          {portalLoading ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </CardContent>
    </Card>
  );
}