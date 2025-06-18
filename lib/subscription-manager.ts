/**
 * Subscription Management System
 * Handles freemium model, quota tracking, payment management, and feature access
 */

import { getDatabase } from './database/init';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  quote_limit: number | null; // null = unlimited
  features: Record<string, boolean>;
  trial_days: number;
}

export interface CompanySubscription {
  id: string;
  company_id: number;
  plan_id: string;
  plan_name: string;
  status: 'trial' | 'active' | 'suspended' | 'cancelled' | 'expired';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  is_trial: boolean;
  quotes_used_this_period: number;
  quotes_remaining: number | null;
  next_payment_date?: string;
  last_payment_date?: string;
  payment_failed_count: number;
  grace_period_end?: string;
  features?: Record<string, boolean>;
}

export interface UsageEvent {
  company_id: number;
  event_type: string;
  event_data?: Record<string, any>;
  resource_id?: string;
  resource_type?: string;
  billable?: boolean;
  quota_impact?: number;
}

export class SubscriptionManager {
  private db = getDatabase();

  /**
   * Get company's current subscription status
   */
  async getCompanySubscription(companyId: number): Promise<CompanySubscription | null> {
    try {
      const subscription = this.db.prepare(`
        SELECT cs.*, sp.quote_limit, sp.name as plan_name, sp.features
        FROM company_subscriptions cs
        JOIN subscription_plans sp ON cs.plan_id = sp.id
        WHERE cs.company_id = ? AND cs.status IN ('trial', 'active')
        ORDER BY cs.created_at DESC
        LIMIT 1
      `).get(companyId) as any;

      if (!subscription) {
        return null;
      }

      // Calculate quotes remaining
      const quotesRemaining = subscription.quote_limit 
        ? Math.max(0, subscription.quote_limit - subscription.quotes_used_this_period)
        : null; // unlimited

      return {
        ...subscription,
        features: JSON.parse(subscription.features || '{}'),
        quotes_remaining: quotesRemaining
      };
    } catch (error) {
      console.error('Error getting company subscription:', error);
      return null;
    }
  }

  /**
   * Check if company can create a new quote
   */
  async canCreateQuote(companyId: number): Promise<{
    allowed: boolean;
    reason?: string;
    quotesRemaining?: number | null;
    planName?: string;
  }> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      
      if (!subscription) {
        return {
          allowed: false,
          reason: 'No active subscription found'
        };
      }

      // Check if subscription is expired or suspended
      if (subscription.status === 'expired' || subscription.status === 'suspended') {
        return {
          allowed: false,
          reason: `Subscription is ${subscription.status}`,
          planName: subscription.plan_name
        };
      }

      // Check trial expiration
      if (subscription.is_trial && subscription.trial_end) {
        const trialEnd = new Date(subscription.trial_end);
        if (new Date() > trialEnd) {
          await this.expireSubscription(companyId, 'trial_expired');
          return {
            allowed: false,
            reason: 'Trial period has expired',
            planName: subscription.plan_name
          };
        }
      }

      // Check quote limits
      if (subscription.quotes_remaining !== null && subscription.quotes_remaining <= 0) {
        return {
          allowed: false,
          reason: 'Quote limit reached for current billing period',
          quotesRemaining: 0,
          planName: subscription.plan_name
        };
      }

