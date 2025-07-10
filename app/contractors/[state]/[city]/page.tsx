import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getAllCityPaths } from '@/lib/city-data'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, DollarSign, Star, Users, Calculator, FileText, Smartphone } from 'lucide-react'

interface Props {
  params: {
    state: string
    city: string
  }
}

// Force dynamic rendering to prevent timeout during build
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Comment out static generation to prevent build timeout
// export async function generateStaticParams() {
//   return getAllCityPaths()
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityData = getCityBySlug(params.state, params.city)
  
  if (!cityData) {
    return {
      title: 'City Not Found'
    }
  }

  return {
    title: `Painting Contractors in ${cityData.city}, ${cityData.stateCode} | Professional Quote Software`,
    description: `Join ${cityData.contractors}+ painting contractors in ${cityData.city} using ProPaint Quote. Create professional quotes in 30 seconds. Save 3 hours per quote. Start free trial.`,
    keywords: `painting contractors ${cityData.city}, ${cityData.city} painting quotes, painting estimate software ${cityData.city}, ${cityData.stateCode} painting contractors`,
    openGraph: {
      title: `Painting Contractors in ${cityData.city}, ${cityData.stateCode}`,
      description: `Professional painting quote software trusted by ${cityData.contractors}+ contractors in ${cityData.city}. Create quotes 80% faster.`,
      type: 'website',
    },
  }
}

