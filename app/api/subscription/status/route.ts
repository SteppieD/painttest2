import { NextRequest, NextResponse } from "next/server";
import { subscriptionManager } from "@/lib/subscription-manager";

export const dynamic = 'force-dynamic';

/**
 * Get subscription status and quota information for a company
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const companyId = url.searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Get subscription details
    const subscription = await subscriptionManager.getCompanySubscription(parseInt(companyId));
    
    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Check quote creation permission
    const quotePermission = await subscriptionManager.canCreateQuote(parseInt(companyId));

    // Get usage analytics
    const analytics = await subscriptionManager.getUsageAnalytics(parseInt(companyId));

    return NextResponse.json({
      success: true,
      subscription: {
        plan_id: subscription.plan_id,
        plan_name: subscription.plan_name,
        status: subscription.status,
        billing_cycle: subscription.billing_cycle,
        is_trial: subscription.is_trial,
        trial_end: subscription.trial_end,
        current_period_end: subscription.current_period_end,
        quotes_used_this_period: subscription.quotes_used_this_period,
        quotes_remaining: subscription.quotes_remaining,
        features: subscription.features
      },
      quota: {
        can_create_quote: quotePermission.allowed,
        quota_message: quotePermission.reason,
        quotes_remaining: quotePermission.quotesRemaining
      },
      analytics: {
        total_quotes: analytics.totalQuotes,
        quotes_this_period: analytics.quotesThisPeriod,
        trial_days_left: analytics.trialDaysLeft,
        daily_usage: analytics.dailyUsage.slice(0, 7) // Last 7 days
      }
    });

  } catch (error) {
    console.error("Subscription status API error:", error);
    return NextResponse.json(
      { error: "Failed to load subscription status" },
      { status: 500 }
    );
  }
}