      return {
        allowed: true,
        quotesRemaining: subscription.quotes_remaining,
        planName: subscription.plan_name
      };
    } catch (error) {
      console.error('Error checking quote creation permission:', error);
      return {
        allowed: false,
        reason: 'System error checking permissions'
      };
    }
  }

  /**
   * Record quote creation and update usage
   */
  async recordQuoteCreation(companyId: number, quoteId: string): Promise<void> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Start transaction
      const updateUsage = this.db.prepare(`
        UPDATE company_subscriptions 
        SET quotes_used_this_period = quotes_used_this_period + 1
        WHERE company_id = ? AND status IN ('trial', 'active')
      `);

      const recordEvent = this.db.prepare(`
        INSERT INTO usage_events (
          company_id, subscription_id, event_type, event_data, 
          resource_id, resource_type, billable, quota_impact
        ) VALUES (?, ?, 'quote_created', ?, ?, 'quote', 1, 1)
      `);

      // Execute in transaction
      this.db.transaction(() => {
        updateUsage.run(companyId);
        recordEvent.run(
          companyId, 
          subscription.id, 
          JSON.stringify({ quote_id: quoteId }), 
          quoteId
        );
      })();

      console.log(`📊 Quote creation recorded for company ${companyId}, quote ${quoteId}`);
    } catch (error) {
      console.error('Error recording quote creation:', error);
      throw error;
    }
  }

  /**
   * Create trial subscription for new company
   */
  async createTrialSubscription(companyId: number, planId: string = 'plan_free'): Promise<void> {
    try {
      const plan = this.db.prepare(`
        SELECT * FROM subscription_plans WHERE id = ?
      `).get(planId) as any;

      if (!plan) {
        throw new Error(`Plan ${planId} not found`);
      }

      const trialStart = new Date();
      const trialEnd = new Date(trialStart.getTime() + (plan.trial_days * 24 * 60 * 60 * 1000));
      const periodEnd = new Date(trialStart.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

      const insertSubscription = this.db.prepare(`
        INSERT INTO company_subscriptions (
          company_id, plan_id, status, billing_cycle,
          current_period_start, current_period_end,
          trial_start, trial_end, is_trial,
          quotes_used_this_period, quotes_remaining
        ) VALUES (?, ?, 'trial', 'monthly', ?, ?, ?, ?, 1, 0, ?)
      `);

      insertSubscription.run(
        companyId,
        planId,
        trialStart.toISOString(),
        periodEnd.toISOString(),
        trialStart.toISOString(),
        trialEnd.toISOString(),
        plan.quote_limit
      );

      console.log(`✅ Trial subscription created for company ${companyId} with plan ${planId}`);
    } catch (error) {
      console.error('Error creating trial subscription:', error);
      throw error;
    }
  }

  /**
   * Upgrade/downgrade subscription
   */
  async changeSubscription(
    companyId: number, 
    newPlanId: string, 
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    initiatedBy: string = 'customer'
  ): Promise<void> {
    try {
      const currentSubscription = await this.getCompanySubscription(companyId);
      if (!currentSubscription) {
        throw new Error('No current subscription found');
      }

      const newPlan = this.db.prepare(`
        SELECT * FROM subscription_plans WHERE id = ?
      `).get(newPlanId) as any;

      if (!newPlan) {
        throw new Error(`Plan ${newPlanId} not found`);
      }

      const now = new Date();
      const periodLength = billingCycle === 'yearly' ? 365 : 30;
      const nextPeriodEnd = new Date(now.getTime() + (periodLength * 24 * 60 * 60 * 1000));

      // Start transaction
      const updateSubscription = this.db.prepare(`
        UPDATE company_subscriptions 
        SET plan_id = ?, billing_cycle = ?, status = 'active',
            current_period_start = ?, current_period_end = ?,
            is_trial = 0, quotes_used_this_period = 0,
            quotes_remaining = ?
        WHERE company_id = ? AND id = ?
      `);

      const recordChange = this.db.prepare(`
        INSERT INTO subscription_changes (
          company_id, subscription_id, change_type,
          old_plan_id, new_plan_id, old_status, new_status,
          effective_date, initiated_by
        ) VALUES (?, ?, 'plan_change', ?, ?, ?, 'active', ?, ?)
      `);

      this.db.transaction(() => {
        updateSubscription.run(
          newPlanId,
          billingCycle,
          now.toISOString(),
          nextPeriodEnd.toISOString(),
          newPlan.quote_limit,
          companyId,
          currentSubscription.id
        );

        recordChange.run(
          companyId,
          currentSubscription.id,
          currentSubscription.plan_id,
          newPlanId,
          currentSubscription.status,
          now.toISOString(),
          initiatedBy
        );
      })();

      console.log(`🔄 Subscription changed for company ${companyId} to plan ${newPlanId}`);
    } catch (error) {
      console.error('Error changing subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(companyId: number, reason: string = 'user_request'): Promise<void> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      const now = new Date();
      
      const updateSubscription = this.db.prepare(`
        UPDATE company_subscriptions 
        SET status = 'cancelled'
        WHERE company_id = ? AND id = ?
      `);

      const recordChange = this.db.prepare(`
        INSERT INTO subscription_changes (
          company_id, subscription_id, change_type,
          old_status, new_status, effective_date, reason, initiated_by
        ) VALUES (?, ?, 'cancel', ?, 'cancelled', ?, ?, 'customer')
      `);

      this.db.transaction(() => {
        updateSubscription.run(companyId, subscription.id);
        recordChange.run(
          companyId,
          subscription.id,
          subscription.status,
          now.toISOString(),
          reason
        );
      })();

      console.log(`❌ Subscription cancelled for company ${companyId}`);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Expire subscription (trial ended, payment failed, etc.)
   */
  async expireSubscription(companyId: number, reason: string): Promise<void> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      if (!subscription) {
        return; // Already expired or not found
      }

      const now = new Date();
      
      const updateSubscription = this.db.prepare(`
        UPDATE company_subscriptions 
        SET status = 'expired'
        WHERE company_id = ? AND id = ?
      `);

      const recordChange = this.db.prepare(`
        INSERT INTO subscription_changes (
          company_id, subscription_id, change_type,
          old_status, new_status, effective_date, reason, initiated_by
        ) VALUES (?, ?, 'cancel', ?, 'expired', ?, ?, 'system')
      `);

      this.db.transaction(() => {
        updateSubscription.run(companyId, subscription.id);
        recordChange.run(
          companyId,
          subscription.id,
          subscription.status,
          now.toISOString(),
          reason
        );
      })();

      console.log(`⏰ Subscription expired for company ${companyId}: ${reason}`);
    } catch (error) {
      console.error('Error expiring subscription:', error);
      throw error;
    }
  }

  /**
   * Get usage analytics for company
   */
  async getUsageAnalytics(companyId: number, days: number = 30): Promise<{
    totalQuotes: number;
    quotesThisPeriod: number;
    quotesRemaining: number | null;
    dailyUsage: Array<{ date: string; quotes: number }>;
    planName: string;
    isTrialActive: boolean;
    trialDaysLeft?: number;
  }> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Get total quotes for the company
      const totalQuotes = this.db.prepare(`
        SELECT COUNT(*) as count FROM quotes WHERE company_id = ?
      `).get(companyId) as any;

      // Get daily usage for the last N days
      const dailyUsage = this.db.prepare(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as quotes
        FROM usage_events 
        WHERE company_id = ? 
          AND event_type = 'quote_created'
          AND created_at >= date('now', '-${days} days')
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `).all(companyId) as any[];

      // Calculate trial days left
      let trialDaysLeft: number | undefined;
      if (subscription.is_trial && subscription.trial_end) {
        const trialEnd = new Date(subscription.trial_end);
        const now = new Date();
        const msLeft = trialEnd.getTime() - now.getTime();
        trialDaysLeft = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
      }

      return {
        totalQuotes: totalQuotes?.count || 0,
        quotesThisPeriod: subscription.quotes_used_this_period,
        quotesRemaining: subscription.quotes_remaining,
        dailyUsage,
        planName: subscription.plan_name,
        isTrialActive: subscription.is_trial,
        trialDaysLeft
      };
    } catch (error) {
      console.error('Error getting usage analytics:', error);
      throw error;
    }
  }

  /**
   * Get all available subscription plans
   */
  getAvailablePlans(): SubscriptionPlan[] {
    try {
      const plans = this.db.prepare(`
        SELECT * FROM subscription_plans 
        WHERE is_active = 1 
        ORDER BY price_monthly ASC
      `).all() as any[];

      return plans.map(plan => ({
        ...plan,
        features: JSON.parse(plan.features || '{}')
      }));
    } catch (error) {
      console.error('Error getting available plans:', error);
      return [];
    }
  }

  /**
   * Check if company has access to a specific feature
   */
  async hasFeatureAccess(companyId: number, featureKey: string): Promise<boolean> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      if (!subscription) {
        return false;
      }

      // Check if feature is included in their plan
      const planFeatures = subscription.features || {};
      if (planFeatures[featureKey]) {
        return true;
      }

      // Check for individual feature overrides
      const featureOverride = this.db.prepare(`
        SELECT enabled FROM company_features 
        WHERE company_id = ? AND feature_key = ?
          AND (expires_at IS NULL OR expires_at > datetime('now'))
      `).get(companyId, featureKey) as any;

      return featureOverride?.enabled || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  /**
   * Initialize subscription system for existing companies
   */
  async migrateExistingCompanies(): Promise<void> {
    try {
      // Find companies without subscriptions
      const companiesWithoutSubs = this.db.prepare(`
        SELECT c.id, c.is_trial, c.quote_limit
        FROM companies c
        LEFT JOIN company_subscriptions cs ON c.id = cs.company_id
        WHERE cs.id IS NULL
      `).all() as any[];

      console.log(`🔄 Migrating ${companiesWithoutSubs.length} companies to subscription system`);

      for (const company of companiesWithoutSubs) {
        const planId = company.is_trial ? 'plan_free' : 'plan_starter';
        await this.createTrialSubscription(company.id, planId);
      }

      console.log('✅ Migration completed');
    } catch (error) {
      console.error('Error migrating existing companies:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const subscriptionManager = new SubscriptionManager();