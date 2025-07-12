import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy Policy for ProPaint Quote painting contractor software. Learn how we protect your data and maintain your privacy.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div>
      <KofiHeader />
      
      <section>
        <div>
          <div>
            <h1>Privacy Policy</h1>
            <p>Last updated: January 2, 2025</p>
            
            <div>
              <p>
                At ProPaint Quote (paintquoteapp.com), we are committed to protecting your privacy and personal information. 
                This Privacy Policy explains how we collect, use, store, and protect your information when you use our painting contractor software platform.
              </p>

              <h2>1. Information We Collect</h2>
              
              <h3>1.1 Information You Provide</h3>
              <ul>
                <li>Account information (name, email address, company details)</li>
                <li>Profile information (business location, services offered)</li>
                <li>Quote and project data you create</li>
                <li>Customer information you input for quotes</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communications with our support team</li>
              </ul>

              <h3>1.2 Information We Collect Automatically</h3>
              <ul>
                <li>Usage data (features used, time spent, clicks)</li>
                <li>Device information (browser type, operating system)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Performance and analytics data</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>Provide and maintain our painting quote software</li>
                <li>Process your quotes and manage your account</li>
                <li>Improve our services and develop new features</li>
                <li>Send important updates about your account or service changes</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>3. Information Sharing and Disclosure</h2>
              
              <h3>We do NOT sell your personal information. We may share information only in these circumstances:</h3>
              <ul>
                <li><strong>Service Providers:</strong> Trusted third parties who help us operate our service (hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Safety and Security:</strong> To protect rights, property, or safety of our users</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              </ul>

              <h2>4. Data Storage and Security</h2>
              <ul>
                <li>We use industry-standard security measures including encryption</li>
                <li>Data is stored on secure servers with restricted access</li>
                <li>Regular security audits and updates</li>
                <li>Staff access is limited to those who need it for job functions</li>
                <li>While we implement strong security measures, no system is 100% secure</li>
              </ul>

              <h2>5. Data Retention</h2>
              <ul>
                <li>Account data: Retained while your account is active</li>
                <li>Quote data: Retained for 7 years for business records</li>
                <li>Usage logs: Retained for 90 days for performance analysis</li>
                <li>Marketing data: Until you unsubscribe or request deletion</li>
                <li>Legal requirements may require longer retention periods</li>
              </ul>

              <h2>6. Your Rights and Choices</h2>
              
              <h3>You have the right to:</h3>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
                <li>Restrict certain data processing</li>
                <li>Data portability (receive your data in a standard format)</li>
              </ul>

              <h2>7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the service to function</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p>
                You can control cookies through your browser settings, though this may affect functionality.
              </p>

              <h2>8. International Data Transfers</h2>
              <p>
                Our services are hosted in the United States. If you access our service from outside the US, 
                your information may be transferred to and stored in the US. We ensure appropriate safeguards 
                are in place for international transfers.
              </p>

              <h2>9. Compliance with Privacy Laws</h2>
              <p>We comply with applicable privacy laws including:</p>
              <ul>
                <li>General Data Protection Regulation (GDPR) for EU users</li>
                <li>California Consumer Privacy Act (CCPA) for California residents</li>
                <li>Other applicable state and federal privacy laws</li>
              </ul>

              <h2>10. Children's Privacy</h2>
              <p>
                Our service is designed for business use and is not intended for children under 13. 
                We do not knowingly collect personal information from children under 13.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant changes 
                via email or through our service. Your continued use constitutes acceptance of the updated policy.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or want to exercise your rights, contact us:
              </p>
              <ul>
                <li>Email: hello@paintquoteapp.com</li>
                <li>Website: paintquoteapp.com/contact</li>
              </ul>

              <div>
                <h3>Quick Summary</h3>
                <p>
                  We collect only necessary information to provide our painting quote software, 
                  protect your data with industry-standard security, never sell your information, 
                  and give you full control over your data. You can delete your account anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ImprovedFooter />
    </div>
  )
}