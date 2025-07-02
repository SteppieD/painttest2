import { NextRequest, NextResponse } from "next/server";
import { subscriptionManager } from "@/lib/subscription-manager";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const companyId = url.searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if company can create a quote
    const quotePermission = await subscriptionManager.canCreateQuote(parseInt(companyId));
    const subscription = await subscriptionManager.getCompanySubscription(parseInt(companyId));

    return NextResponse.json({
      success: true,
      can_create_quote: quotePermission.allowed,
      reason: quotePermission.reason,
      quotes_remaining: quotePermission.quotesRemaining,
      plan_name: quotePermission.planName,
      subscription: subscription ? {
        is_trial: subscription.is_trial,
        status: subscription.status,
        quotes_used_this_period: subscription.quotes_used_this_period,
        quotes_remaining: subscription.quotes_remaining,
        plan_name: subscription.plan_name,
        current_period_end: subscription.current_period_end
      } : null
    });

  } catch (error) {
    console.error("Quota check API error:", error);
    return NextResponse.json(
      { error: "Failed to check quota" },
      { status: 500 }
    );
  }
}