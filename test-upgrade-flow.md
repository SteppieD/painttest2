# Upgrade Flow Test Checklist

## 1. QuotaCounter Component Tests
- [ ] Navigate to dashboard as a logged-in user
- [ ] Check that QuotaCounter shows current usage
- [ ] When over limit, verify "Upgrade" button appears
- [ ] Click "Upgrade" button - should navigate to `/pricing`

## 2. Dashboard Upgrade Banner Tests
- [ ] Log in as a trial/freemium user
- [ ] Use 50% or more of available quotes
- [ ] Verify upgrade banner appears at top of dashboard
- [ ] Banner should show: "You've used X of Y free quotes"
- [ ] Click "Upgrade Now - Save 20%" button
- [ ] Should navigate to `/pricing` page

## 3. Pricing Page Tests
- [ ] Navigate to `/pricing` while logged in
- [ ] Verify Professional plan shows "Start 14-Day Trial" button
- [ ] Verify Business plan shows "Start 14-Day Trial" button
- [ ] Click on a paid plan CTA button
- [ ] Should trigger CheckoutForm and redirect to Stripe

## 4. Direct Purchase Flow Tests
- [ ] Ensure user is logged in (check localStorage for 'paintquote_company')
- [ ] Navigate to `/pricing`
- [ ] Click "Start 14-Day Trial" on Professional plan
- [ ] Should see Stripe checkout page with:
  - Company name pre-filled
  - Correct pricing (monthly/yearly)
  - Subscription details

## Test Data Setup
```javascript
// To simulate a trial user at 50% quota:
localStorage.setItem('paintquote_company', JSON.stringify({
  id: 1,
  company_name: "Test Painting Co",
  access_code: "TEST123",
  loginTime: Date.now()
}));

// API response should return:
{
  is_trial: true,
  quote_limit: 10,
  quotes_used: 5,
  quotes_remaining: 5
}
```

## Expected Results
1. **QuotaCounter**: Shows usage and upgrade button when at/over limit
2. **Dashboard Banner**: Appears when ≥50% quota used
3. **Pricing Page**: Detects logged-in users and shows direct checkout
4. **Checkout Flow**: Seamless redirect to Stripe with pre-filled data

## Common Issues to Check
- [ ] Company ID properly detected from localStorage
- [ ] Stripe environment variables configured
- [ ] CheckoutForm receives correct priceId
- [ ] Success/cancel URLs properly configured