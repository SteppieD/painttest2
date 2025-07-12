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
      
      <main>
        {/* Hero Section */}
        <section>
          <div>
            <div>
              <div>
                <MapPin />
                <span>Serving Painting Contractors Nationwide</span>
              </div>
              
              <h1>
                Find Painting Contractors in Your Area
              </h1>
              
              <p>
                Professional painting contractors across the United States trust ProPaint Quote 
                to generate accurate estimates in minutes, not hours.
              </p>
            </div>
            
            {/* Stats */}
            <div>
              <Card>
                <CardContent>
                  <div>
                    {totalContractors.toLocaleString()}+
                  </div>
                  <p>Active Contractors</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <div>
                    50+
                  </div>
                  <p>Major Cities</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <div>
                    48
                  </div>
                  <p>States Covered</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <div>
                    4.8/5
                  </div>
                  <p>Average Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Locations by Region */}
        <section>
          <div>
            <h2>
              Select Your Location
            </h2>
            
            <div>
              {Object.entries(locations).map(([region, cities]) => (
                <div key={region}>
                  <h3>{region}</h3>
                  
                  <div>
                    {cities.map((location) => (
                      <Link 
                        key={location.slug} 
                        href={`/locations/${location.slug}`}
                       
                      >
                        <Card>
                          <CardContent>
                            <div>
                              <div>
                                <h4>
                                  {location.city}
                                </h4>
                                <p>
                                  {location.state}
                                </p>
                              </div>
                              <MapPin />
                            </div>
                            
                            <div>
                              <Users />
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
        <section>
          <div>
            <h2>
              Why Contractors Choose ProPaint Quote
            </h2>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <TrendingUp />
                    Local Market Advantage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pre-configured with regional pricing data, labor rates, and material costs 
                    specific to your local market for accurate estimates every time.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Star />
                    Trusted by Professionals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Join thousands of painting contractors nationwide who have modernized 
                    their quoting process and increased their win rates by 40-60%.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    <MapPin />
                    Works Everywhere
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Cloud-based platform works on any device, anywhere. Quote on-site, 
                    at the office, or from home - your data syncs automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div>
            <h2>
              Join {totalContractors.toLocaleString()}+ Contractors Nationwide
            </h2>
            
            <p>
              Start generating professional quotes in minutes, not hours.
            </p>
            
            <Link href="/trial-signup">
              <button>
                Start Your Free Trial
              </button>
            </Link>
            
            <p>
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}