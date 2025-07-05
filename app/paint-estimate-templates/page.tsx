import { Metadata } from 'next'
import Link from 'next/link'
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  Building,
  Palette,
  Calculator,
  Clock,
  DollarSign,
  Printer,
  Smartphone,
  Mail,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: 'Free Paint Estimate Templates | Professional Painting Quote Templates',
  description: 'Download free professional paint estimate templates. Sample interior paint estimates, painting quote templates, and contractor quote examples. Used by 5,000+ contractors.',
  keywords: 'paint estimate template, painting quote template, paint quote template, painting estimate template, sample interior paint estimate, painting quote example, interior paint estimate template, paint contractor quote template, free painting estimate template',
  alternates: {
    canonical: '/paint-estimate-templates',
  },
  openGraph: {
    title: 'Free Professional Paint Estimate Templates - Download Now',
    description: 'Professional painting quote templates used by contractors nationwide. Free download with examples.',
    url: '/paint-estimate-templates',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function PaintEstimateTemplatesPage() {
  const templateTypes = [
    {
      icon: <Home className="w-8 h-8 text-blue-600" />,
      name: "Interior Paint Estimate Template",
      description: "Comprehensive template for indoor painting projects including bedrooms, bathrooms, and living areas",
      features: ["Room-by-room breakdown", "Wall area calculations", "Paint and labor costs", "Material specifications"],
      sampleProject: "3-bedroom house interior",
      downloadUrl: "/templates/interior-paint-estimate.pdf"
    },
    {
      icon: <Building className="w-8 h-8 text-green-600" />,
      name: "Exterior Paint Quote Template", 
      description: "Professional template for outdoor painting including siding, trim, and special surface preparations",
      features: ["Surface area calculations", "Prep work details", "Weather considerations", "Multi-coat specifications"],
      sampleProject: "2-story house exterior",
      downloadUrl: "/templates/exterior-paint-estimate.pdf"
    },
    {
      icon: <Building className="w-8 h-8 text-purple-600" />,
      name: "Commercial Paint Estimate",
      description: "Business-focused template for office buildings, retail spaces, and commercial properties",
      features: ["Large area calculations", "Minimal disruption scheduling", "Safety requirements", "Volume pricing"],
      sampleProject: "Office building renovation", 
      downloadUrl: "/templates/commercial-paint-estimate.pdf"
    },
    {
      icon: <Palette className="w-8 h-8 text-orange-600" />,
      name: "Apartment Painting Quote",
      description: "Specialized template for rental properties, apartment complexes, and multi-unit buildings",
      features: ["Unit-by-unit pricing", "Turnover schedules", "Landlord specifications", "Bulk pricing options"],
      sampleProject: "10-unit apartment complex",
      downloadUrl: "/templates/apartment-paint-estimate.pdf"
    }
  ]

  const templateFeatures = [
    {
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      feature: "Automatic Calculations",
      description: "Built-in formulas calculate paint coverage, material costs, and labor hours automatically"
    },
    {
      icon: <Palette className="w-6 h-6 text-green-600" />,
      feature: "Professional Branding",
      description: "Customizable headers and footers to include your company logo, colors, and contact information"
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      feature: "Detailed Breakdowns",
      description: "Room-by-room or area-by-area cost breakdowns that customers can easily understand"
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      feature: "Terms & Conditions",
      description: "Pre-written contract terms, warranty information, and payment schedules"
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      feature: "Email Ready",
      description: "Formatted for easy email delivery or professional printing and presentation"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-teal-600" />,
      feature: "Mobile Compatible",
      description: "Templates work on all devices - edit and send quotes from your phone or tablet"
    }
  ]

  const sampleEstimate = {
    projectType: "Interior Painting - 3 Bedroom House",
    clientName: "Sarah Johnson",
    address: "123 Oak Street, Anytown, USA",
    date: "January 15, 2025",
    rooms: [
      { name: "Living Room (12' x 15')", sqft: 540, cost: 675 },
      { name: "Master Bedroom (12' x 14')", sqft: 504, cost: 630 },
      { name: "Bedroom 2 (10' x 12')", sqft: 408, cost: 510 },
      { name: "Bedroom 3 (10' x 11')", sqft: 398, cost: 497 },
      { name: "Hallway & Common Areas", sqft: 280, cost: 350 }
    ],
    materials: 285,
    labor: 2377,
    total: 2662
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Free <span className="text-blue-600">Paint Estimate Templates</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Download professional <strong>painting quote templates</strong> used by <strong>5,000+ contractors</strong>. 
            Complete with sample interior paint estimates, cost breakdowns, and contract terms.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="#templates">
                Download Free Templates
                <Download className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                Try Professional Software
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Instantly downloadable</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span>Professional formatting</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Palette className="w-5 h-5 text-green-500" />
              <span>Customizable branding</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5 text-green-500" />
              <span>Built-in calculations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Paint Estimate Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sample Interior Paint Estimate
            </h2>
            <p className="text-xl text-gray-600">
              See what a professional painting quote looks like with our templates
            </p>
          </div>

          <Card className="border-2 border-blue-100 shadow-xl">
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-blue-900">ProPaint Quote</CardTitle>
                  <p className="text-blue-700">Professional Painting Services</p>
                </div>
                <div className="text-right text-sm text-blue-700">
                  <p>Date: {sampleEstimate.date}</p>
                  <p>Quote #: PQ-2025-001</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Project Details</h3>
                  <p className="font-semibold text-lg">{sampleEstimate.projectType}</p>
                  <p className="text-gray-600 mt-2">
                    Complete interior painting including all prep work, primer, and two coats of premium paint
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Client Information</h3>
                  <p className="font-medium">{sampleEstimate.clientName}</p>
                  <p className="text-gray-600">{sampleEstimate.address}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Room-by-Room Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b font-semibold">Room</th>
                        <th className="text-center p-3 border-b font-semibold">Sq Ft</th>
                        <th className="text-right p-3 border-b font-semibold">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleEstimate.rooms.map((room, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{room.name}</td>
                          <td className="p-3 text-center">{room.sqft}</td>
                          <td className="p-3 text-right">${room.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Complete surface preparation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      High-quality primer application
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Two coats premium interior paint
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Complete cleanup and protection
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      2-year workmanship warranty
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Cost Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Materials:</span>
                      <span>${sampleEstimate.materials}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor:</span>
                      <span>${sampleEstimate.labor}</span>
                    </div>
                    <div className="border-t pt-2 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Project Cost:</span>
                        <span className="text-green-600">${sampleEstimate.total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Payment Terms:</strong> 25% deposit, 50% at midpoint, 25% on completion
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/trial-signup">
                Create Professional Quotes Like This
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Template Downloads */}
      <section id="templates" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Download Professional Paint Estimate Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of proven quote templates used by successful painting contractors
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {templateTypes.map((template, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                      <p className="text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Template Features:</h4>
                      <ul className="space-y-1">
                        {template.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Example Project:</strong> {template.sampleProject}
                      </p>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={template.downloadUrl}>
                        Download Template
                        <Download className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Template Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Contractors Love Our Paint Estimate Templates
            </h2>
            <p className="text-xl text-gray-600">
              Professional features that help you win more painting jobs and increase revenue
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templateFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.feature}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade to Professional */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready for Automated Quote Generation?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            While templates are great, our professional software creates quotes automatically in 6 minutes vs 6 hours
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-center">Free Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    Manual calculations required
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    Basic formatting
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    Download and customize
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                    2-3 hours per quote
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-center text-blue-900">Professional Software</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    Automatic calculations
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    Professional branding
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    Mobile app access
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                    6 minutes per quote
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-6">
            <Link href="/trial-signup">
              Try Professional Software Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          <p className="text-gray-600 mt-4">
            10 professional quotes included • No credit card required
          </p>
        </div>
      </section>

      {/* Template Tips */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Use Paint Estimate Templates Effectively
            </h2>
            <p className="text-xl text-gray-600">
              Professional tips for creating winning paint quotes with templates
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Customize Your Branding</h3>
                <p className="text-gray-600">
                  Add your company logo, colors, and contact information to every template. Professional presentation 
                  increases win rates by 40-60% compared to basic estimates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Double-Check Calculations</h3>
                <p className="text-gray-600">
                  Always verify wall area calculations and paint coverage estimates. Use the formula: 
                  (Length × Width × Height) - (Doors + Windows) = Paintable Area.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Include Detailed Scope</h3>
                <p className="text-gray-600">
                  Clearly specify what's included: prep work, primer, number of coats, cleanup, and warranty terms. 
                  Detailed scope prevents misunderstandings and change orders.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Present Quotes Quickly</h3>
                <p className="text-gray-600">
                  Deliver quotes within 24-48 hours while customer interest is high. Late quotes lose to competitors 
                  who respond faster, regardless of pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Free Paint Estimate Templates - Professional Painting Quote Templates",
            "description": "Download free professional paint estimate templates. Sample interior paint estimates and painting quote examples.",
            "url": "https://propaintquote.com/paint-estimate-templates",
            "mainEntity": {
              "@type": "CreativeWork",
              "name": "Paint Estimate Templates",
              "description": "Professional painting quote templates for contractors",
              "author": {
                "@type": "Organization",
                "name": "ProPaint Quote"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free download templates"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://propaintquote.com"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Paint Estimate Templates",
                  "item": "https://propaintquote.com/paint-estimate-templates"
                }
              ]
            }
          })
        }}
      />
    </div>
  )
}