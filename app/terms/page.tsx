import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of Service for ProPaint Quote painting contractor software. Read our terms and conditions for using our platform.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div>
      <KofiHeader />
      
      <section>
        <div>
          <div>
            <h1>Terms of Service</h1>
            <p>Last updated: January 2, 2025</p>
            
            <div>
              <p>
                These Terms of Service ("Terms") govern your use of ProPaint Quote (paintquoteapp.com), 
                a painting contractor software platform operated by ProPaint Quote. By using our service, 
                you agree to these terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using ProPaint Quote, you agree to be bound by these Terms and our Privacy Policy. 
                If you disagree with any part of these terms, you may not access the service. These Terms apply 
                to all users, including contractors, business owners, and visitors.
              </p>

              <h2>2. Description of Service</h2>
              <p>ProPaint Quote provides:</p>
              <ul>
                <li>Professional painting quote generation software</li>
                <li>Customer relationship management tools</li>
                <li>Business analytics and reporting</li>
                <li>Project management features</li>
                <li>Educational resources for painting contractors</li>
              </ul>

              <h2>3. User Accounts and Registration</h2>
              
              <h3>3.1 Account Creation</h3>
              <ul>
                <li>You must provide accurate and complete information</li>
                <li>You must be at least 18 years old or the age of majority in your jurisdiction</li>
                <li>You are responsible for maintaining account security</li>
                <li>One person or entity may not maintain more than one account</li>
              </ul>

              <h3>3.2 Account Responsibilities</h3>
              <ul>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>You must keep your login credentials confidential</li>
                <li>You must not share your account with others</li>
              </ul>

              <h2>4. Acceptable Use Policy</h2>
              
              <h3>4.1 Permitted Uses</h3>
              <ul>
                <li>Creating professional painting quotes and estimates</li>
                <li>Managing your painting business operations</li>
                <li>Storing customer and project information</li>
                <li>Generating business reports and analytics</li>
              </ul>

              <h3>4.2 Prohibited Uses</h3>
              <p>You may NOT use our service to:</p>
              <ul>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious software or viruses</li>
                <li>Attempt to hack, disrupt, or reverse engineer our service</li>
                <li>Spam, harass, or send unsolicited communications</li>
                <li>Use the service for any illegal business activities</li>
                <li>Impersonate another person or entity</li>
                <li>Collect user information without permission</li>
              </ul>

              <h2>5. Subscription and Payment Terms</h2>
              
              <h3>5.1 Subscription Plans</h3>
              <ul>
                <li>We offer various subscription plans with different features</li>
                <li>Pricing is subject to change with 30 days notice</li>
                <li>Free trials are limited to one per user/business</li>
                <li>All fees are non-refundable unless required by law</li>
              </ul>

              <h3>5.2 Payment and Billing</h3>
              <ul>
                <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                <li>Payments are automatically charged to your chosen payment method</li>
                <li>You must maintain valid payment information</li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h2>6. Intellectual Property Rights</h2>
              
              <h3>6.1 Our Rights</h3>
              <p>ProPaint Quote owns all rights to:</p>
              <ul>
                <li>The software platform and its features</li>
                <li>Our trademarks, logos, and branding</li>
                <li>All content we create (guides, templates, etc.)</li>
                <li>The underlying technology and algorithms</li>
              </ul>

              <h3>6.2 Your Rights</h3>
              <ul>
                <li>You retain ownership of your business data and customer information</li>
                <li>You grant us a license to process your data to provide our service</li>
                <li>You can export your data at any time</li>
                <li>You are responsible for ensuring you have rights to any data you upload</li>
              </ul>

              <h3>6.3 License to Use</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to use our service 
                according to these Terms. This license terminates when your subscription ends.
              </p>

              <h2>7. User-Generated Content</h2>
              <ul>
                <li>You are responsible for all content you upload or create</li>
                <li>You must have the right to upload any content you share</li>
                <li>We may remove content that violates these Terms</li>
                <li>You grant us permission to display and process your content to provide our service</li>
                <li>We do not claim ownership of your business data</li>
              </ul>

              <h2>8. Service Availability and Modifications</h2>
              
              <h3>8.1 Service Availability</h3>
              <ul>
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Planned maintenance will be announced in advance when possible</li>
                <li>We are not liable for service interruptions beyond our control</li>
              </ul>

              <h3>8.2 Service Modifications</h3>
              <ul>
                <li>We may modify, update, or discontinue features with notice</li>
                <li>We may add new features to existing plans</li>
                <li>Significant changes will be communicated via email or in-app notifications</li>
              </ul>

              <h2>9. Termination</h2>
              
              <h3>9.1 Termination by You</h3>
              <ul>
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of your billing period</li>
                <li>You can export your data before cancellation</li>
                <li>No refunds for partial billing periods</li>
              </ul>

              <h3>9.2 Termination by Us</h3>
              <p>We may terminate your account if you:</p>
              <ul>
                <li>Violate these Terms</li>
                <li>Fail to pay subscription fees</li>
                <li>Use the service inappropriately</li>
                <li>Engage in fraudulent activities</li>
              </ul>

              <h2>10. Disclaimers and Limitation of Liability</h2>
              
              <h3>10.1 Service Disclaimer</h3>
              <ul>
                <li>Our service is provided "as is" without warranties</li>
                <li>We do not guarantee accuracy of quotes or estimates</li>
                <li>You are responsible for verifying all quote calculations</li>
                <li>We are not responsible for business decisions based on our software</li>
              </ul>

              <h3>10.2 Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, ProPaint Quote shall not be liable for any 
                indirect, incidental, special, or consequential damages. Our total liability is 
                limited to the amount you paid for the service in the 12 months prior to the claim.
              </p>

              <h2>11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless ProPaint Quote from any claims arising from 
                your use of the service, violation of these Terms, or infringement of any rights of another.
              </p>

              <h2>12. Governing Law and Disputes</h2>
              <ul>
                <li>These Terms are governed by the laws of the United States</li>
                <li>Disputes will be resolved through binding arbitration</li>
                <li>You waive the right to participate in class action lawsuits</li>
                <li>Arbitration will be conducted under American Arbitration Association rules</li>
              </ul>

              <h2>13. Changes to Terms</h2>
              <p>
                We may update these Terms periodically. We will provide notice of material changes 
                via email or through our service. Continued use after changes constitutes acceptance 
                of the new Terms.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                If you have questions about these Terms, contact us:
              </p>
              <ul>
                <li>Email: hello@paintquoteapp.com</li>
                <li>Website: paintquoteapp.com/contact</li>
              </ul>

              <div>
                <h3>Key Points Summary</h3>
                <ul>
                  <li>• Use our service lawfully and professionally</li>
                  <li>• You own your data, we own our software</li>
                  <li>• Subscriptions auto-renew until cancelled</li>
                  <li>• We're not liable for your business decisions</li>
                  <li>• Changes require 30 days notice</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ImprovedFooter />
    </div>
  )
}