# Security Guide - Professional Painting Quote Platform

## 🔐 Security Overview

This document outlines the security measures implemented in the painting quote SaaS application and provides guidance for secure deployment and operations.

## ✅ Security Features Implemented

### Authentication & Authorization
- **JWT-based Session Management** - Secure token-based authentication
- **Bcrypt Password Hashing** - Industry-standard password security
- **Role-Based Access Control** - Admin vs User permissions
- **Session Expiration** - Automatic logout after 24 hours
- **Rate Limiting** - Protection against brute force attacks

### Input Validation & Sanitization
- **Zod Schema Validation** - Type-safe input validation
- **SQL Injection Prevention** - Prepared statements throughout
- **XSS Protection** - Input sanitization and CSP headers
- **HTML Escaping** - Safe rendering of user content

### Security Headers
- **Content Security Policy (CSP)** - Prevents code injection
- **X-Frame-Options** - Clickjacking protection
- **X-Content-Type-Options** - MIME type sniffing protection
- **Strict Transport Security** - Forces HTTPS connections
- **Referrer Policy** - Controls referrer information

### Rate Limiting (Per IP Address)
- Admin authentication: **3 attempts per 15 minutes**
- Access code verification: **5 attempts per 5 minutes**
- Quote operations: **50 requests per minute**
- Trial signups: **2 signups per 10 minutes**
- General API: **100 requests per minute**

## 🚨 Critical Security Requirements

### Environment Variables (REQUIRED)
```bash
# Strong JWT secrets (256-bit random)
NEXTAUTH_SECRET=your_random_secret_here
ADMIN_JWT_SECRET=your_admin_secret_here

# Domain configuration
NEXTAUTH_URL=https://your-domain.com

# Database credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Generate Secure Secrets
```bash
# Generate strong random secrets
openssl rand -base64 32

# Example strong secret:
# K8n9mP2vR7wX4aZ6bY3cQ1eT5uI8oL9pM6nB4vC7xD2s
```

### Production Checklist

#### ✅ **Before Deployment:**
- [ ] Set strong `NEXTAUTH_SECRET` and `ADMIN_JWT_SECRET`
- [ ] Configure production database (Supabase recommended)
- [ ] Set up proper domain with HTTPS/SSL
- [ ] Remove any debug/test endpoints
- [ ] Review and tighten CSP policies
- [ ] Configure monitoring and logging

#### ✅ **Admin Account Security:**
- [ ] Create admin accounts with bcrypt-hashed passwords
- [ ] Never use the default 'admin123' password
- [ ] Use strong, unique passwords for all admin accounts
- [ ] Enable 2FA if available
- [ ] Regularly rotate admin passwords

#### ✅ **Database Security:**
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for database connections
- [ ] Restrict database access to application IPs only
- [ ] Regular database backups
- [ ] Monitor for unauthorized access attempts

## 🛡️ Security Best Practices

### Password Requirements
- **Minimum 12 characters**
- **Mix of uppercase, lowercase, numbers, symbols**
- **No common dictionary words**
- **Regular rotation (every 90 days for admin accounts)**

### Access Control
- **Principle of Least Privilege** - Users only get necessary permissions
- **Regular Access Reviews** - Audit user permissions quarterly
- **Session Management** - Automatic logout, secure session storage
- **IP Whitelisting** - Restrict admin access to known IPs (optional)

### Data Protection
- **Encryption at Rest** - Database-level encryption
- **Encryption in Transit** - HTTPS/TLS for all communications
- **PII Handling** - Minimal collection, secure storage
- **Data Retention** - Automatic cleanup of old data

## 🔍 Security Monitoring

### What to Monitor
- **Failed login attempts** - Multiple failures from same IP
- **Unusual API usage** - Spikes in requests or errors
- **Admin actions** - All admin activities logged
- **Database access** - Unusual query patterns
- **Rate limit hits** - Potential attack indicators

### Logging & Alerting
```typescript
// Example security event logging
console.log('SECURITY_EVENT', {
  type: 'failed_login',
  ip: clientIP,
  timestamp: new Date().toISOString(),
  details: { email, reason: 'invalid_password' }
});
```

## 🚨 Incident Response

### If Security Breach Suspected:
1. **Immediate**: Disable affected accounts
2. **Assess**: Determine scope of potential breach
3. **Contain**: Block suspicious IP addresses
4. **Investigate**: Review logs for unauthorized access
5. **Notify**: Inform affected users if data compromised
6. **Recover**: Restore from clean backups if needed
7. **Learn**: Update security measures based on findings

### Emergency Contacts
- **System Administrator**: [Contact Info]
- **Database Administrator**: [Contact Info]
- **Security Team**: [Contact Info]

## 🔄 Regular Security Tasks

### Daily
- Monitor security logs for suspicious activity
- Check rate limiting effectiveness
- Verify SSL certificate status

### Weekly  
- Review failed authentication attempts
- Check for new security updates
- Verify backup integrity

### Monthly
- Update dependencies and security patches
- Review user access permissions
- Test backup/restore procedures
- Security scan with tools like OWASP ZAP

### Quarterly
- Complete security audit
- Penetration testing (recommended)
- Review and update security policies
- Rotate critical secrets and passwords

## 📚 Additional Resources

### Security Frameworks
- **OWASP Top 10** - Common web application risks
- **NIST Cybersecurity Framework** - Comprehensive security guidance
- **SOC 2** - Security compliance standards

### Tools & Services
- **Snyk** - Dependency vulnerability scanning
- **OWASP ZAP** - Web application security testing
- **Sentry** - Error monitoring and alerting
- **Uptime Robot** - Service availability monitoring

### Learning Resources
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Next.js Security Guidelines](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

## 📞 Support

For security questions or to report vulnerabilities:
- **Email**: security@your-domain.com
- **Response Time**: 24 hours for critical issues
- **Responsible Disclosure**: We appreciate responsible vulnerability disclosure

---

**Last Updated**: [Current Date]  
**Version**: 1.0  
**Review Schedule**: Quarterly