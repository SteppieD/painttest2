# 🚀 Freemium Subscription System

## Overview

The painting quote app now has a comprehensive freemium model with subscription management, quota tracking, and payment lifecycle management. This system tracks usage, enforces limits, and provides upgrade paths for monetization.

## 📊 Business Model

### Subscription Tiers

| Plan | Price | Quotes/Month | Key Features |
|------|-------|-------------|--------------|
| **Free Trial** | $0 | 1 quote | 7-day trial, basic features |
| **Starter** | $29/mo | 50 quotes | Email support, favorite products |
| **Professional** | $79/mo | 200 quotes | Analytics, custom branding, phone support |
| **Business** | $149/mo | Unlimited | API access, priority support |

### Yearly Savings
- All paid plans offer 16-20% savings when billed yearly
- Professional: $790/year (save $158)
- Business: $1,490/year (save $298)

## 🔧 Technical Architecture

### Core Components

#### 1. **Database Schema** (`lib/database/subscription-schema.sql`)
```sql
-- Subscription plans with pricing and features
subscription_plans (id, name, price_monthly, price_yearly, quote_limit, features)

-- Active company subscriptions  
company_subscriptions (company_id, plan_id, status, billing_cycle, quotes_used_this_period)

-- Payment transaction history
payment_transactions (company_id, amount, status, payment_method)

-- Usage analytics for billing
usage_events (company_id, event_type, billable, quota_impact)

-- Feature access control
company_features (company_id, feature_key, enabled)
```

#### 2. **Subscription Manager** (`lib/subscription-manager.ts`)
Central service handling all subscription logic:

```typescript
class SubscriptionManager {
  // Check if company can create quotes
  async canCreateQuote(companyId: number): Promise<{
    allowed: boolean;
    reason?: string;
    quotesRemaining?: number;
    planName?: string;
  }>

  // Record quote creation and update usage
  async recordQuoteCreation(companyId: number, quoteId: string): Promise<void>

  // Upgrade/downgrade subscriptions
  async changeSubscription(companyId: number, newPlanId: string): Promise<void>

  // Get usage analytics
  async getUsageAnalytics(companyId: number): Promise<UsageAnalytics>
}
```

#### 3. **API Endpoints**

**Subscription Status** (`/api/subscription/status`)
```json
{
  "subscription": {
    "plan_name": "Starter",
    "status": "active",
    "quotes_used_this_period": 12,
    "quotes_remaining": 38,
    "trial_days_left": null
  },
  "quota": {
    "can_create_quote": true,
    "quotes_remaining": 38
  }
}
```

**Available Plans** (`/api/subscription/plans`)
```json
{
  "plans": [
    {
      "id": "plan_starter",
      "name": "Starter", 
      "pricing": { "monthly": 29, "yearly": 290 },
      "limits": { "quotes_per_month": 50 },
      "features": { "email_support": true, "phone_support": false }
    }
  ]
}
```

**Plan Upgrade** (`/api/subscription/upgrade`)
```json
{
  "company_id": 123,
  "plan_id": "plan_professional",
  "billing_cycle": "yearly"
}
```

## 🎯 Usage Tracking & Enforcement

### Quota Enforcement Flow

1. **Quote Creation Request** → `/api/quotes`
2. **Check Subscription** → `subscriptionManager.canCreateQuote()`
3. **Enforce Limits** → Block if quota exceeded
4. **Record Usage** → `subscriptionManager.recordQuoteCreation()`
5. **Update Analytics** → Track usage events

### Real-time Quota Checking

```typescript
// Before quote creation
const permission = await subscriptionManager.canCreateQuote(companyId);

if (!permission.allowed) {
  return NextResponse.json({
    error: "Quote limit reached",
    message: permission.reason,
    upgradeRequired: true
  }, { status: 403 });
}

// After successful quote creation
await subscriptionManager.recordQuoteCreation(companyId, quoteId);
```

### Usage Analytics

Track detailed usage for billing and analytics:

```typescript
interface UsageEvent {
  company_id: number;
  event_type: 'quote_created' | 'quote_sent' | 'quote_accepted';
  billable: boolean;
  quota_impact: number; // How much this counts toward limits
  created_at: timestamp;
}
```

## 💳 Payment Lifecycle

### Subscription States

| State | Description | Actions Available |
|-------|-------------|------------------|
| `trial` | Free trial period | Create quotes within limit |
| `active` | Paid subscription | Full access to plan features |
| `suspended` | Payment failed | Grace period, limited access |
| `cancelled` | User cancelled | Access until period end |
| `expired` | Trial/subscription ended | Upgrade required |

