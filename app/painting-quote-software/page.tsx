import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Clock, TrendingUp, Users, Calculator, FileText, Smartphone, BarChart3, Shield, Zap, DollarSign, Award, ChevronRight, Star, ArrowRight } from 'lucide-react'
import { InternalLinkedContent } from '@/components/seo/InternalLinkedContent'
import { FeatureComparison } from '@/components/tables/FeatureComparison'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Painting Quote Software | #1 Contractor Tool | ProPaint Quote',
  description: 'Professional painting quote software that creates accurate quotes in 30 seconds. Win 40% more jobs. Free 14-day trial. Join 2,500+ contractors.',
  keywords: 'painting quote software, painting estimating software, painting contractor software, painting business software, painting estimate software',
  openGraph: {
    title: 'Painting Quote Software - Transform Your Contracting Business',
    description: 'Create professional painting quotes in 30 seconds. Win 40% more jobs with the #1 rated software for painting contractors.',
    images: ['/og-images/painting-quote-software.png'],
    type: 'website',
  },
}

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ProPaint Quote",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "79",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "2500",
    "bestRating": "5"
  },
  "author": {
    "@type": "Organization",
    "name": "ProPaint Quote",
    "url": "https://www.paintquoteapp.com"
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to learn painting quote software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most contractors are creating quotes within 15 minutes of signing up. Our intuitive interface and video tutorials make it easy to get started, even if you're not tech-savvy."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use painting quote software on my phone at job sites?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! ProPaint Quote works perfectly on all devices - phones, tablets, and computers. Create quotes on-site and get signatures immediately."
      }
    },
    {
      "@type": "Question",
      "name": "Will it work for commercial painting projects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. ProPaint Quote handles residential, commercial, and industrial painting projects with specialized calculators for each type."
      }
    },
    {
      "@type": "Question",
      "name": "Can multiple team members use the software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can add unlimited team members to your account. Each person gets their own login and can create quotes independently."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a free trial available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
      }
    }
  ]
}

