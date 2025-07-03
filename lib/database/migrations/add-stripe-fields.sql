-- Migration: Add Stripe fields to existing tables
-- Run this after the main schema to add Stripe-specific columns

-- Add Stripe fields to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255);

-- Add Stripe fields to customers table  
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add Stripe fields to quotes table
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_link TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS stripe_invoice_id VARCHAR(255);

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer ON companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_account ON companies(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_payment_status ON quotes(payment_status);