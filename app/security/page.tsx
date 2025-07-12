import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { Shield, Lock, Eye, Server, Users, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata = generatePageMetadata({
  title: 'Security & Data Protection',
  description: 'Learn about ProPaint Quote\'s security measures, data protection, and compliance standards for painting contractor software.',
  path: '/security',
})

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock />,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards."
    },
    {
      icon: <Server />,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime and automatic security updates."
    },
    {
      icon: <Users />,
      title: "Access Controls",
      description: "Role-based access controls ensure users only access data they're authorized to see."
    },
    {
      icon: <Eye />,
      title: "Privacy by Design",
      description: "Built with privacy principles from the ground up, collecting only necessary data for service functionality."
    }
  ]

  const complianceStandards = [
    {
      name: "SOC 2 Type II",
      status: "Compliant",
      description: "Annual security audits ensuring proper controls for security, availability, and confidentiality."
    },
    {
      name: "GDPR",
      status: "Compliant",
      description: "Full compliance with European data protection regulations including user rights and data processing."
    },
    {
      name: "CCPA",
      status: "Compliant", 
      description: "California Consumer Privacy Act compliance for user privacy rights and data transparency."
    },
    {
      name: "PIPEDA",
      status: "Compliant",
      description: "Personal Information Protection and Electronic Documents Act compliance for Canadian users."
    }
  ]

  return (
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Shield />
          </div>
          <h1>
            Enterprise-Grade Security & Data Protection
          </h1>
          <p>
            Your business data and customer information are protected by industry-leading security measures. 
            We take data protection seriously so you can focus on growing your painting business.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section>
        <div>
          <div>
            <h2>How We Protect Your Data</h2>
            <p>
              Multiple layers of security protect your painting business data at every level
            </p>
          </div>
          
          <div>
            {securityFeatures.map((feature, index) => (
              <div key={index}>
                <div>
                  <div>{feature.icon}</div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Security Measures */}
      <section>
        <div>
          <h2>Comprehensive Security Measures</h2>
          
          <div>
            <div>
              <h3>Data Encryption & Storage</h3>
              <ul>
                <li>
                  <CheckCircle />
                  <span><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers uses TLS 1.3 encryption</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Encryption at Rest:</strong> All stored data is encrypted using AES-256 encryption standards</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Secure Backups:</strong> Automated encrypted backups with 30-day retention and geographic distribution</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Database Security:</strong> Row-level security ensuring complete data isolation between companies</span>
                </li>
              </ul>
            </div>

            <div>
              <h3>Access Control & Authentication</h3>
              <ul>
                <li>
                  <CheckCircle />
                  <span><strong>Secure Authentication:</strong> Industry-standard authentication with secure session management</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Role-Based Access:</strong> Users only access data relevant to their role and company</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Account Isolation:</strong> Complete data separation between different painting contractor accounts</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Session Security:</strong> Automatic logout and secure token management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3>Infrastructure & Monitoring</h3>
              <ul>
                <li>
                  <CheckCircle />
                  <span><strong>Enterprise Infrastructure:</strong> Hosted on secure, enterprise-grade cloud platforms</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>24/7 Monitoring:</strong> Continuous security monitoring and intrusion detection</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>Automatic Updates:</strong> Regular security patches and updates applied automatically</span>
                </li>
                <li>
                  <CheckCircle />
                  <span><strong>DDoS Protection:</strong> Advanced protection against distributed denial-of-service attacks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section>
        <div>
          <div>
            <h2>Compliance & Certifications</h2>
            <p>
              We maintain the highest standards of compliance with international regulations
            </p>
          </div>
          
          <div>
            {complianceStandards.map((standard, index) => (
              <div key={index}>
                <div>
                  <h3>{standard.name}</h3>
                  <span>
                    {standard.status}
                  </span>
                </div>
                <p>{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section>
        <div>
          <div>
            <AlertTriangle />
            <h2>Incident Response & Data Breach Protocol</h2>
            <p>
              In the unlikely event of a security incident, we have comprehensive response procedures
            </p>
          </div>
          
          <div>
            <h3>Our Response Process</h3>
            <div>
              <div>
                <h4>Immediate Response (0-1 hours)</h4>
                <ul>
                  <li>• Incident detection and assessment</li>
                  <li>• Immediate containment measures</li>
                  <li>• Security team activation</li>
                  <li>• Initial impact evaluation</li>
                </ul>
              </div>
              <div>
                <h4>Notification (Within 72 hours)</h4>
                <ul>
                  <li>• Affected users notified</li>
                  <li>• Regulatory authorities informed</li>
                  <li>• Detailed incident report</li>
                  <li>• Remediation steps communicated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Rights */}
      <section>
        <div>
          <div>
            <FileText />
            <h2>Your Data Rights</h2>
            <p>
              You have complete control over your business data and customer information
            </p>
          </div>
          
          <div>
            <div>
              <h3>Data Access & Portability</h3>
              <ul>
                <li>• Export all your data anytime</li>
                <li>• Download quotes, customers, and reports</li>
                <li>• Standard data formats (CSV, PDF)</li>
                <li>• No lock-in or export fees</li>
              </ul>
            </div>
            <div>
              <h3>Data Deletion & Control</h3>
              <ul>
                <li>• Delete your account anytime</li>
                <li>• Complete data removal within 30 days</li>
                <li>• Granular data deletion options</li>
                <li>• Retention only for legal requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Trust Badges */}
      <section>
        <div>
          <div>
            <h2>Trusted by Professional Contractors</h2>
            <p>
              Join thousands of painting professionals who trust us with their business data
            </p>
          </div>
          
          <div>
            <div>
              <Shield />
              <h3>5,000+</h3>
              <p>Active Contractors Protected</p>
            </div>
            <div>
              <Lock />
              <h3>99.9%</h3>
              <p>Uptime & Availability</p>
            </div>
            <div>
              <CheckCircle />
              <h3>Zero</h3>
              <p>Security Incidents to Date</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Certifications */}
      <section>
        <div>
          <h2>Security Certifications & Partnerships</h2>
          <div>
            <div>
              <span>SOC 2</span>
            </div>
            <div>
              <span>GDPR</span>
            </div>
            <div>
              <span>CCPA</span>
            </div>
            <div>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <div>
          <h2>Security Questions or Concerns?</h2>
          <p>
            Our security team is available to address any questions about data protection, 
            compliance, or security measures.
          </p>
          <div>
            <h3>Contact Our Security Team</h3>
            <div>
              <p>Email: <a href="mailto:hello@paintquoteapp.com">hello@paintquoteapp.com</a></p>
              <p>Subject Line: "Security Inquiry"</p>
              <p>
                We respond to all security inquiries within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <ImprovedFooter />
    </div>
  )
}