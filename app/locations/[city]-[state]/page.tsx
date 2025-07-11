import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, Shield, Star, Users } from 'lucide-react'
import { SERVICE_AREAS, COMPANY_INFO, PAINTING_SERVICES } from '@/lib/constants'

export async function generateStaticParams() {
  return SERVICE_AREAS.map((area) => ({
    city: area.city.toLowerCase().replace(' ', '-'),
    state: area.state.toLowerCase()
  }))
}

export async function generateMetadata({ params }: { params: { city: string, state: string } }) {
  const cityName = params.city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  const stateName = params.state.toUpperCase()

  return {
    title: `Painting Contractor ${cityName}, ${stateName} - Professional Painting Services`,
    description: `Professional painting services in ${cityName}, ${stateName}. Interior & exterior painting, commercial painting, free quotes. Licensed & insured local painters.`,
    openGraph: {
      title: `${COMPANY_INFO.name} - ${cityName} Painting Contractor`,
      description: `Top-rated painting services in ${cityName}, ${stateName}. Get your free quote today!`,
    }
  }
}

// Local statistics (could be fetched from a database in production)
const localStats = {
  projectsCompleted: 250,
  yearsServing: 5,
  averageRating: 4.8,
  responseTime: '2 hours'
}

export default function LocationPage({ params }: { params: { city: string, state: string } }) {
  const cityName = params.city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  const stateName = params.state.toUpperCase()
  
  // Verify this is a valid service area
  const area = SERVICE_AREAS.find(
    a => a.city.toLowerCase().replace(' ', '-') === params.city && 
         a.state.toLowerCase() === params.state
  )
  
  if (!area) notFound()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${COMPANY_INFO.name} - ${cityName}`,
    "image": "/images/paint-logo-transparent.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": stateName,
      "addressCountry": "US"
    },
    "url": `https://propaintsolutions.com/locations/${params.city}-${params.state}`,
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": localStats.averageRating,
      "reviewCount": localStats.projectsCompleted
    }
  }

  return (
    <>
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-2 text-primary-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Serving {cityName}, {stateName}</span>
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
                Professional Painting Contractor in {cityName}, {stateName}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Transform your home or business with {COMPANY_INFO.name}. 
                Trusted local painters delivering exceptional results since {COMPANY_INFO.established}.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild>
                  <Link href="/get-quote">Get Free Quote</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              
              {/* Local Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{localStats.projectsCompleted}+</div>
                  <div className="text-sm text-gray-600">Projects in {cityName}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{localStats.yearsServing}</div>
                  <div className="text-sm text-gray-600">Years Serving {cityName}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-3xl font-bold text-primary-600">{localStats.averageRating}</span>
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{localStats.responseTime}</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-8 text-center">
              Our Painting Services in {cityName}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {PAINTING_SERVICES.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-sm font-medium text-primary-600 mb-4">
                      {service.priceRange}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/services/${service.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Local Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-secondary-900 mb-6">
                  Why {cityName} Homeowners Choose Us
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <Users className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Local {cityName} Team</h3>
                      <p className="text-gray-600">
                        Our painters live and work in {cityName}. We understand local 
                        weather conditions, architectural styles, and homeowner preferences.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Fast Response Time</h3>
                      <p className="text-gray-600">
                        Get quotes within {localStats.responseTime} and schedule your 
                        project quickly. We respect your time and meet deadlines.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Licensed in {stateName}</h3>
                      <p className="text-gray-600">
                        Fully licensed, bonded, and insured in {stateName}. Your property 
                        and investment are protected throughout the project.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" asChild>
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
              
              <div className="relative">
                <Image
                  src="/images/couple-picking-paint-color.jpg"
                  alt={`Painting services in ${cityName}`}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Neighborhoods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-8 text-center">
              Serving All {cityName} Neighborhoods
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-gray-600 mb-8">
                From downtown to the suburbs, we provide professional painting services 
                throughout the {cityName} metropolitan area. No project is too big or 
                too small for our experienced team.
              </p>
              
              <div className="bg-primary-50 rounded-lg p-8 text-center">
                <h3 className="font-semibold text-lg mb-4">
                  Get Your Free {cityName} Painting Quote
                </h3>
                <p className="text-gray-600 mb-6">
                  Join hundreds of satisfied {cityName} homeowners who trust us 
                  with their painting projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/get-quote">Get Quote Now</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/calculator">Try Calculator</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-secondary-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Transform Your {cityName} Property?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. 
              We're here to make your painting project a success.
            </p>
            <div className="flex items-center justify-center">
              <Button asChild variant="secondary">
                <Link href="/contact">Contact Us Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}