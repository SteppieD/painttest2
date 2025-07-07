import { Metadata } from 'next';
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
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Free Painting Quote Templates - Professional PDF Templates Download',
  description: 'Download free professional painting quote templates. PDF templates for interior, exterior, commercial painting quotes. Customizable templates for contractors.',
  keywords: 'painting quote templates, painting quotation template, painting quotation sample, example of a painting quote, painting quote template free download, quotes for a painting',
  openGraph: {
    title: 'Free Professional Painting Quote Templates - PDF Download',
    description: 'Professional painting quote templates for contractors. Free PDF download with customizable formats.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Painting Quote Templates',
    description: 'Download professional painting quote templates. PDF format, fully customizable.',
  }
};

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
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Free Professional <span className="text-blue-600">Painting Quote Templates</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Download professional painting quote templates used by thousands of contractors. 
            Customizable PDF templates for interior, exterior, and commercial painting projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="#templates">
                <Download className="w-5 h-5 mr-2" />
                Download Free Templates
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                <FileText className="w-5 h-5 mr-2" />
                Create Custom Quote
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>100% Free Download</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>PDF Format</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Fully Customizable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Templates */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Professional Painting Contractors Use Quote Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save time, look professional, and win more jobs with standardized quote templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Save 90% of Quote Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create professional quotes in minutes instead of hours. Templates eliminate the need to start from scratch every time.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Increase Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Professional-looking quotes instill confidence in customers and lead to higher acceptance rates and better pricing.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Consistent Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Maintain consistent company branding and professional appearance across all customer interactions.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <FileText className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Complete Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Never forget important details. Templates ensure all critical information is included in every quote.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-red-600 mb-4" />
                <CardTitle>Legal Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Include proper terms, conditions, and disclaimers to protect your business from disputes and liability.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Mobile Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">PDF templates work perfectly on phones and tablets for on-site quote creation and customer presentations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section id="templates" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Quote Template Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of proven quote templates used by successful painting contractors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {templates.map((template, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{template.icon}</span>
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                  </div>
                  <p className="text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {template.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href="/trial-signup">
                        <Download className="w-4 h-4 mr-2" />
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

          <div className="text-center">
            <Card className="inline-block p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-12 h-12 text-blue-600" />
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900">All Templates Bundle</h3>
                  <p className="text-gray-600">Get all 4 professional templates + bonus materials</p>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  <Download className="w-5 h-5 mr-2" />
                  Download Complete Bundle
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Included in Every Template
            </h2>
            <p className="text-xl text-gray-600">
              Each template is professionally designed and includes all essential elements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quote Sections</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Company header with logo space</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Customer information section</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Detailed scope of work</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Material specifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Labor cost breakdown</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Timeline and scheduling</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Legal Protection</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Terms and conditions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Payment terms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Warranty information</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Liability disclaimers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Change order procedures</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Signature areas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Professional Painters
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            See what contractors say about our professional quote templates
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"These templates saved me hours every week. My quotes look professional and customers love the detail."</p>
              <p className="font-medium">- Maria Rodriguez, Rodriguez Painting</p>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Professional templates that actually work. My quote acceptance rate increased 40% after using these."</p>
              <p className="font-medium">- David Chen, Premium Painting Co.</p>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Easy to customize and covers everything I need. No more missed details in my quotes."</p>
              <p className="font-medium">- Jennifer White, Elite Painters</p>
            </Card>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xl text-gray-600">4.9/5 stars • 1,500+ downloads</p>
          </div>
        </div>
      </section>

      {/* Advanced Quote Software CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Advanced Quote Software?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            While templates are great, our quote software creates professional estimates in minutes with automatic calculations and customer management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                <ArrowRight className="w-5 h-5 mr-2" />
                Try Quote Software Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="#templates">
                <Download className="w-5 h-5 mr-2" />
                Download Templates
              </Link>
            </Button>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            Free trial • No credit card required • Instant setup
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}