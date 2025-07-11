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
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Enterprise Painting Solutions
          </h1>
          <p>
            Scale your painting business with enterprise-grade quote software. 
            Custom solutions for franchises, multi-location contractors, and large painting companies.
          </p>
          <div>
            <Button size="lg" variant="primary" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Request Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section>
        <div>
          <div>
            <h2>
              Built for Large Painting Operations
            </h2>
            <p>
              Everything you need to manage multiple teams, locations, and thousands of quotes
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Building2 />
                <CardTitle>Multi-Location Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Manage unlimited locations with centralized reporting, custom pricing by region, and team-specific permissions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  SOC 2 compliant infrastructure with SSO, role-based access control, and full audit trails for compliance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users />
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  24/7 priority support with dedicated account manager, onboarding specialist, and custom training programs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap />
                <CardTitle>API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Full REST API access to integrate with your existing CRM, accounting software, and business systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle />
                <CardTitle>Custom Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tailor the platform to your business with custom fields, approval workflows, and automated processes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Building2 />
                <CardTitle>White Label Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Brand the platform as your own with custom domains, logos, and color schemes for your franchise network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section>
        <div>
          <h2>
            Why Large Painting Companies Choose ProPaint Quote
          </h2>

          <div>
            <div>
              <h3>Scale Without Limits</h3>
              <p>
                Handle 10,000+ quotes per month with our robust infrastructure designed for high-volume operations.
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Unlimited users and locations
                </li>
                <li>
                  <CheckCircle />
                  99.9% uptime SLA guarantee
                </li>
                <li>
                  <CheckCircle />
                  Global CDN for fast performance
                </li>
              </ul>
            </div>

            <div>
              <h3>Complete Business Intelligence</h3>
              <p>
                Make data-driven decisions with enterprise analytics and custom reporting dashboards.
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Real-time performance metrics
                </li>
                <li>
                  <CheckCircle />
                  Custom KPI dashboards
                </li>
                <li>
                  <CheckCircle />
                  Automated report scheduling
                </li>
              </ul>
            </div>

            <div>
              <h3>Seamless Integration</h3>
              <p>
                Connect ProPaint Quote with your entire business ecosystem for streamlined operations.
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  QuickBooks & Xero integration
                </li>
                <li>
                  <CheckCircle />
                  CRM synchronization
                </li>
                <li>
                  <CheckCircle />
                  Custom API webhooks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Ready to Scale Your Painting Business?
          </h2>
          <p>
            Let's discuss how ProPaint Quote can transform your enterprise operations
          </p>
          <div>
            <Button size="lg" variant="outline_white" asChild>
              <Link href="/contact">
                <Phone />
                Schedule Enterprise Demo
              </Link>
            </Button>
          </div>
          <p>
            Custom pricing • Dedicated support • Implementation assistance
          </p>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}