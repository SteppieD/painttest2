# 📧 Resend Email Setup Guide for ProPaint Quote

## Quick Setup (5 minutes)

### Step 1: Create Resend Account
1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email
3. Verify your email address

### Step 2: Get Your API Key
1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it "ProPaint Quote Production"
4. Copy the API key (starts with `re_`)

### Step 3: Add to Environment Variables
Add these to your `.env.local` file:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
DEFAULT_FROM_EMAIL=hello@yourdomain.com

# Optional: Custom domain (if you have one)
RESEND_DOMAIN=yourdomain.com
```

### Step 4: Verify Domain (Optional but Recommended)
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., propaintquote.com)
4. Add the DNS records shown to your domain provider
5. Click "Verify Domain"

### Step 5: Test Your Configuration
```bash
# Test via API endpoint
curl http://localhost:3001/api/test-email

# Or send a test email
curl -X POST http://localhost:3001/api/test-email
```

## Email Templates Already Built

The following email templates are ready to use:

### 1. **Welcome Email** (Trial Signup)
- Sent when new contractor creates account
- Includes access code and getting started guide
- Beautiful HTML template with branding

### 2. **Quote Email** (Customer Quotes)
- Professional quote presentation
- Itemized pricing breakdown
- Accept/decline buttons
- Company branding

### 3. **Company Notifications**
- New quote created
- Quote accepted/declined
- Customer messages

## Testing Email Delivery

### Using the Test Endpoint:
```bash
# Check configuration
curl http://localhost:3001/api/test-email

# Send test email
curl -X POST http://localhost:3001/api/test-email
```

### From the Application:
1. Create a trial account
2. Check console for email logs
3. With Resend configured, emails will actually send

## Production Checklist

- [ ] Resend API key added to `.env.local`
- [ ] Default from email configured
- [ ] Domain verified (for better deliverability)
- [ ] Test email sent successfully
- [ ] Welcome emails working
- [ ] Quote emails tested

## Environment Variables Reference

```env
# Required
RESEND_API_KEY=re_live_xxxxxxxxxxxxx

# Optional but recommended
DEFAULT_FROM_EMAIL=hello@propaintquote.com
RESEND_DOMAIN=propaintquote.com

# Alternative providers (if not using Resend)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Troubleshooting

### Emails not sending?
1. Check API key is correct
2. Verify domain if using custom domain
3. Check spam folder
4. Look at console logs for errors

### Rate limits?
- Resend free tier: 100 emails/day
- Paid plans: Much higher limits
- Built-in rate limiting in communication service

### Need help?
- Resend docs: https://resend.com/docs
- Support: support@resend.com

## Next Steps

Once email is working:
1. Set up email automation flows
2. Configure drip campaigns
3. Add email analytics tracking
4. A/B test subject lines

Your email infrastructure is already built - you just need to add the API key!