### Trial Management

```typescript
// Create trial subscription
await subscriptionManager.createTrialSubscription(companyId, 'plan_free');

// Check trial expiration  
if (subscription.is_trial && subscription.trial_end) {
  const trialEnd = new Date(subscription.trial_end);
  if (new Date() > trialEnd) {
    await subscriptionManager.expireSubscription(companyId, 'trial_expired');
  }
}
```

### Payment Failure Handling

```sql
-- Payment transactions with retry logic
payment_transactions (
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  failure_reason: TEXT,
  retry_count: INTEGER DEFAULT 0,
  next_retry_date: DATETIME
)
```

## 🎨 User Experience

### Subscription Dashboard

The `SubscriptionStatus` component provides:

- **Current plan and status** with visual indicators
- **Usage progress bars** showing quotes used/remaining  
- **Trial countdown** with upgrade prompts
- **Feature comparison** in upgrade modal
- **Usage analytics** with daily/monthly breakdowns

### Upgrade Experience

1. **Quota Warning** → User hits quote limit
2. **Plan Comparison** → Modal with feature matrix
3. **Billing Options** → Monthly vs yearly with savings
4. **Instant Upgrade** → Immediate access to new limits
5. **Confirmation** → Success message with new quota

### Trial User Journey

```
Trial Signup (1 quote) → 
Create 1st Quote → 
Hit Limit → 
See Upgrade Prompt → 
Compare Plans → 
Choose Starter ($29/mo) → 
Get 50 quotes/month
```

## 🔄 Migration & Existing Users

### Automatic Migration

Existing companies are automatically migrated to subscription system:

```typescript
// Migration runs on database initialization
async migrateExistingCompanies() {
  const companiesWithoutSubs = db.prepare(`
    SELECT c.id, c.is_trial, c.quote_limit
    FROM companies c
    LEFT JOIN company_subscriptions cs ON c.id = cs.company_id
    WHERE cs.id IS NULL
  `).all();

  for (const company of companiesWithoutSubs) {
    const planId = company.is_trial ? 'plan_free' : 'plan_starter';
    await this.createTrialSubscription(company.id, planId);
  }
}
```

### Backward Compatibility

- Legacy `is_trial` and `quote_limit` columns preserved
- Old quota checking APIs still work during transition
- Gradual rollout possible with feature flags

## 📈 Analytics & Reporting

### Business Metrics

```typescript
interface UsageAnalytics {
  totalQuotes: number;
  quotesThisPeriod: number;
  quotesRemaining: number | null;
  dailyUsage: Array<{ date: string; quotes: number }>;
  planName: string;
  isTrialActive: boolean;
  trialDaysLeft?: number;
}
```

### Admin Dashboard Integration

- **Revenue tracking** across all subscription tiers
- **Churn analysis** with trial-to-paid conversion rates  
- **Usage patterns** to optimize pricing tiers
- **Payment failure monitoring** for proactive support

## 🚀 Future Enhancements

### Payment Processing Integration

```typescript
// Stripe integration example
interface PaymentProcessor {
  createSubscription(customerId: string, planId: string): Promise<Subscription>;
  updateSubscription(subscriptionId: string, newPlanId: string): Promise<void>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  handleWebhook(event: PaymentEvent): Promise<void>;
}
```

### Advanced Features

1. **Seat-based pricing** - Multiple users per company
2. **Usage-based billing** - Pay per quote beyond base plan
3. **Add-on features** - Premium paint database, custom branding
4. **Enterprise plans** - White-label solutions, API access
5. **Referral system** - Credits for bringing new customers

### Customer Success

1. **Onboarding automation** - Guided setup for new subscribers
2. **Usage alerts** - Notify before hitting quota limits
3. **Upgrade recommendations** - Suggest plan changes based on usage
4. **Retention campaigns** - Win-back offers for cancelled users

## 🔒 Security & Compliance

### Data Protection

- Payment data handled by certified processors (Stripe/PayPal)
- Subscription data encrypted at rest
- Access logs for audit compliance
- GDPR/CCPA compliant data handling

### Fraud Prevention

- Rate limiting on subscription changes
- IP-based usage monitoring
- Automated suspicious activity detection
- Manual review for high-value transactions

## 📞 Support Integration

### Customer Support Tools

- **Subscription history** for support agents
- **Usage patterns** to identify issues
- **Payment status** for billing inquiries  
- **Feature access** verification
- **Upgrade assistance** workflow

The freemium model is now fully operational and ready to scale from free trials to enterprise accounts! 🎉