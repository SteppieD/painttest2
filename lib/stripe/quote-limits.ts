import { getDatabase } from '@/lib/database/init';

interface QuoteUsage {
  quota_remaining: number;
  quota_limit: number;
  can_create_quote: boolean;
  subscription_plan: string;
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

export async function checkQuoteLimit(companyId: number): Promise<QuoteUsage> {
  const db = getDatabase();
  
  // Get company subscription plan
  const company = db.prepare('SELECT subscription_plan FROM companies WHERE id = ?').get(companyId) as any;
  const subscriptionPlan = company?.subscription_plan || 'free';
  
  // Non-free plans have unlimited quotes
  if (subscriptionPlan !== 'free') {
    return {
      quota_remaining: -1, // Unlimited
      quota_limit: -1,
      can_create_quote: true,
      subscription_plan: subscriptionPlan,
    };
  }
  
  // Check current month usage for free plan
  const currentMonth = getCurrentMonth();
  const usage = db.prepare(`
    SELECT quote_count FROM quote_usage 
    WHERE company_id = ? AND month = ?
  `).get(companyId, currentMonth) as any;
  
  const quoteCount = usage?.quote_count || 0;
  const quotaLimit = 10;
  const quotaRemaining = Math.max(0, quotaLimit - quoteCount);
  
  return {
    quota_remaining: quotaRemaining,
    quota_limit: quotaLimit,
    can_create_quote: quotaRemaining > 0,
    subscription_plan: subscriptionPlan,
  };
}

export async function incrementQuoteUsage(companyId: number): Promise<void> {
  const db = getDatabase();
  const currentMonth = getCurrentMonth();
  
  // Upsert quote usage
  db.prepare(`
    INSERT INTO quote_usage (company_id, month, quote_count)
    VALUES (?, ?, 1)
    ON CONFLICT(company_id, month) DO UPDATE SET
      quote_count = quote_count + 1,
      updated_at = CURRENT_TIMESTAMP
  `).run(companyId, currentMonth);
}

export async function getQuoteUsageStats(companyId: number) {
  const db = getDatabase();
  
  // Get usage for last 12 months
  const stats = db.prepare(`
    SELECT month, quote_count
    FROM quote_usage
    WHERE company_id = ?
    ORDER BY month DESC
    LIMIT 12
  `).all(companyId);
  
  return stats;
}

// Update company subscription plan when they upgrade
export async function updateSubscriptionPlan(companyId: number, plan: 'free' | 'professional' | 'business') {
  const db = getDatabase();
  
  db.prepare(`
    UPDATE companies 
    SET subscription_plan = ?
    WHERE id = ?
  `).run(plan, companyId);
}