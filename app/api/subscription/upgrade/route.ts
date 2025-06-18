import { NextRequest, NextResponse } from "next/server";
import { subscriptionManager } from "@/lib/subscription-manager";

export const dynamic = 'force-dynamic';

/**
 * Upgrade or change subscription plan
 */
export async function POST(request: NextRequest) {
  try {
    const { company_id, plan_id, billing_cycle = 'monthly' } = await request.json();

    if (!company_id || !plan_id) {
      return NextResponse.json(
        { error: "Company ID and plan ID are required" },
        { status: 400 }
      );
    }

    // Validate billing cycle
    if (!['monthly', 'yearly'].includes(billing_cycle)) {
      return NextResponse.json(
        { error: "Billing cycle must be 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }

    // Get available plans to validate the requested plan
    const availablePlans = subscriptionManager.getAvailablePlans();
    const targetPlan = availablePlans.find(p => p.id === plan_id);

    if (!targetPlan) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    // Change the subscription
    await subscriptionManager.changeSubscription(
      parseInt(company_id),
      plan_id,
      billing_cycle,
      'customer'
    );

    // Get updated subscription status
    const updatedSubscription = await subscriptionManager.getCompanySubscription(parseInt(company_id));

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${targetPlan.name} plan`,
      subscription: {
        plan_id: updatedSubscription?.plan_id,
        plan_name: targetPlan.name,
        billing_cycle: updatedSubscription?.billing_cycle,
        quotes_remaining: updatedSubscription?.quotes_remaining,
        next_billing_date: updatedSubscription?.current_period_end
      }
    });

  } catch (error) {
    console.error("Subscription upgrade API error:", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription. Please try again." },
      { status: 500 }
    );
  }
}