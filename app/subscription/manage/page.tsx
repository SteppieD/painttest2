'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Calendar, Download, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface SubscriptionData {
  plan: string;
  status: string;
  nextBillingDate: string;
  amount: number;
  lastPayment?: {
    date: string;
    amount: number;
    receiptUrl?: string;
  };
}

export default function ManageSubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching subscription data
    const timer = setTimeout(() => {
      setSubscription({
        plan: 'Professional',
        status: 'active',
        nextBillingDate: '2025-08-15',
        amount: 99,
        lastPayment: {
          date: '2025-07-15',
          amount: 99,
          receiptUrl: '#'
        }
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div>
        <div>
          <Card>
            <CardContent>
              <div>
                <AlertCircle />
                <h2>No Active Subscription</h2>
                <p>You don't have an active subscription yet.</p>
                <Link href="/pricing">
                  <Button>View Plans</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Manage Subscription</h1>

        <div>
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <h3>{subscription.plan} Plan</h3>
                    <p>
                      ${subscription.amount}/month
                    </p>
                  </div>
                  <span>
                    {subscription.status === 'active' ? 'Active' : subscription.status}
                  </span>
                </div>

                <div>
                  <div>
                    <Calendar />
                    Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent payments and invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.lastPayment && (
                <div>
                  <div>
                    <div>
                      <p>
                        {new Date(subscription.lastPayment.date).toLocaleDateString()}
                      </p>
                      <p>
                        ${subscription.lastPayment.amount} - {subscription.plan} Plan
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(subscription.lastPayment?.receiptUrl, '_blank')}
                    >
                      <Download />
                      Receipt
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Actions</CardTitle>
              <CardDescription>Manage your subscription settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Button variant="outline">
                  <CreditCard />
                  Update Payment Method
                </Button>
                <Button variant="outline">
                  <Settings />
                  Change Plan
                </Button>
                <Button variant="outline">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}