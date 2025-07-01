# Freemium Quota System - Quick Start Guide

## 🚀 Overview

The Freemium Quota System implements intelligent quote credit tracking with real-time UI feedback and conversion optimization. This system drives free-to-paid conversions while maintaining a professional user experience.

## 📦 Components Included

### Core Components
- **QuotaCounter**: Real-time quota display (3 variants)
- **QuoteWatermark**: Professional branding for free tier
- **Setup Wizard**: Onboarding with bonus quote rewards

### API Endpoints
- `/api/check-quota` - Real-time quota validation
- `/api/companies/setup-progress` - Setup progress tracking
- `/api/companies/complete-setup` - Setup completion with bonuses

## 🎯 Key Features

### Real-time Quota Tracking
```tsx
// Dashboard integration
<QuotaCounter companyId="123" variant="header" />

// Chat interface integration  
<QuotaCounter companyId="123" variant="badge" />

// Full quota display
<QuotaCounter companyId="123" variant="full" showUpgrade={true} />
```

### Progressive Visual Warnings
- **Green (0-79%)**: Normal usage state
- **Yellow (80-99%)**: Warning state with soft prompts
- **Red (100%)**: Limit reached with upgrade required

### Professional Watermarking
```tsx
// Add to quote previews
<QuoteWatermark variant="footer" />
```

## 🔧 Integration Points

### Dashboard Header
Persistent quota visibility across all dashboard pages:
```tsx
{companyInfo && (
  <QuotaCounter 
    companyId={companyInfo.id}
    variant="header"
    className="hidden lg:flex"
  />
)}
```

### Chat Interface
Real-time quota during quote creation:
```tsx
// Desktop header
<QuotaCounter 
  companyId={companyId}
  variant="header"
  className="hidden sm:flex"
/>

// Mobile banner  
<QuotaCounter 
  companyId={companyId}
  variant="badge"
  className="w-full justify-center"
/>
```

## 🎨 Responsive Design

### Desktop (lg+)
- Header: Full quota counter with icons and detailed text
- Dashboard: Complete quota card with progress visualization

### Tablet (sm-lg)  
- Header: Compact counter without detailed messaging
- Dashboard: Simplified quota display

### Mobile (<sm)
- Header: Hidden to conserve space
- Banner: Dedicated quota row below header
- Dashboard: Mobile-optimized quota card

## 📊 Business Logic

### Quota Limits
- **Free Tier**: 4 quotes/month baseline
- **Setup Bonus**: +6 quotes for completing onboarding (10 total first month)
- **Enforcement**: Blocks final quote generation when exceeded

### Conversion Strategy
1. **Value demonstration**: Setup bonus shows platform value
2. **Professional pressure**: Watermarks create upgrade motivation  
3. **Strategic friction**: Quota limits at natural progression points

## 🔍 Testing

### Manual Testing Checklist
- [ ] Quota counter displays correctly in all locations
- [ ] Real-time updates work (30-second refresh)
- [ ] Progressive color changes at 80% and 100% usage
- [ ] Mobile responsiveness across all screen sizes
- [ ] Upgrade prompts appear when quota exceeded
- [ ] Setup wizard awards bonus quotes correctly

### API Testing
```bash
# Test quota check endpoint
curl -X GET "/api/check-quota?company_id=123"

# Expected response
{
  "can_create_quote": true,
  "quotes_remaining": 2,
  "plan_name": "Free Trial"
}
```

## 🚀 Deployment

### Prerequisites
- Existing Supabase database
- Subscription manager system
- Company authentication

### Environment Variables
No new environment variables required - uses existing Supabase configuration.

### Database Migration
Setup wizard tables created automatically via migration files:
- `company_setup_progress`
- `company_rate_cards` 
- `industry_rate_defaults`

## 📈 Monitoring

### Key Metrics
- Free-to-paid conversion rate
- Average quota utilization
- Setup completion rate
- Upgrade trigger effectiveness

### Analytics Events
- Quota warnings shown
- Upgrade buttons clicked
- Setup wizard completions
- Quote generation blocks

## 🔮 Future Enhancements

### Phase 2
- Usage analytics dashboard for users
- Quota rollover for premium plans
- Team quota sharing

### Phase 3  
- Dynamic quota adjustments
- Feature-specific quotas
- API rate limiting integration

## 📚 Documentation

- **Full Implementation Guide**: `docs/FREEMIUM_QUOTA_SYSTEM.md`
- **Component Documentation**: Inline JSDoc comments
- **API Documentation**: OpenAPI specs in endpoint files

## 🆘 Troubleshooting

### Common Issues

**Quota not updating**
- Check 30-second refresh interval
- Verify API endpoint accessibility
- Confirm company ID parameter

**Upgrade prompts not showing**
- Verify quota exceeded state (100% usage)
- Check component `showUpgrade` prop
- Confirm subscription status

**Mobile display issues**
- Test responsive breakpoints (sm, lg)
- Verify Tailwind CSS classes
- Check component className props

## 🤝 Contributing

1. Follow existing component patterns
2. Maintain responsive design principles  
3. Update documentation for new features
4. Test across all device sizes
5. Verify conversion optimization impact