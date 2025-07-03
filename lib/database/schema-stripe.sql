-- Stripe Subscriptions and Payments Schema
-- This schema extends the existing database with Stripe-specific tables

-- Contractor Subscriptions (for contractors paying for the platform)
CREATE TABLE IF NOT EXISTS contractor_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active', -- active, canceled, past_due, trialing
  plan_type VARCHAR(50) DEFAULT 'monthly', -- monthly, yearly
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Stripe Connected Accounts (for contractors receiving payments)
CREATE TABLE IF NOT EXISTS contractor_stripe_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL UNIQUE,
  stripe_account_id VARCHAR(255) UNIQUE NOT NULL,
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  details_submitted BOOLEAN DEFAULT FALSE,
  account_type VARCHAR(50) DEFAULT 'express', -- express, standard, custom
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Quote Payments (for clients paying contractors)
CREATE TABLE IF NOT EXISTS quote_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_invoice_id VARCHAR(255),
  amount INTEGER NOT NULL, -- Amount in cents
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, succeeded, failed, refunded
  platform_fee INTEGER DEFAULT 0, -- Platform fee in cents
  contractor_payout INTEGER DEFAULT 0, -- Amount to contractor in cents
  payment_method_type VARCHAR(50), -- card, bank_transfer, etc
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Payment Links (shareable payment links for quotes)
CREATE TABLE IF NOT EXISTS payment_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  stripe_payment_link_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  url TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Invoices (for record keeping)
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  stripe_invoice_id VARCHAR(255) UNIQUE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, open, paid, void, uncollectible
  amount_due INTEGER NOT NULL, -- Amount in cents
  amount_paid INTEGER DEFAULT 0, -- Amount in cents
  currency VARCHAR(3) DEFAULT 'usd',
  due_date DATE,
  paid_at TIMESTAMP,
  pdf_url TEXT,
  hosted_invoice_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Webhook Events (for idempotency and debugging)
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  payload TEXT, -- JSON payload
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contractor_subscriptions_company ON contractor_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_contractor_subscriptions_status ON contractor_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_quote_payments_quote ON quote_payments(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_payments_status ON quote_payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_links_quote ON payment_links(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoices_quote ON invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type ON stripe_webhook_events(event_type);

-- Add Stripe-specific fields to existing tables
-- Note: These should be added via migration if tables already exist

-- Add to companies table if not exists
-- stripe_customer_id VARCHAR(255) - For subscription billing
-- stripe_account_id VARCHAR(255) - For receiving payments

-- Add to customers table if not exists  
-- stripe_customer_id VARCHAR(255) - For quote payments
-- email VARCHAR(255) - Required for Stripe

-- Add to quotes table if not exists
-- stripe_price_id VARCHAR(255) - For one-time products
-- payment_status VARCHAR(50) - pending, paid, failed
-- payment_link TEXT - Shareable payment URL