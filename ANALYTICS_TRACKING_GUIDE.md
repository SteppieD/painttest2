# Analytics Tracking Setup Guide

## 🎯 Overview
Your painting quote app now has comprehensive tracking with both Google Tag Manager (GTM-563BQKRH) and Google Analytics 4 (G-984BZ3LDZE).

## 📊 Events Being Tracked

### 1. Quote Creation Flow
- **begin_checkout** - When user starts creating a quote
- **add_to_cart** - When quote is calculated with pricing
- **purchase** - When quote is saved to database

### 2. Setup & Onboarding
- **tutorial_begin** - When user starts setup process
- **tutorial_complete** - When setup is completed
- **sign_up** - When user signs up for trial

### 3. User Journey
- **login** - When access code is used
- **page_view** - All page navigation
- **view_item_list** - Dashboard views
- **select_item** - Feature usage

### 4. Chat Interactions
- **chat_message** - Each user/AI message
- **chat_quote_ready** - When quote is ready

### 5. Admin Actions
- **admin_action** - Admin panel activities

## 🔧 GTM Events That Match Your Trigger

Your GTM trigger matches these events:
- `view_item` ✅
- `view_item_list` ✅  
- `select_item` ✅
- `add_to_cart` ✅
- `remove_from_cart` (not used yet)
- `view_cart` (not used yet)
- `begin_checkout` ✅
- `add_payment_info` (not used yet)
- `add_shipping_info` (not used yet)
- `purchase` ✅

## 📈 Key Metrics You Can Track

### Conversion Funnel
1. Page view → Access code entry → Dashboard view
2. Dashboard view → Quote creation → Quote calculation → Quote saved

### Business Metrics
- Revenue per quote (purchase event value)
- Average quote amount
- Setup completion rate
- Chat engagement (messages per quote)

### User Behavior
- Most used features
- Time to complete quote
- Setup path preferences (quick vs guided)

## 🧪 Testing Your Tracking

1. **Open your site** with browser dev tools
2. **Check console logs** - You'll see "Analytics Event: ..." messages
3. **Use GTM Preview mode** - Connect to your site and see events fire
4. **Check GA4 Real-time** - See events in Google Analytics real-time reports

### Test Flow:
1. Enter access code (login event)
2. View dashboard (page_view, view_item_list)
3. Click "New Quote" (select_item)
4. Start chat (begin_checkout)
5. Complete quote (add_to_cart, purchase)

## 📱 Environment Variables Set:
- GTM Container: `GTM-563BQKRH`
- GA4 Property: `G-984BZ3LDZE`

## 🚀 Production Ready
- ✅ Build completed successfully
- ✅ Both GTM and GA4 integrated
- ✅ Event tracking in all key pages
- ✅ E-commerce events for quote funnel
- ✅ Custom events for painting business logic

Your tracking is now live and will capture all user interactions across your painting quote platform!