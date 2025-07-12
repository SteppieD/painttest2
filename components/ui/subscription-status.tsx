"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Users,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionInfo {
  subscription: {
    plan_id: string;
    plan_name: string;
    status: string;
    billing_cycle: string;
    is_trial: boolean;
    trial_end?: string;
    current_period_end: string;
    quotes_used_this_period: number;
    quotes_remaining: number | null;
    features: Record<string, boolean>;
  };
  quota: {
    can_create_quote: boolean;
    quota_message?: string;
    quotes_remaining?: number;
  };
  analytics: {
    total_quotes: number;
    quotes_this_period: number;
    trial_days_left?: number;
    daily_usage: Array<{ date: string; quotes: number }>;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  pricing: {
    monthly: number;
    yearly: number;
    yearly_savings: number;
  };
  limits: {
    quotes_per_month: number | null;
    unlimited_quotes: boolean;
  };
  features: Record<string, boolean>;
  trial_days: number;
  popular?: boolean;
  best_value?: boolean;
}

export function SubscriptionStatus({ companyId }: { companyId: string }) {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptionData();
    loadAvailablePlans();
  }, [companyId]);

  const loadSubscriptionData = async () => {
    try {
      const response = await fetch(`/api/subscription/status?company_id=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptionInfo(data);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailablePlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      if (response.ok) {
        const data = await response.json();
        setAvailablePlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to load available plans:', error);
    }
  };

  const handleUpgrade = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          plan_id: planId,
          billing_cycle: billingCycle
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Subscription Updated!",
          description: data.message,
          duration: 3000,
        });
        setShowUpgradeModal(false);
        loadSubscriptionData(); // Refresh data
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast({
        title: "Upgrade Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionInfo) {
    return (
      <Card>
        <CardContent>
          <p>Unable to load subscription information</p>
        </CardContent>
      </Card>
    );
  }

  const { subscription, quota, analytics } = subscriptionInfo;
  
  // Calculate usage percentage
  const usagePercentage = subscription.quotes_remaining !== null 
    ? ((subscription.quotes_used_this_period / (subscription.quotes_used_this_period + subscription.quotes_remaining)) * 100)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Current Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Crown />
            Current Plan: {subscription.plan_name}
            <Badge>
              {subscription.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Trial Warning */}
          {subscription.is_trial && analytics.trial_days_left !== undefined && (
            <div>
              <div>
                <AlertTriangle />
                <div>
                  <p>
                    Trial ends in {analytics.trial_days_left} day{analytics.trial_days_left !== 1 ? 's' : ''}
                  </p>
                  <p>
                    Upgrade now to continue creating quotes after your trial expires.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quote Usage */}
          <div>
            <div>
              <div>
                <Users />
                <div>
                  <p>This Period</p>
                  <p>
                    {subscription.quotes_used_this_period}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div>
                <CheckCircle2 />
                <div>
                  <p>Remaining</p>
                  <p>
                    {subscription.quotes_remaining === null ? '∞' : subscription.quotes_remaining}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div>
                <TrendingUp />
                <div>
                  <p>Total Created</p>
                  <p>
                    {analytics.total_quotes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Progress Bar */}
          {subscription.quotes_remaining !== null && (
            <div>
              <div>
                <span>Quote Usage</span>
                <span>{subscription.quotes_used_this_period} / {subscription.quotes_used_this_period + subscription.quotes_remaining}</span>
              </div>
              <Progress value={usagePercentage} />
            </div>
          )}

          {/* Quota Warning */}
          {!quota.can_create_quote && (
            <div>
              <div>
                <AlertTriangle />
                <div>
                  <p>Quote Limit Reached</p>
                  <p>{quota.quota_message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Button */}
          {(subscription.is_trial || !quota.can_create_quote) && (
            <Button 
              onClick={() => setShowUpgradeModal(true)} 
             
              size="lg"
            >
              <Zap />
              Upgrade Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div>
          <div>
            <div>
              <h2>Choose Your Plan</h2>
              <p>Upgrade to unlock more quotes and features</p>
            </div>
            
            <div>
              {availablePlans.filter(plan => plan.id !== 'plan_free').map((plan) => (
                <Card key={plan.id}`}>
                  {plan.popular && (
                    <div>
                      <Badge>
                        <Star />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div>
                      <div>${plan.pricing.monthly}</div>
                      <div>/month</div>
                      {plan.pricing.yearly_savings > 0 && (
                        <div>
                          Save {plan.pricing.yearly_savings}% yearly
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div>
                      <div>
                        {plan.limits.unlimited_quotes 
                          ? 'Unlimited Quotes' 
                          : `${plan.limits.quotes_per_month} quotes/month`
                        }
                      </div>
                    </div>
                    
                    <div>
                      {Object.entries(plan.features).map(([feature, enabled]) => (
                        enabled && (
                          <div key={feature}>
                            <CheckCircle2 />
                            <span>{feature.replace(/_/g, ' ')}</span>
                          </div>
                        )
                      ))}
                    </div>
                    
                    <div>
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'monthly')}
                        disabled={isUpgrading}
                       
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {isUpgrading ? 'Upgrading...' : 'Choose Monthly'}
                      </Button>
                      
                      {plan.pricing.yearly > 0 && (
                        <Button
                          onClick={() => handleUpgrade(plan.id, 'yearly')}
                          disabled={isUpgrading}
                         
                          variant="outline"
                        >
                          Choose Yearly (Save {plan.pricing.yearly_savings}%)
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <Button 
                onClick={() => setShowUpgradeModal(false)} 
                variant="outline" 
               
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}