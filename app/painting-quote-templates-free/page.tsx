import Link from 'next/link';
import { 
  Download, 
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Users,
  Smartphone
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Free Painting Quote Templates - Professional PDF Templates Download',
  description: 'Download free professional painting quote templates. PDF templates for interior, exterior, commercial painting quotes. Customizable templates for contractors.',
  keywords: 'painting quote templates, painting quotation template, painting quotation sample, example of a painting quote, painting quote template free download, quotes for a painting',
  path: '/painting-quote-templates-free',
});

export default function PaintingQuoteTemplatesFreePage() {
  const templates = [
    {
      name: 'Interior Painting Quote',
      description: 'Complete template for residential interior painting projects',
      features: ['Room-by-room breakdown', 'Paint specifications', 'Labor costs', 'Timeline'],
      icon: '🏠'
    },
    {
      name: 'Exterior Painting Quote',
      description: 'Professional template for exterior house painting projects',
      features: ['Surface preparation', 'Weather considerations', 'Warranty terms', 'Material specs'],
      icon: '🏡'
    },
    {
      name: 'Commercial Painting Quote',
      description: 'Business-focused template for commercial painting contracts',
      features: ['Multi-phase pricing', 'Business hours', 'Safety compliance', 'Project management'],
      icon: '🏢'
    },
    {
      name: 'Small Job Quote',
      description: 'Simplified template for quick touch-ups and small projects',
      features: ['One-page format', 'Quick turnaround', 'Simple pricing', 'Minimal prep'],
      icon: '🎨'
    }
  ];

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Free Professional <span>Painting Quote Templates</span>
          </h1>
          <p>
            Download professional painting quote templates used by thousands of contractors. 
            Customizable PDF templates for interior, exterior, and commercial painting projects.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="#templates">
                <Download />
                Download Free Templates
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/trial-signup">
                <FileText />
                Create Custom Quote
              </Link>
            </Button>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>100% Free Download</span>
            </div>
            <div>
              <CheckCircle />
              <span>PDF Format</span>
            </div>
            <div>
              <CheckCircle />
              <span>Fully Customizable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Templates */}
      <section>
        <div>
          <div>
            <h2>
              Why Professional Painting Contractors Use Quote Templates
            </h2>
            <p>
              Save time, look professional, and win more jobs with standardized quote templates
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Clock />
                <CardTitle>Save 90% of Quote Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Create professional quotes in minutes instead of hours. Templates eliminate the need to start from scratch every time.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign />
                <CardTitle>Increase Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Professional-looking quotes instill confidence in customers and lead to higher acceptance rates and better pricing.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users />
                <CardTitle>Consistent Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Maintain consistent company branding and professional appearance across all customer interactions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText />
                <CardTitle>Complete Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Never forget important details. Templates ensure all critical information is included in every quote.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle />
                <CardTitle>Legal Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Include proper terms, conditions, and disclaimers to protect your business from disputes and liability.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone />
                <CardTitle>Mobile Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p>PDF templates work perfectly on phones and tablets for on-site quote creation and customer presentations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section id="templates">
        <div>
          <div>
            <h2>
              Professional Quote Template Collection
            </h2>
            <p>
              Choose from our collection of proven quote templates used by successful painting contractors
            </p>
          </div>

          <div>
            {templates.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    <span>{template.icon}</span>
                    <CardTitle>{template.name}</CardTitle>
                  </div>
                  <p>{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    {template.features.map((feature, featureIndex) => (
                      <div key={featureIndex}>
                        <CheckCircle />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <Button asChild>
                      <Link href="/trial-signup">
                        <Download />
                        Download Template
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/trial-signup">Preview</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <div>
                <FileText />
                <div>
                  <h3>All Templates Bundle</h3>
                  <p>Get all 4 professional templates + bonus materials</p>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  <Download />
                  Download Complete Bundle
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section>
        <div>
          <div>
            <h2>
              What's Included in Every Template
            </h2>
            <p>
              Each template is professionally designed and includes all essential elements
            </p>
          </div>

          <div>
            <div>
              <h3>Quote Sections</h3>
              <div>
                <div>
                  <CheckCircle />
                  <span>Company header with logo space</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Customer information section</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Detailed scope of work</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Material specifications</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Labor cost breakdown</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Timeline and scheduling</span>
                </div>
              </div>
            </div>

            <div>
              <h3>Legal Protection</h3>
              <div>
                <div>
                  <CheckCircle />
                  <span>Terms and conditions</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Payment terms</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Warranty information</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Liability disclaimers</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Change order procedures</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Signature areas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <h2>
            Trusted by Professional Painters
          </h2>
          <p>
            See what contractors say about our professional quote templates
          </p>

          <div>
            <Card>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>"These templates saved me hours every week. My quotes look professional and customers love the detail."</p>
              <p>- Maria Rodriguez, Rodriguez Painting</p>
            </Card>

            <Card>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>"Professional templates that actually work. My quote acceptance rate increased 40% after using these."</p>
              <p>- David Chen, Premium Painting Co.</p>
            </Card>

            <Card>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>"Easy to customize and covers everything I need. No more missed details in my quotes."</p>
              <p>- Jennifer White, Elite Painters</p>
            </Card>
          </div>

          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </div>
            <p>4.9/5 stars • 1,500+ downloads</p>
          </div>
        </div>
      </section>

      {/* Advanced Quote Software CTA */}
      <section>
        <div>
          <h2>
            Ready for Advanced Quote Software?
          </h2>
          <p>
            While templates are great, our quote software creates professional estimates in minutes with automatic calculations and customer management.
          </p>
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                <ArrowRight />
                Try Quote Software Free
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="#templates">
                <Download />
                Download Templates
              </Link>
            </Button>
          </div>
          <p>
            Free trial • No credit card required • Instant setup
          </p>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}