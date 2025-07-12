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
      icon: <Home />,
      name: "Interior Paint Estimate Template",
      description: "Comprehensive template for indoor painting projects including bedrooms, bathrooms, and living areas",
      features: ["Room-by-room breakdown", "Wall area calculations", "Paint and labor costs", "Material specifications"],
      sampleProject: "3-bedroom house interior",
      downloadUrl: "/templates/interior-paint-estimate.pdf"
    },
    {
      icon: <Building />,
      name: "Exterior Paint Quote Template", 
      description: "Professional template for outdoor painting including siding, trim, and special surface preparations",
      features: ["Surface area calculations", "Prep work details", "Weather considerations", "Multi-coat specifications"],
      sampleProject: "2-story house exterior",
      downloadUrl: "/templates/exterior-paint-estimate.pdf"
    },
    {
      icon: <Building />,
      name: "Commercial Paint Estimate",
      description: "Business-focused template for office buildings, retail spaces, and commercial properties",
      features: ["Large area calculations", "Minimal disruption scheduling", "Safety requirements", "Volume pricing"],
      sampleProject: "Office building renovation", 
      downloadUrl: "/templates/commercial-paint-estimate.pdf"
    },
    {
      icon: <Palette />,
      name: "Apartment Painting Quote",
      description: "Specialized template for rental properties, apartment complexes, and multi-unit buildings",
      features: ["Unit-by-unit pricing", "Turnover schedules", "Landlord specifications", "Bulk pricing options"],
      sampleProject: "10-unit apartment complex",
      downloadUrl: "/templates/apartment-paint-estimate.pdf"
    }
  ]

  const templateFeatures = [
    {
      icon: <Calculator />,
      feature: "Automatic Calculations",
      description: "Built-in formulas calculate paint coverage, material costs, and labor hours automatically"
    },
    {
      icon: <Palette />,
      feature: "Professional Branding",
      description: "Customizable headers and footers to include your company logo, colors, and contact information"
    },
    {
      icon: <FileText />,
      feature: "Detailed Breakdowns",
      description: "Room-by-room or area-by-area cost breakdowns that customers can easily understand"
    },
    {
      icon: <Shield />,
      feature: "Terms & Conditions",
      description: "Pre-written contract terms, warranty information, and payment schedules"
    },
    {
      icon: <Mail />,
      feature: "Email Ready",
      description: "Formatted for easy email delivery or professional printing and presentation"
    },
    {
      icon: <Smartphone />,
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
    <div>

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Free <span>Paint Estimate Templates</span>
          </h1>
          <p>
            Download professional <strong>painting quote templates</strong> used by <strong>5,000+ contractors</strong>. 
            Complete with sample interior paint estimates, cost breakdowns, and contract terms.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="#templates">
                Download Free Templates
                <Download />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/trial-signup">
                Try Professional Software
              </Link>
            </Button>
          </div>
          
          <div>
            <div>
              <CheckCircle />
              <span>Instantly downloadable</span>
            </div>
            <div>
              <FileText />
              <span>Professional formatting</span>
            </div>
            <div>
              <Palette />
              <span>Customizable branding</span>
            </div>
            <div>
              <Calculator />
              <span>Built-in calculations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Paint Estimate Preview */}
      <section>
        <div>
          <div>
            <h2>
              Sample Interior Paint Estimate
            </h2>
            <p>
              See what a professional painting quote looks like with our templates
            </p>
          </div>

          <Card>
            <CardHeader>
              <div>
                <div>
                  <CardTitle>ProPaint Quote</CardTitle>
                  <p>Professional Painting Services</p>
                </div>
                <div>
                  <p>Date: {sampleEstimate.date}</p>
                  <p>Quote #: PQ-2025-001</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <h3>Project Details</h3>
                  <p>{sampleEstimate.projectType}</p>
                  <p>
                    Complete interior painting including all prep work, primer, and two coats of premium paint
                  </p>
                </div>
                <div>
                  <h3>Client Information</h3>
                  <p>{sampleEstimate.clientName}</p>
                  <p>{sampleEstimate.address}</p>
                </div>
              </div>

              <div>
                <h3>Room-by-Room Breakdown</h3>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Sq Ft</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleEstimate.rooms.map((room, index) => (
                        <tr key={index}>
                          <td>{room.name}</td>
                          <td>{room.sqft}</td>
                          <td>${room.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div>
                  <h3>What's Included</h3>
                  <ul>
                    <li>
                      <CheckCircle />
                      Complete surface preparation
                    </li>
                    <li>
                      <CheckCircle />
                      High-quality primer application
                    </li>
                    <li>
                      <CheckCircle />
                      Two coats premium interior paint
                    </li>
                    <li>
                      <CheckCircle />
                      Complete cleanup and protection
                    </li>
                    <li>
                      <CheckCircle />
                      2-year workmanship warranty
                    </li>
                  </ul>
                </div>

                <div>
                  <h3>Cost Summary</h3>
                  <div>
                    <div>
                      <span>Materials:</span>
                      <span>${sampleEstimate.materials}</span>
                    </div>
                    <div>
                      <span>Labor:</span>
                      <span>${sampleEstimate.labor}</span>
                    </div>
                    <div>
                      <div>
                        <span>Total Project Cost:</span>
                        <span>${sampleEstimate.total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p>
                      <strong>Payment Terms:</strong> 25% deposit, 50% at midpoint, 25% on completion
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Create Professional Quotes Like This
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Template Downloads */}
      <section id="templates">
        <div>
          <div>
            <h2>
              Download Professional Paint Estimate Templates
            </h2>
            <p>
              Choose from our collection of proven quote templates used by successful painting contractors
            </p>
          </div>

          <div>
            {templateTypes.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    <div>
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <p>{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <h4>Template Features:</h4>
                      <ul>
                        {template.features.map((feature, i) => (
                          <li key={i}>
                            <CheckCircle />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p>
                        <strong>Example Project:</strong> {template.sampleProject}
                      </p>
                    </div>

                    <Button asChild>
                      <Link href={template.downloadUrl}>
                        Download Template
                        <Download />
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
      <section>
        <div>
          <div>
            <h2>
              Why Contractors Love Our Paint Estimate Templates
            </h2>
            <p>
              Professional features that help you win more painting jobs and increase revenue
            </p>
          </div>

          <div>
            {templateFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {feature.icon}
                    <CardTitle>{feature.feature}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade to Professional */}
      <section>
        <div>
          <h2>
            Ready for Automated Quote Generation?
          </h2>
          <p>
            While templates are great, our professional software creates quotes automatically in 6 minutes vs 6 hours
          </p>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Free Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>
                    <CheckCircle />
                    Manual calculations required
                  </li>
                  <li>
                    <CheckCircle />
                    Basic formatting
                  </li>
                  <li>
                    <CheckCircle />
                    Download and customize
                  </li>
                  <li>
                    <Clock />
                    2-3 hours per quote
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Software</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>
                    <CheckCircle />
                    Automatic calculations
                  </li>
                  <li>
                    <CheckCircle />
                    Professional branding
                  </li>
                  <li>
                    <CheckCircle />
                    Mobile app access
                  </li>
                  <li>
                    <Clock />
                    6 minutes per quote
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" asChild>
            <Link href="/trial-signup">
              Try Professional Software Free
              <ArrowRight />
            </Link>
          </Button>
          
          <p>
            10 professional quotes included • No credit card required
          </p>
        </div>
      </section>

      {/* Template Tips */}
      <section>
        <div>
          <div>
            <h2>
              How to Use Paint Estimate Templates Effectively
            </h2>
            <p>
              Professional tips for creating winning paint quotes with templates
            </p>
          </div>

          <div>
            <Card>
              <CardContent>
                <h3>1. Customize Your Branding</h3>
                <p>
                  Add your company logo, colors, and contact information to every template. Professional presentation 
                  increases win rates by 40-60% compared to basic estimates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3>2. Double-Check Calculations</h3>
                <p>
                  Always verify wall area calculations and paint coverage estimates. Use the formula: 
                  (Length × Width × Height) - (Doors + Windows) = Paintable Area.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3>3. Include Detailed Scope</h3>
                <p>
                  Clearly specify what's included: prep work, primer, number of coats, cleanup, and warranty terms. 
                  Detailed scope prevents misunderstandings and change orders.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3>4. Present Quotes Quickly</h3>
                <p>
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