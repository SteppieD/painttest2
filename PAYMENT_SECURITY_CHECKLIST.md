# Payment Security Checklist for ProPaint Quote

## 🔴 CRITICAL - Must Have Before Processing Payments

### 1. **PCI Compliance Strategy**
```typescript
// NEVER store card details in your database
// Use one of these approaches:

// Option A: Stripe Checkout (Recommended)
// - Redirect to Stripe-hosted payment page
// - Never touch card data
// - Automatic PCI compliance

// Option B: Stripe Elements
// - Card data goes directly to Stripe
// - Your server never sees card numbers
// - Requires basic PCI compliance

// Option C: Payment processor webhooks
// - Process payments on their servers
// - Receive success/failure webhooks
```

### 2. **Environment Variables Check**
```bash
# .env.local (NEVER commit this file)
STRIPE_SECRET_KEY=sk_live_xxxxx          # Backend only
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_  # Frontend safe
STRIPE_WEBHOOK_SECRET=whsec_xxxxx       # Webhook validation
DATABASE_ENCRYPTION_KEY=xxxxx           # For sensitive data
```

### 3. **Database Security**
```typescript
// Before adding payments, ensure:
- [ ] Database connection uses SSL
- [ ] User passwords hashed with bcrypt
- [ ] API endpoints have authentication
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
```

### 4. **Required Security Headers**
```typescript
// middleware.ts - Already implemented ✅
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Content-Security-Policy (add this)
```

### 5. **Payment Data Rules**
```typescript
// NEVER store:
- ❌ Full card numbers
- ❌ CVV codes
- ❌ Card expiration dates

// SAFE to store:
- ✅ Stripe customer ID (cus_xxxxx)
- ✅ Stripe payment method ID (pm_xxxxx)
- ✅ Last 4 digits of card
- ✅ Card brand (Visa, Mastercard)
- ✅ Transaction IDs
```

## 🟡 Important Security Measures

### 6. **API Security**
```typescript
// app/api/payments/route.ts
export async function POST(request: Request) {
  // 1. Verify authentication
  const session = await getServerSession()
  if (!session) return new Response('Unauthorized', { status: 401 })
  
  // 2. Validate webhook signatures
  const signature = request.headers.get('stripe-signature')
  try {
    const event = stripe.webhooks.constructEvent(
      body, signature, STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response('Invalid signature', { status: 400 })
  }
  
  // 3. Rate limiting
  const rateLimitOk = await checkRateLimit(request)
  if (!rateLimitOk) return new Response('Too many requests', { status: 429 })
}
```

### 7. **Frontend Security**
```typescript
// Never expose sensitive operations
- ✅ Process payments server-side only
- ✅ Validate prices server-side
- ✅ Check permissions server-side
- ❌ Don't trust client-side data
```

### 8. **Audit Logging**
```sql
-- Create audit table for payment events
CREATE TABLE payment_audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(50),
  amount DECIMAL(10,2),
  status VARCHAR(20),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🟢 Best Practices

### 9. **Testing Security**
```bash
# Before going live:
- [ ] Test with Stripe test cards
- [ ] Verify webhook signature validation
- [ ] Test failed payment scenarios
- [ ] Check for SQL injection vulnerabilities
- [ ] Validate all user inputs
```

### 10. **Monitoring & Alerts**
```typescript
// Set up alerts for:
- Failed payment attempts > threshold
- Unusual transaction patterns
- Multiple cards used by same user
- Geographic anomalies
```

## 🔵 Repository Security

### If Keeping Public:
```gitignore
# .gitignore must include:
.env
.env.local
.env.production
*.pem
*.key
/config/secrets/
```

### Additional Security Layers:
1. **GitHub Secret Scanning** - Enable in repo settings
2. **Dependabot** - For vulnerability alerts
3. **Code scanning** - GitHub Actions security workflow
4. **Branch protection** - Require PR reviews

## 🟣 Deployment Security

### Vercel Environment Variables:
```bash
# Production secrets in Vercel dashboard:
- Only add production keys in Vercel
- Use different keys for dev/staging/prod
- Enable "Sensitive" flag for secrets
- Restrict preview deployments
```

### SSL/TLS:
- ✅ Vercel provides automatic SSL
- ✅ Force HTTPS redirects (already in middleware)
- ✅ HSTS header implemented

## Quick Security Audit Commands:

```bash
# Check for exposed secrets
git secrets --scan

# Check dependencies for vulnerabilities
npm audit

# Check for common security issues
npx eslint-plugin-security

# Test headers
curl -I https://www.paintquoteapp.com
```

## Payment Processor Recommendations:

1. **Stripe** (Recommended)
   - Best developer experience
   - Excellent security
   - Built-in fraud protection
   - Easy PCI compliance

2. **Square**
   - Good for in-person + online
   - Simple integration
   - Lower fees for small volume

3. **PayPal/Braintree**
   - Wide customer acceptance
   - More complex integration
   - Higher fees

## Next Steps:

1. Choose payment processor
2. Implement server-side payment flow
3. Add webhook handlers
4. Set up test environment
5. Security testing
6. PCI compliance questionnaire
7. Go live checklist

Remember: The payment processor handles the complex security. Your job is to:
- Never store sensitive card data
- Always validate on the server
- Use HTTPS everywhere
- Keep dependencies updated