import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Star, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: 'Painting Contractors by Location | Service Areas Nationwide',
  description: 'Find professional painting contractors using ProPaint Quote software in your area. Serving major cities across the United States with fast, accurate painting quotes.',
  keywords: 'painting contractors near me, local painting contractors, painting services by city, painters in my area',
}

// Major cities organized by region
const locations = {
  "West Coast": [
    { city: "Los Angeles", state: "California", slug: "los-angeles-ca", contractors: 450 },
    { city: "San Francisco", state: "California", slug: "san-francisco-ca", contractors: 280 },
    { city: "San Diego", state: "California", slug: "san-diego-ca", contractors: 220 },
    { city: "Seattle", state: "Washington", slug: "seattle-wa", contractors: 310 },
    { city: "Portland", state: "Oregon", slug: "portland-or", contractors: 180 },
    { city: "Phoenix", state: "Arizona", slug: "phoenix-az", contractors: 290 },
    { city: "Las Vegas", state: "Nevada", slug: "las-vegas-nv", contractors: 160 },
    { city: "Denver", state: "Colorado", slug: "denver-co", contractors: 240 },
  ],
  "East Coast": [
    { city: "New York", state: "New York", slug: "new-york-ny", contractors: 680 },
    { city: "Boston", state: "Massachusetts", slug: "boston-ma", contractors: 320 },
    { city: "Philadelphia", state: "Pennsylvania", slug: "philadelphia-pa", contractors: 280 },
    { city: "Washington", state: "DC", slug: "washington-dc", contractors: 260 },
    { city: "Miami", state: "Florida", slug: "miami-fl", contractors: 340 },
    { city: "Atlanta", state: "Georgia", slug: "atlanta-ga", contractors: 380 },
    { city: "Charlotte", state: "North Carolina", slug: "charlotte-nc", contractors: 220 },
  ],
  "Midwest": [
    { city: "Chicago", state: "Illinois", slug: "chicago-il", contractors: 420 },
    { city: "Detroit", state: "Michigan", slug: "detroit-mi", contractors: 240 },
    { city: "Minneapolis", state: "Minnesota", slug: "minneapolis-mn", contractors: 190 },
    { city: "St. Louis", state: "Missouri", slug: "st-louis-mo", contractors: 160 },
    { city: "Kansas City", state: "Missouri", slug: "kansas-city-mo", contractors: 140 },
    { city: "Indianapolis", state: "Indiana", slug: "indianapolis-in", contractors: 170 },
    { city: "Columbus", state: "Ohio", slug: "columbus-oh", contractors: 180 },
    { city: "Milwaukee", state: "Wisconsin", slug: "milwaukee-wi", contractors: 150 },
  ],
  "South": [
    { city: "Houston", state: "Texas", slug: "houston-tx", contractors: 460 },
    { city: "Dallas", state: "Texas", slug: "dallas-tx", contractors: 420 },
    { city: "Austin", state: "Texas", slug: "austin-tx", contractors: 280 },
    { city: "San Antonio", state: "Texas", slug: "san-antonio-tx", contractors: 240 },
    { city: "Nashville", state: "Tennessee", slug: "nashville-tn", contractors: 210 },
    { city: "New Orleans", state: "Louisiana", slug: "new-orleans-la", contractors: 160 },
    { city: "Orlando", state: "Florida", slug: "orlando-fl", contractors: 290 },
    { city: "Tampa", state: "Florida", slug: "tampa-fl", contractors: 260 },
  ]
}

// Calculate total contractors
const totalContractors = Object.values(locations).flat().reduce((sum, loc) => sum + loc.contractors, 0)

export default function LocationsPage() {
  return (
    <>
      
      <main className="min-h-screen bg-gradient-to-br from-white to-blue-50">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Serving Painting Contractors Nationwide</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find Painting Contractors in Your Area
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Professional painting contractors across the United States trust ProPaint Quote 
                to generate accurate estimates in minutes, not hours.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {totalContractors.toLocaleString()}+
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Active Contractors</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    50+
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Major Cities</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    48
                  </div>
                  <p className="text-sm text-gray-600 mt-1">States Covered</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    4.8/5
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Average Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Locations by Region */}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Select Your Location
            </h2>
            
            <div className="space-y-12">
              {Object.entries(locations).map(([region, cities]) => (
                <div key={region}>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">{region}</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cities.map((location) => (
                      <Link 
                        key={location.slug} 
                        href={`/locations/${location.slug}`}
                        className="block hover:shadow-lg transition-shadow"
                      >
                        <Card className="h-full hover:border-blue-500 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg mb-1">
                                  {location.city}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {location.state}
                                </p>
                              </div>
                              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            </div>
                            
                            <div className="mt-4 flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{location.contractors} contractors</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Contractors Choose ProPaint Quote
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Local Market Advantage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Pre-configured with regional pricing data, labor rates, and material costs 
                    specific to your local market for accurate estimates every time.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Trusted by Professionals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Join thousands of painting contractors nationwide who have modernized 
                    their quoting process and increased their win rates by 40-60%.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Works Everywhere
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Cloud-based platform works on any device, anywhere. Quote on-site, 
                    at the office, or from home - your data syncs automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join {totalContractors.toLocaleString()}+ Contractors Nationwide
            </h2>
            
            <p className="text-xl mb-8 opacity-90">
              Start generating professional quotes in minutes, not hours.
            </p>
            
            <Link href="/trial-signup">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                Start Your Free Trial
              </button>
            </Link>
            
            <p className="mt-4 text-sm opacity-75">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}