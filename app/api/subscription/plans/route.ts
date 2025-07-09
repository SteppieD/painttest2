import { NextRequest, NextResponse } from "next/server";
import { subscriptionManager } from "@/lib/subscription-manager";

export const dynamic = 'force-dynamic';

/**
 * Get available subscription plans
 */
export async function GET(request: NextRequest) {
  try {
    const plans = await subscriptionManager.getAvailablePlans();

    // Format plans for frontend consumption
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      pricing: {
        monthly: plan.price_monthly,
        yearly: plan.price_yearly,
        yearly_savings: plan.price_yearly > 0 ? 
          Math.round(((plan.price_monthly * 12) - plan.price_yearly) / (plan.price_monthly * 12) * 100) : 0
      },
      limits: {
        quotes_per_month: plan.quote_limit,
        unlimited_quotes: plan.quote_limit === null
      },
      features: plan.features,
      trial_days: plan.trial_days,
      popular: plan.id === 'plan_professional', // Mark popular plan
      best_value: plan.id === 'plan_business' // Mark best value
    }));

    return NextResponse.json({
      success: true,
      plans: formattedPlans
    });

  } catch (error) {
    console.error("Subscription plans API error:", error);
    return NextResponse.json(
      { error: "Failed to load subscription plans" },
      { status: 500 }
    );
  }
}