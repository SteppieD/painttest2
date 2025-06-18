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
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Unable to load subscription information</p>
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
    <div className="space-y-6">
      {/* Current Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Current Plan: {subscription.plan_name}
            <Badge className={getStatusColor(subscription.status)}>
              {subscription.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trial Warning */}
          {subscription.is_trial && analytics.trial_days_left !== undefined && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Trial ends in {analytics.trial_days_left} day{analytics.trial_days_left !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Upgrade now to continue creating quotes after your trial expires.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quote Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">This Period</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {subscription.quotes_used_this_period}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Remaining</p>
                  <p className="text-2xl font-bold text-green-900">
                    {subscription.quotes_remaining === null ? '∞' : subscription.quotes_remaining}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-700">Total Created</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {analytics.total_quotes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Progress Bar */}
          {subscription.quotes_remaining !== null && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quote Usage</span>
                <span>{subscription.quotes_used_this_period} / {subscription.quotes_used_this_period + subscription.quotes_remaining}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
          )}

          {/* Quota Warning */}
          {!quota.can_create_quote && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Quote Limit Reached</p>
                  <p className="text-sm text-red-700">{quota.quota_message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Button */}
          {(subscription.is_trial || !quota.can_create_quote) && (
            <Button 
              onClick={() => setShowUpgradeModal(true)} 
              className="w-full"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-gray-600">Upgrade to unlock more quotes and features</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlans.filter(plan => plan.id !== 'plan_free').map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-center">{plan.name}</CardTitle>
                    <div className="text-center">
                      <div className="text-3xl font-bold">${plan.pricing.monthly}</div>
                      <div className="text-sm text-gray-600">/month</div>
                      {plan.pricing.yearly_savings > 0 && (
                        <div className="text-sm text-green-600">
                          Save {plan.pricing.yearly_savings}% yearly
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="font-medium">
                        {plan.limits.unlimited_quotes 
                          ? 'Unlimited Quotes' 
                          : `${plan.limits.quotes_per_month} quotes/month`
                        }
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(plan.features).map(([feature, enabled]) => (
                        enabled && (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                          </div>
                        )
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'monthly')}
                        disabled={isUpgrading}
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {isUpgrading ? 'Upgrading...' : 'Choose Monthly'}
                      </Button>
                      
                      {plan.pricing.yearly > 0 && (
                        <Button
                          onClick={() => handleUpgrade(plan.id, 'yearly')}
                          disabled={isUpgrading}
                          className="w-full"
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
            
            <div className="p-6 border-t">
              <Button 
                onClick={() => setShowUpgradeModal(false)} 
                variant="outline" 
                className="w-full"
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