export default function PaintingQuoteSoftwarePage() {
  return (
    <>
      <SchemaMarkup data={schemaData} />
      <SchemaMarkup data={faqSchema} />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Painting Quote Software: The Complete Guide for Professional Contractors
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              The average painting contractor spends 3-6 hours creating a single quote. 
              What if you could cut that down to <span className="font-bold text-blue-600">30 seconds</span> while 
              winning <span className="font-bold text-green-600">40% more jobs</span>?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/trial-signup">Start Free 14-Day Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Used by 2,500+ contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.8/5 average rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>100+ hours saved monthly</span>
              </div>
            </div>
          </div>
        </section>

        {/* What is Painting Quote Software */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">What is Painting Quote Software?</h2>
              
              <InternalLinkedContent className="prose prose-lg max-w-none mb-8">
                {`Painting quote software is a specialized business tool that automates the entire estimation and proposal process for painting contractors. Instead of spending hours with tape measures, calculators, and Word documents, professional painting software handles everything from measurements to professional proposal generation in minutes.`}
              </InternalLinkedContent>

              <h3 className="text-2xl font-semibold mb-6">Key Components of Professional Painting Software</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="p-6">
                  <Calculator className="w-10 h-10 text-blue-600 mb-4" />
                  <h4 className="font-semibold mb-2">Smart Calculators</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Interior painting calculator for walls and ceilings</li>
                    <li>• Exterior painting calculator with weather factors</li>
                    <li>• Cabinet painting calculator for kitchen projects</li>
                    <li>• Commercial painting calculator for large spaces</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <FileText className="w-10 h-10 text-green-600 mb-4" />
                  <h4 className="font-semibold mb-2">Professional Features</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Material cost databases with live pricing</li>
                    <li>• Labor rate management by project type</li>
                    <li>• Overhead and profit calculations</li>
                    <li>• Digital signatures and payment processing</li>
                  </ul>
                </Card>
              </div>

              {/* Before/After Comparison */}
              <div className="bg-gray-50 rounded-lg p-8 mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">Traditional vs. Software-Based Quoting</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-red-50 rounded-lg p-6">
                    <h4 className="font-semibold text-red-700 mb-4">❌ Traditional Method</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>3-6 hours per quote with manual calculations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>23% error rate in measurements and pricing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Unprofessional handwritten or basic documents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>2-3 day turnaround time to customers</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-700 mb-4">✅ With Quote Software</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>30-second quotes with automated calculations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>100% accuracy with built-in formulas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Professional branded proposals that win jobs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Instant delivery while still on-site</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Contractors Need It */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Why Every Painting Contractor Needs Professional Quote Software in 2025</h2>
              
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">The Hidden Costs of Manual Quoting</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 border-l-4 border-red-500">
                    <Clock className="w-8 h-8 text-red-500 mb-3" />
                    <h4 className="font-semibold mb-2">Time Cost</h4>
                    <p className="text-gray-600 mb-2">3-6 hours per quote × 20 quotes/month = <strong>60-120 hours</strong></p>
                    <p className="text-sm text-gray-500">That's $3,000-$6,000 in lost productivity monthly!</p>
                  </Card>
                  
                  <Card className="p-6 border-l-4 border-orange-500">
                    <DollarSign className="w-8 h-8 text-orange-500 mb-3" />
                    <h4 className="font-semibold mb-2">Accuracy Issues</h4>
                    <p className="text-gray-600 mb-2"><strong>23%</strong> of manual quotes contain calculation errors</p>
                    <p className="text-sm text-gray-500">Leading to profit loss or lost jobs from overpricing</p>
                  </Card>
                  
                  <Card className="p-6 border-l-4 border-yellow-500">
                    <TrendingUp className="w-8 h-8 text-yellow-500 mb-3" />
                    <h4 className="font-semibold mb-2">Lost Opportunities</h4>
                    <p className="text-gray-600 mb-2">Slow response times lose <strong>35%</strong> of potential jobs</p>
                    <p className="text-sm text-gray-500">Customers choose contractors who respond quickly</p>
                  </Card>
                  
                  <Card className="p-6 border-l-4 border-purple-500">
                    <Award className="w-8 h-8 text-purple-500 mb-3" />
                    <h4 className="font-semibold mb-2">Unprofessional Appearance</h4>
                    <p className="text-gray-600 mb-2">Handwritten quotes convert <strong>40% less</strong></p>
                    <p className="text-sm text-gray-500">Professional presentation matters to customers</p>
                  </Card>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">The Competitive Advantage of Digital Quoting</h3>
                
                <div className="bg-blue-50 rounded-lg p-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">30 sec</div>
                      <div className="text-gray-700">Quote creation time</div>
                      <div className="text-sm text-gray-500">vs. 3 hours manually</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                      <div className="text-gray-700">Calculation accuracy</div>
                      <div className="text-sm text-gray-500">Eliminate costly errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">40-60%</div>
                      <div className="text-gray-700">Higher close rates</div>
                      <div className="text-sm text-gray-500">Professional quotes win</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Study Box */}
              <Card className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h3 className="text-2xl font-bold mb-4">Success Story: Johnson Painting</h3>
                <p className="text-lg mb-4">"We increased revenue 45% in 6 months after switching to ProPaint Quote. 
                The time savings alone paid for the software 10x over."</p>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold">$47K</div>
                    <div className="text-sm opacity-90">Monthly revenue increase</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">120hrs</div>
                    <div className="text-sm opacity-90">Saved per month</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">278%</div>
                    <div className="text-sm opacity-90">ROI in 90 days</div>
                  </div>
                </div>
                <Link href="/painting-contractor-software-case-study" className="inline-flex items-center gap-2 mt-4 text-white hover:underline">
                  Read full case study <ChevronRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Essential Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">15 Essential Features Every Painting Quote Software Must Have</h2>
              
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Core Calculation Features</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Calculator,
                      title: "Automated Measurements",
                      description: "Calculate square footage instantly with smart room templates"
                    },
                    {
                      icon: BarChart3,
                      title: "Multi-Surface Support",
                      description: "Walls, ceilings, trim, doors, windows - all calculated separately"
                    },
                    {
                      icon: FileText,
                      title: "Material Calculators",
                      description: "Paint, primer, supplies with automatic waste factors"
                    },
                    {
                      icon: Clock,
                      title: "Labor Time Estimates",
                      description: "Industry-standard production rates built-in"
                    },
                    {
                      icon: DollarSign,
                      title: "Overhead & Profit",
                      description: "Customizable markup percentages for healthy margins"
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="p-6">
                      <feature.icon className="w-10 h-10 text-blue-600 mb-3" />
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Business Management Features</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Users,
                      title: "Customer Database",
                      description: "Store client information and complete quote history"
                    },
                    {
                      icon: FileText,
                      title: "Quote Templates",
                      description: "Professional layouts that win more jobs"
                    },
                    {
                      icon: Shield,
                      title: "Digital Signatures",
                      description: "Close deals on the spot with legally binding e-signatures"
                    },
                    {
                      icon: DollarSign,
                      title: "Payment Processing",
                      description: "Accept deposits immediately via credit card"
                    },
                    {
                      icon: Zap,
                      title: "Follow-up Automation",
                      description: "Never lose a lead with automated reminders"
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="p-6">
                      <feature.icon className="w-10 h-10 text-green-600 mb-3" />
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Advanced Features</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Smartphone,
                      title: "Mobile App",
                      description: "Full functionality on job sites with offline mode"
                    },
                    {
                      icon: BarChart3,
                      title: "Analytics Dashboard",
                      description: "Track win rates, profitability, and growth metrics"
                    },
                    {
                      icon: Users,
                      title: "Multi-Crew Scheduling",
                      description: "Manage team availability and job assignments"
                    },
                    {
                      icon: Zap,
                      title: "Supplier Integration",
                      description: "Real-time material pricing from your suppliers"
                    },
                    {
                      icon: Shield,
                      title: "Photo Integration",
                      description: "Document project details with before/after photos"
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="p-6">
                      <feature.icon className="w-10 h-10 text-purple-600 mb-3" />
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Feature Comparison Table */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">How ProPaint Quote Compares</h3>
                <FeatureComparison />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Deep Dive */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">How Painting Quote Software Transforms Your Business</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Immediate Benefits (First 30 Days)</h3>
                  <ul className="space-y-4">
                    {[
                      { percent: "90%", text: "reduction in quoting time" },
                      { percent: "100%", text: "elimination of calculation errors" },
                      { percent: "2x", text: "more professional brand image" },
                      { percent: "75%", text: "faster customer response times" },
                      { percent: "50%", text: "better business organization" }
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-600 w-20">{benefit.percent}</span>
                        <span className="text-gray-700">{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Long-term Growth (3-12 Months)</h3>
                  <ul className="space-y-4">
                    {[
                      { percent: "40-60%", text: "increase in close rates" },
                      { percent: "25%", text: "average revenue growth" },
                      { percent: "35%", text: "better profit margins" },
                      { percent: "80%", text: "reduced admin overhead" },
                      { percent: "3x", text: "business scalability" }
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600 w-20">{benefit.percent}</span>
                        <span className="text-gray-700">{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ROI Calculator Preview */}
              <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
                <h3 className="text-2xl font-semibold mb-6 text-center">Your Potential ROI</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">100 hrs</div>
                    <div className="text-gray-600">Saved per month</div>
                    <div className="text-sm text-gray-500 mt-1">Worth $5,000+</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">15-20</div>
                    <div className="text-gray-600">Extra quotes created</div>
                    <div className="text-sm text-gray-500 mt-1">3-5 extra jobs won</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">400%</div>
                    <div className="text-gray-600">Average ROI</div>
                    <div className="text-sm text-gray-500 mt-1">In first 90 days</div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <Link href="/roi-calculator" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                    Calculate your exact ROI <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Choose Software */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">How to Choose the Right Painting Quote Software for Your Business</h2>
              
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Assess Your Business Needs</h3>
                
                <div className="space-y-6">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">Solo Contractors</h4>
                    <p className="text-gray-600 mb-3">Focus on ease of use and mobile functionality</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Mobile app</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Simple interface</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Quick quotes</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Basic templates</span>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">Small Crews (2-5 painters)</h4>
                    <p className="text-gray-600 mb-3">Need team features and job tracking</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Multi-user access</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Job scheduling</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Customer database</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Follow-ups</span>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">Medium Companies (6-20 painters)</h4>
                    <p className="text-gray-600 mb-3">Require advanced features and reporting</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Analytics dashboard</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Crew management</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Integrations</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Custom workflows</span>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">Large Operations (20+ painters)</h4>
                    <p className="text-gray-600 mb-3">Need enterprise features and scalability</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">API access</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Custom branding</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Advanced permissions</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Dedicated support</span>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Evaluation Checklist</h3>
                
                <Card className="p-6">
                  <div className="space-y-3">
                    {[
                      "Free trial available (at least 14 days)",
                      "No credit card required to start",
                      "Mobile app included at no extra cost",
                      "Training and support provided",
                      "Regular updates and improvements",
                      "Data security and automatic backups",
                      "Integration with QuickBooks or other tools",
                      "Transparent pricing with no hidden fees"
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">🚩 Red Flags to Avoid</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Outdated interface that looks like it's from 2010",
                    "Limited customization options for your business",
                    "Poor customer support or slow response times",
                    "Hidden fees or surprise charges",
                    "Complicated setup that requires consultants",
                    "No mobile app or poor mobile experience",
                    "Lack of regular updates or improvements",
                    "No free trial or demo available"
                  ].map((flag, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">⚠️</span>
                      <span className="text-gray-700">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">How to Implement Painting Quote Software in Your Business</h2>
              
              <div className="space-y-8">
                {[
                  {
                    week: "Week 1",
                    title: "Setup and Configuration",
                    tasks: [
                      "Initial account setup and branding",
                      "Customize pricing and labor rates",
                      "Upload company logo and information",
                      "Configure quote templates",
                      "Import existing customer data"
                    ],
                    color: "blue"
                  },
                  {
                    week: "Week 2",
                    title: "Team Training",
                    tasks: [
                      "Watch video training sessions",
                      "Practice creating sample quotes",
                      "Learn mobile app features",
                      "Common scenarios walkthrough",
                      "Q&A sessions with support"
                    ],
                    color: "green"
                  },
                  {
                    week: "Week 3",
                    title: "Pilot Testing",
                    tasks: [
                      "Create 5-10 real customer quotes",
                      "Gather team feedback",
                      "Refine processes and templates",
                      "Adjust settings as needed",
                      "Test digital signatures"
                    ],
                    color: "purple"
                  },
                  {
                    week: "Week 4",
                    title: "Full Implementation",
                    tasks: [
                      "Roll out to all team members",
                      "Monitor adoption rates",
                      "Track time savings metrics",
                      "Measure customer feedback",
                      "Celebrate early wins!"
                    ],
                    color: "orange"
                  }
                ].map((week, index) => (
                  <Card key={index} className={`p-6 border-l-4 border-${week.color}-500`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`bg-${week.color}-100 text-${week.color}-700 px-3 py-1 rounded-full font-semibold`}>
                        {week.week}
                      </div>
                      <h3 className="text-xl font-semibold">{week.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {week.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Most contractors are fully operational within 2 weeks!</p>
                <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/trial-signup">Start Your Implementation Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ProPaint Quote Deep Dive */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Why ProPaint Quote is the #1 Choice for Professional Painters</h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div>
                  <Award className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Designed by Painters</h3>
                  <p className="text-blue-100">Created by a 20-year painting contractor who understands your exact needs</p>
                </div>
                <div>
                  <Zap className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                  <p className="text-blue-100">30-second quotes with AI-powered assistance and smart templates</p>
                </div>
                <div>
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
                  <p className="text-blue-100">2,500+ contractors saving 100+ hours monthly with 45% revenue growth</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-lg p-8 mb-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-1">2,500+</div>
                    <div className="text-sm text-blue-100">Active Contractors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">100+ hrs</div>
                    <div className="text-sm text-blue-100">Saved Monthly</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">$15,000</div>
                    <div className="text-sm text-blue-100">Annual Savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">98%</div>
                    <div className="text-sm text-blue-100">Satisfaction Rate</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/trial-signup">Start Free 14-Day Trial</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link href="/demo">Schedule Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Analysis */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Painting Quote Software Pricing: Investment vs. Return</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Typical Pricing Models</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Starter Plans</span>
                      <span className="font-semibold">$29-49/month</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Professional Plans</span>
                      <span className="font-semibold">$79-99/month</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Business Plans</span>
                      <span className="font-semibold">$149-199/month</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Annual Discount</span>
                      <span className="font-semibold text-green-600">Save 20%</span>
                    </li>
                  </ul>
                </Card>
                
                <Card className="p-6 bg-green-50 border-green-200">
                  <h3 className="text-xl font-semibold mb-4">Your ROI Breakdown</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Software Cost</span>
                      <span className="font-semibold text-red-600">-$79/month</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Time Saved (100hrs)</span>
                      <span className="font-semibold text-green-600">+$5,000/month</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Extra Jobs Won (3-5)</span>
                      <span className="font-semibold text-green-600">+$2,400/month</span>
                    </li>
                    <li className="border-t pt-3 flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">Monthly ROI</span>
                      <span className="font-bold text-green-600 text-xl">400-600%</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions About Painting Quote Software</h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "How long does it take to learn painting quote software?",
                    answer: "Most contractors are creating quotes within 15 minutes of signing up. Our intuitive interface and video tutorials make it easy to get started, even if you're not tech-savvy."
                  },
                  {
                    question: "Can I use it on my phone at job sites?",
                    answer: "Yes! ProPaint Quote works perfectly on all devices - phones, tablets, and computers. Create quotes on-site and get signatures immediately."
                  },
                  {
                    question: "What if I'm not tech-savvy?",
                    answer: "No problem! Our software is designed for painters, not tech experts. Plus, we offer free training, video tutorials, and live support to help you succeed."
                  },
                  {
                    question: "Will it work for commercial painting projects?",
                    answer: "Absolutely. ProPaint Quote handles residential, commercial, and industrial painting projects with specialized calculators for each type."
                  },
                  {
                    question: "Can I customize quotes for different services?",
                    answer: "Yes! Create custom templates for interior, exterior, cabinet refinishing, commercial projects, and more. Each can have its own pricing and terms."
                  },
                  {
                    question: "How secure is my customer data?",
                    answer: "Very secure. We use bank-level encryption, automatic backups, and secure servers. Your data is safer with us than on your computer."
                  },
                  {
                    question: "What happens to my data if I cancel?",
                    answer: "You own your data. Export everything anytime, and we'll keep it available for 90 days after cancellation for easy retrieval."
                  },
                  {
                    question: "Can multiple team members use it?",
                    answer: "Yes, you can add unlimited team members to your account. Each person gets their own login and can create quotes independently."
                  },
                  {
                    question: "Does it integrate with QuickBooks?",
                    answer: "Yes! Sync quotes, customers, and invoices with QuickBooks automatically. We also integrate with other popular tools."
                  },
                  {
                    question: "Is there a free trial available?",
                    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Transform Your Painting Business Today</h2>
              
              <div className="grid md:grid-cols-5 gap-4 mb-8">
                {[
                  "Save 100+ hours monthly",
                  "Win 40% more jobs",
                  "Look more professional",
                  "Scale your business faster",
                  "Join 2,500+ contractors"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <InternalLinkedContent className="text-lg mb-8 text-white/90">
                {`Don't let manual quoting hold your business back. Start your free trial today and see why thousands of painting contractors trust ProPaint Quote to grow their business. No credit card required.`}
              </InternalLinkedContent>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/trial-signup">Start Your Free 14-Day Trial</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link href="/demo">Schedule a Demo</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link href="/painting-contractor-software-case-study">Read Success Stories</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-white/70">
                Questions? Call us at 1-800-PAINT-PRO or email support@propaintquote.com
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}