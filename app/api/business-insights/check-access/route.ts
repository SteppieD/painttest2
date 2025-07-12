import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth-middleware';
import { SubscriptionManager } from '@/lib/subscription-manager';

export async function GET(request: Request) {
  try {
    // Get authenticated company
    const authContext = await getAuthContext(request);
    if (!authContext || !authContext.companyId) {
      return NextResponse.json({ hasAccess: false, reason: 'Not authenticated' });
    }

    const subscriptionManager = new SubscriptionManager();
    
    // Check if company has access to business insights feature
    // This feature is only available for paid plans (not free trial)
    const hasAccess = await subscriptionManager.hasFeatureAccess(
      authContext.companyId, 
      'business_insights'
    );

    // Also check if they're on a paid plan (not just trial)
    const subscription = await subscriptionManager.getCompanySubscription(authContext.companyId);
    
    const isPaidPlan = subscription && 
      subscription.status === 'active' && 
      !subscription.is_trial &&
      subscription.plan_id !== 'plan_free';

    return NextResponse.json({ 
      hasAccess: hasAccess || isPaidPlan,
      subscription: subscription ? {
        planName: subscription.plan_name,
        status: subscription.status,
        isTrial: subscription.is_trial
      } : null
    });
  } catch (error) {
    console.error('Error checking business insights access:', error);
    return NextResponse.json({ hasAccess: false, error: 'Internal server error' }, { status: 500 });
  }
}