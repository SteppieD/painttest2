import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Shield, Lock, Eye, Server, Users, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security & Data Protection | ProPaint Quote',
  description: 'Learn about ProPaint Quote\'s security measures, data protection, and compliance standards for painting contractor software.',
  robots: 'index, follow',
}

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards."
    },
    {
      icon: <Server className="w-8 h-8 text-green-600" />,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime and automatic security updates."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Access Controls",
      description: "Role-based access controls ensure users only access data they're authorized to see."
    },
    {
      icon: <Eye className="w-8 h-8 text-orange-600" />,
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-20 h-20 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Enterprise-Grade Security & Data Protection
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your business data and customer information are protected by industry-leading security measures. 
            We take data protection seriously so you can focus on growing your painting business.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Protect Your Data</h2>
            <p className="text-xl text-gray-600">
              Multiple layers of security protect your painting business data at every level
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Security Measures */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Comprehensive Security Measures</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Encryption & Storage</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers uses TLS 1.3 encryption</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Encryption at Rest:</strong> All stored data is encrypted using AES-256 encryption standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Secure Backups:</strong> Automated encrypted backups with 30-day retention and geographic distribution</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Database Security:</strong> Row-level security ensuring complete data isolation between companies</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Access Control & Authentication</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Secure Authentication:</strong> Industry-standard authentication with secure session management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Role-Based Access:</strong> Users only access data relevant to their role and company</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Account Isolation:</strong> Complete data separation between different painting contractor accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Session Security:</strong> Automatic logout and secure token management</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Infrastructure & Monitoring</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Enterprise Infrastructure:</strong> Hosted on secure, enterprise-grade cloud platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>24/7 Monitoring:</strong> Continuous security monitoring and intrusion detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Automatic Updates:</strong> Regular security patches and updates applied automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>DDoS Protection:</strong> Advanced protection against distributed denial-of-service attacks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Certifications</h2>
            <p className="text-xl text-gray-600">
              We maintain the highest standards of compliance with international regulations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {complianceStandards.map((standard, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{standard.name}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {standard.status}
                  </span>
                </div>
                <p className="text-gray-600">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Incident Response & Data Breach Protocol</h2>
            <p className="text-xl text-gray-600">
              In the unlikely event of a security incident, we have comprehensive response procedures
            </p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Our Response Process</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">Immediate Response (0-1 hours)</h4>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Incident detection and assessment</li>
                  <li>• Immediate containment measures</li>
                  <li>• Security team activation</li>
                  <li>• Initial impact evaluation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">Notification (Within 72 hours)</h4>
                <ul className="text-orange-700 text-sm space-y-1">
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Data Rights</h2>
            <p className="text-xl text-gray-600">
              You have complete control over your business data and customer information
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Data Access & Portability</h3>
              <ul className="text-blue-700 space-y-2">
                <li>• Export all your data anytime</li>
                <li>• Download quotes, customers, and reports</li>
                <li>• Standard data formats (CSV, PDF)</li>
                <li>• No lock-in or export fees</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4">Data Deletion & Control</h3>
              <ul className="text-green-700 space-y-2">
                <li>• Delete your account anytime</li>
                <li>• Complete data removal within 30 days</li>
                <li>• Granular data deletion options</li>
                <li>• Retention only for legal requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Questions or Concerns?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our security team is available to address any questions about data protection, 
            compliance, or security measures.
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Our Security Team</h3>
            <div className="space-y-2 text-gray-700">
              <p>Email: <a href="mailto:hello@paintquoteapp.com" className="text-blue-600 hover:text-blue-800">hello@paintquoteapp.com</a></p>
              <p>Subject Line: "Security Inquiry"</p>
              <p className="text-sm text-gray-500 mt-4">
                We respond to all security inquiries within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}