export default function CityPage({ params }: Props) {
  const cityData = getCityBySlug(params.state, params.city)
  
  if (!cityData) {
    notFound()
  }

  const localBusinessSchema = {
    name: `Painting Contractors in ${cityData.city}`,
    description: `Professional painting contractors in ${cityData.city}, ${cityData.state} using ProPaint Quote software`,
    city: cityData.city,
    state: cityData.stateCode,
    latitude: cityData.latitude,
    longitude: cityData.longitude,
    url: `/contractors/${params.state}/${params.city}`,
    reviewCount: cityData.contractors
  }

  const breadcrumbSchema = {
    items: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: cityData.state, url: `/contractors/${params.state}` },
      { name: cityData.city, url: null }
    ]
  }

  return (
    <>
      <SchemaMarkup type="LocalBusiness" data={localBusinessSchema} />
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbSchema} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Painting Contractors in {cityData.city}, {cityData.stateCode}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join <strong>{cityData.contractors}+ painting contractors</strong> in {cityData.city} who save 3 hours per quote with ProPaint Quote
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/trial-signup">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Start Free Trial - No Credit Card
                  </Button>
                </Link>
                <Link href="/painting-estimate-calculator-free">
                  <Button size="lg" variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Try Free Calculator
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{cityData.contractors}+</div>
                <div className="text-sm text-gray-600">Active in {cityData.city}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">3 hrs</div>
                <div className="text-sm text-gray-600">Saved Per Quote</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">40%</div>
                <div className="text-sm text-gray-600">More Jobs Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">30 sec</div>
                <div className="text-sm text-gray-600">Quote Creation</div>
              </div>
            </div>
          </div>
        </section>

        {/* Local Success Story */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <CardTitle>{cityData.city} Success Story</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg text-gray-700 mb-4">
                  "ProPaint Quote transformed my painting business in {cityData.city}. I went from spending 2-3 hours on quotes to just 30 seconds. My close rate jumped from 25% to 45%, and I'm now booking $25K more per month."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Mike Rodriguez</div>
                    <div className="text-sm text-gray-600">Rodriguez Painting, {cityData.city}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features for Local Contractors */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Built for {cityData.city} Painting Contractors
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Clock className="w-10 h-10 text-orange-600 mb-4" />
                  <CardTitle>Win the 24-Hour Window</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>In {cityData.city}'s competitive market, speed wins. Create professional quotes in 30 seconds and beat competitors still using spreadsheets.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="w-10 h-10 text-orange-600 mb-4" />
                  <CardTitle>Local Market Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Pre-configured with {cityData.city} area pricing. Customize your rates and markups to match local market conditions.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Smartphone className="w-10 h-10 text-orange-600 mb-4" />
                  <CardTitle>Quote from Job Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Perfect for {cityData.city}'s busy contractors. Create and send quotes right from the customer's home using your phone.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How {cityData.city} Contractors Create Quotes in 30 Seconds
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Select Room Type</h3>
                <p className="text-sm text-gray-600">Choose from templates like "Master Bedroom" or "Living Room"</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Pick Your Paint</h3>
                <p className="text-sm text-gray-600">Select from your favorite products with {cityData.city} pricing</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Add Details</h3>
                <p className="text-sm text-gray-600">Customer info and any special requirements</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Send Quote</h3>
                <p className="text-sm text-gray-600">Professional PDF delivered instantly to customer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why {cityData.city} Contractors Choose ProPaint Quote
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4">Feature</th>
                    <th className="text-center py-4 px-4">ProPaint Quote</th>
                    <th className="text-center py-4 px-4">Spreadsheets</th>
                    <th className="text-center py-4 px-4">Other Software</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Quote Creation Time</td>
                    <td className="text-center py-4 px-4"><span className="text-green-600 font-semibold">30 seconds</span></td>
                    <td className="text-center py-4 px-4">2-3 hours</td>
                    <td className="text-center py-4 px-4">15-30 minutes</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-4 px-4">Mobile Friendly</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4">Limited</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Professional Templates</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4">Basic</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-4 px-4">Local Market Pricing</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Manual</td>
                    <td className="text-center py-4 px-4">❌</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Monthly Cost</td>
                    <td className="text-center py-4 px-4"><span className="text-green-600 font-semibold">$79</span></td>
                    <td className="text-center py-4 px-4">$0*</td>
                    <td className="text-center py-4 px-4">$150-300</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-4">* But costs you 60+ hours/month in lost productivity</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Join {cityData.contractors}+ {cityData.city} Contractors Winning More Jobs
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Start creating professional quotes in 30 seconds. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trial-signup">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Start Free 14-Day Trial
                </Button>
              </Link>
              <Link href="/painting-estimate-calculator-free">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-700">
                  Try Free Calculator First
                </Button>
              </Link>
            </div>
            <p className="text-sm text-orange-100 mt-6">
              ✓ No credit card required ✓ 30-second setup ✓ Cancel anytime
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Questions from {cityData.city} Painting Contractors
            </h2>
            
            <SchemaMarkup type="FAQPage" data={{
              questions: [
                {
                  question: `How quickly can I start using ProPaint Quote in ${cityData.city}?`,
                  answer: `You can start creating quotes immediately! Sign up takes 30 seconds, and our 2-minute setup wizard helps you configure your favorite paints and ${cityData.city} area pricing. Most contractors create their first quote within 5 minutes.`
                },
                {
                  question: "What if I'm not tech-savvy?",
                  answer: "ProPaint Quote is designed for busy contractors, not tech experts. If you can use a smartphone, you can use our software. Plus, we offer free training and support to all contractors."
                },
                {
                  question: "Can I use my own paint brands and pricing?",
                  answer: `Absolutely! While we include popular brands like Sherwin-Williams and Benjamin Moore, you can add any paint products and customize pricing for the ${cityData.city} market.`
                },
                {
                  question: "Do I need internet at job sites?",
                  answer: "You need internet to create and send quotes, but our mobile app works great on your phone's data connection. Most contractors use it right from the customer's driveway."
                }
              ]
            }} />
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How quickly can I start using ProPaint Quote in {cityData.city}?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You can start creating quotes immediately! Sign up takes 30 seconds, and our 2-minute setup wizard helps you configure your favorite paints and {cityData.city} area pricing. Most contractors create their first quote within 5 minutes.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What if I'm not tech-savvy?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>ProPaint Quote is designed for busy contractors, not tech experts. If you can use a smartphone, you can use our software. Plus, we offer free training and support to all contractors.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Can I use my own paint brands and pricing?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Absolutely! While we include popular brands like Sherwin-Williams and Benjamin Moore, you can add any paint products and customize pricing for the {cityData.city} market.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Do I need internet at job sites?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You need internet to create and send quotes, but our mobile app works great on your phone's data connection. Most contractors use it right from the customer's driveway.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}