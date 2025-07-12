# Onboarding and Upgrade Prompts Integration Guide

## Overview

This document describes the integration of value onboarding and upgrade prompts into the ProPaint Quote dashboard. The implementation focuses on maximizing user engagement and conversion through strategic timing and contextual prompts.

## Components

### 1. Enhanced Dashboard (`app/dashboard/enhanced-dashboard.tsx`)
The main dashboard component that integrates:
- Value onboarding flow for new users
- Usage statistics tracking
- Contextual upgrade prompts
- Performance insights

### 2. Value Onboarding (`components/ui/value-onboarding.tsx`)
A three-step onboarding flow that shows immediate value:
- **Quick Win**: Demo quote creation in 30 seconds
- **Personalize**: Add business information
- **First Real**: Create first actual quote

### 3. Upgrade Prompts (`components/ui/upgrade-prompts.tsx`)
Contextual upgrade prompts triggered by:
- **Quota Limits**: When approaching usage limits
- **Feature Locks**: When trying premium features
- **Success Moments**: After winning jobs
- **Time Saved**: Milestone achievements
- **Trial Ending**: Urgency before trial expires

### 4. User Progress Hook (`hooks/useUserProgress.ts`)
Tracks user progress and milestones:
- Onboarding completion
- Quotes created/accepted
- Revenue generated
- Feature usage
- Achievement milestones

## State Management

### Session Storage
- User authentication data
- Account type and limits
- Onboarding completion status

### Local Storage
- User progress metrics
- Feature usage statistics
- Achievement milestones

### API Endpoints
- `/api/user-stats`: Track user statistics
- `/api/onboarding`: Manage onboarding status

## Upgrade Prompt Triggers

### 1. Usage-Based Triggers
```typescript
// Triggered when usage exceeds 80%
if (usagePercentage >= 80) {
  showUpgradePrompt('quota-limit')
}
```

### 2. Time-Based Triggers
```typescript
// Trial ending reminder (3 days before)
if (daysLeft <= 3 && daysLeft > 0) {
  showUpgradePrompt('trial-ending')
}
```

### 3. Milestone-Based Triggers
```typescript
// Every 5 quotes created
if (quotesUsed > 5 && quotesUsed % 5 === 0) {
  showUpgradePrompt('time-saved')
}
```

## Implementation Details

### Onboarding Flow
1. Check if user is new (trial account without onboarding completion)
2. Show ValueOnboarding component
3. Track progress through each step
4. Mark complete in session storage

### Usage Tracking
1. Monitor quote creation and acceptance
2. Calculate time and money saved
3. Display progress in UsageStatsBar
4. Show ValueReminder after 3+ quotes

### Upgrade Prompts
1. Check triggers on dashboard load
2. Use setTimeout for natural timing
3. Show one prompt at a time
4. Track dismissals and conversions

## Best Practices

### Timing
- Show onboarding immediately for new users
- Delay upgrade prompts by 2-5 seconds
- Don't interrupt active workflows

### Frequency
- Maximum one prompt per session
- Respect dismissals for 24 hours
- Rotate prompt types

### Messaging
- Focus on value, not features
- Use specific numbers (hours saved, revenue)
- Create urgency without being pushy

## Testing

### Manual Testing
1. Create new trial account
2. Complete onboarding flow
3. Create multiple quotes
4. Observe upgrade prompt triggers

### Reset Testing Data
```bash
# Clear session storage (in browser console)
sessionStorage.clear()

# Clear local storage
localStorage.clear()

# Reset API data (using API endpoints)
DELETE /api/user-stats?userId=<userId>
DELETE /api/onboarding?userId=<userId>
```

## Analytics Tracking

### Events to Track
- Onboarding started/completed
- Upgrade prompt shown/dismissed/clicked
- Feature usage patterns
- Conversion points

### Metrics to Monitor
- Onboarding completion rate
- Time to first quote
- Upgrade prompt CTR
- Trial-to-paid conversion

## Future Enhancements

1. **A/B Testing**
   - Different onboarding flows
   - Prompt timing variations
   - Message copy testing

2. **Personalization**
   - Industry-specific examples
   - Usage pattern-based prompts
   - Custom success metrics

3. **Advanced Triggers**
   - Competitor comparison
   - Seasonal promotions
   - Team collaboration features