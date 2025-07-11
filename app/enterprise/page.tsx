import Link from 'next/link';
import { Building2, Shield, Users, Zap, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Enterprise Painting Quote Software',
  description: 'Enterprise-grade painting quote software for large contractors and franchises. Custom pricing, dedicated support, and advanced features for scaling businesses.',
  path: '/enterprise',
});

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Enterprise Painting Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Scale your painting business with enterprise-grade quote software. 
            Custom solutions for franchises, multi-location contractors, and large painting companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary" asChild className="text-lg px-8 py-6">
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/demo">
                Request Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Large Painting Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage multiple teams, locations, and thousands of quotes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Building2 className="w-12 h-12 text-[#ef2b70] mb-4" />
                <CardTitle>Multi-Location Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage unlimited locations with centralized reporting, custom pricing by region, and team-specific permissions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  SOC 2 compliant infrastructure with SSO, role-based access control, and full audit trails for compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  24/7 priority support with dedicated account manager, onboarding specialist, and custom training programs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Zap className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Full REST API access to integrate with your existing CRM, accounting software, and business systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Custom Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tailor the platform to your business with custom fields, approval workflows, and automated processes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Building2 className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>White Label Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Brand the platform as your own with custom domains, logos, and color schemes for your franchise network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Large Painting Companies Choose ProPaint Quote
          </h2>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scale Without Limits</h3>
              <p className="text-gray-600 mb-4">
                Handle 10,000+ quotes per month with our robust infrastructure designed for high-volume operations.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  Unlimited users and locations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  99.9% uptime SLA guarantee
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  Global CDN for fast performance
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Business Intelligence</h3>
              <p className="text-gray-600 mb-4">
                Make data-driven decisions with enterprise analytics and custom reporting dashboards.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  Real-time performance metrics
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  Custom KPI dashboards
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  Automated report scheduling
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seamless Integration</h3>
              <p className="text-gray-600 mb-4">
                Connect ProPaint Quote with your entire business ecosystem for streamlined operations.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  QuickBooks & Xero integration
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  CRM synchronization
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  Custom API webhooks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#ef2b70]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Scale Your Painting Business?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Let's discuss how ProPaint Quote can transform your enterprise operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline_white" asChild className="text-lg px-8 py-6">
              <Link href="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Schedule Enterprise Demo
              </Link>
            </Button>
          </div>
          <p className="text-pink-200 mt-4 text-sm">
            Custom pricing • Dedicated support • Implementation assistance
          </p>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}