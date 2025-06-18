-- Subscription Management Schema for Freemium Model
-- Extends existing schema with subscription tracking, payment management, and usage monitoring

-- Subscription plans definition
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL NOT NULL DEFAULT 0,
  price_yearly DECIMAL NOT NULL DEFAULT 0,
  quote_limit INTEGER, -- NULL means unlimited
  features TEXT DEFAULT '{}', -- JSON object of enabled features
  is_active BOOLEAN DEFAULT TRUE,
  trial_days INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Company subscriptions tracking
CREATE TABLE IF NOT EXISTS company_subscriptions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  company_id INTEGER NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled', 'expired')),
  
  -- Billing cycle
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start DATETIME NOT NULL,
  current_period_end DATETIME NOT NULL,
  
  -- Trial management
  trial_start DATETIME,
  trial_end DATETIME,
  is_trial BOOLEAN DEFAULT FALSE,
  
  -- Usage tracking
  quotes_used_this_period INTEGER DEFAULT 0,
  quotes_remaining INTEGER,
  last_reset_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Payment tracking
  next_payment_date DATETIME,
  last_payment_date DATETIME,
  payment_failed_count INTEGER DEFAULT 0,
  grace_period_end DATETIME,
  
  -- Metadata
  subscription_data TEXT DEFAULT '{}', -- JSON for additional subscription info
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Payment history and transaction tracking
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  company_id INTEGER NOT NULL,
  subscription_id TEXT NOT NULL,
  
  -- Transaction details
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'disputed')),
  transaction_type TEXT DEFAULT 'subscription' CHECK (transaction_type IN ('subscription', 'setup', 'refund', 'adjustment')),
  
  -- Payment method and processor
  payment_method TEXT, -- 'stripe', 'paypal', 'manual', etc.
  payment_processor_id TEXT, -- external transaction ID
  payment_processor TEXT, -- 'stripe', 'paypal', etc.
  
  -- Billing period covered
  period_start DATETIME,
  period_end DATETIME,
  
  -- Failure handling
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_date DATETIME,
  
  -- Metadata
  metadata TEXT DEFAULT '{}', -- JSON for payment processor specific data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES company_subscriptions(id) ON DELETE CASCADE
);

-- Usage tracking for analytics and limits
CREATE TABLE IF NOT EXISTS usage_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  company_id INTEGER NOT NULL,
  subscription_id TEXT,
  
  -- Event details
  event_type TEXT NOT NULL, -- 'quote_created', 'quote_sent', 'quote_accepted', 'login', etc.
  event_data TEXT DEFAULT '{}', -- JSON with event-specific data
  
  -- Resource tracking
  resource_id TEXT, -- quote_id, user_id, etc.
  resource_type TEXT, -- 'quote', 'user', etc.
  
  -- Billing relevance
  billable BOOLEAN DEFAULT TRUE,
  quota_impact INTEGER DEFAULT 1, -- how much this event counts toward limits
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES company_subscriptions(id) ON DELETE SET NULL
);

-- Feature flags per company (for A/B testing and gradual rollouts)
CREATE TABLE IF NOT EXISTS company_features (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  company_id INTEGER NOT NULL,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  config TEXT DEFAULT '{}', -- JSON configuration for the feature
  granted_by TEXT, -- 'subscription', 'trial', 'admin_override'
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(company_id, feature_key)
);

-- Subscription change history (upgrades, downgrades, cancellations)
CREATE TABLE IF NOT EXISTS subscription_changes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  company_id INTEGER NOT NULL,
  subscription_id TEXT NOT NULL,
  
  -- Change details
  change_type TEXT NOT NULL CHECK (change_type IN ('upgrade', 'downgrade', 'cancel', 'reactivate', 'plan_change')),
  old_plan_id TEXT,
  new_plan_id TEXT,
  old_status TEXT,
  new_status TEXT,
  
  -- Financial impact
  proration_amount DECIMAL DEFAULT 0,
  effective_date DATETIME NOT NULL,
  
  -- Reason and context
  reason TEXT, -- 'user_request', 'payment_failure', 'admin_action', etc.
  initiated_by TEXT, -- 'customer', 'admin', 'system'
  notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES company_subscriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (old_plan_id) REFERENCES subscription_plans(id),
  FOREIGN KEY (new_plan_id) REFERENCES subscription_plans(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_status ON company_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_next_payment ON company_subscriptions(next_payment_date);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_company_id ON payment_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_events_company_id ON usage_events(company_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at);
CREATE INDEX IF NOT EXISTS idx_company_features_company_id ON company_features(company_id);
CREATE INDEX IF NOT EXISTS idx_subscription_changes_company_id ON subscription_changes(company_id);

-- Insert default subscription plans
INSERT OR IGNORE INTO subscription_plans (id, name, description, price_monthly, price_yearly, quote_limit, features, trial_days) VALUES
('plan_free', 'Free Trial', 'Free trial with 1 quote limit', 0, 0, 1, '{"setup_wizard": true, "basic_quotes": true, "email_support": true}', 7),
('plan_starter', 'Starter', 'Perfect for small contractors', 29, 290, 50, '{"setup_wizard": true, "basic_quotes": true, "favorite_products": true, "email_support": true, "phone_support": false}', 14),
('plan_professional', 'Professional', 'For growing painting businesses', 79, 790, 200, '{"setup_wizard": true, "basic_quotes": true, "favorite_products": true, "advanced_analytics": true, "custom_branding": true, "email_support": true, "phone_support": true}', 14),
('plan_business', 'Business', 'Unlimited quotes for established companies', 149, 1490, NULL, '{"setup_wizard": true, "basic_quotes": true, "favorite_products": true, "advanced_analytics": true, "custom_branding": true, "api_access": true, "priority_support": true, "email_support": true, "phone_support": true}', 14);

-- Triggers to update timestamps
CREATE TRIGGER IF NOT EXISTS update_subscription_plans_updated_at
  AFTER UPDATE ON subscription_plans
  BEGIN
    UPDATE subscription_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_company_subscriptions_updated_at
  AFTER UPDATE ON company_subscriptions
  BEGIN
    UPDATE company_subscriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Trigger to reset quote usage at period start
CREATE TRIGGER IF NOT EXISTS reset_quote_usage_on_period_change
  AFTER UPDATE OF current_period_start ON company_subscriptions
  WHEN NEW.current_period_start > OLD.current_period_start
  BEGIN
    UPDATE company_subscriptions 
    SET quotes_used_this_period = 0,
        last_reset_date = NEW.current_period_start
    WHERE id = NEW.id;
  END;