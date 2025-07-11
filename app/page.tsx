import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Shield, Star, Calculator, Palette, Home, Building } from 'lucide-react'
import { COMPANY_INFO, PAINTING_SERVICES } from '@/lib/constants'

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/man-painting-wall-light-blue.jpg"
              alt="Professional painter at work"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-900/70" />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4">
                {COMPANY_INFO.tagline}
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Get instant, AI-powered painting quotes for your home or business. 
                Professional service, transparent pricing, exceptional results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg">
                  <Link href="/get-quote">Get Instant Quote</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white hover:text-secondary-900">
                  <Link href="/calculator">Try Quote Calculator</Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5" />
                  <span>{COMPANY_INFO.licenses.join(' • ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <Star className="w-5 h-5 fill-current" />
                  <span>4.9/5 Rating • 500+ Reviews</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span>Est. {COMPANY_INFO.established}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
                Professional Painting Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From single rooms to entire buildings, we deliver exceptional results 
                with premium materials and expert craftsmanship.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PAINTING_SERVICES.map((service) => {
                const icons = {
                  home: Home,
                  building: Building,
                  briefcase: Calculator,
                  sparkles: Palette
                }
                const Icon = icons[service.icon as keyof typeof icons] || Home
                
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium text-primary-600 mb-4">
                        {service.priceRange}
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/services/${service.id}`}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-secondary-900 mb-6">
                  Why Choose {COMPANY_INFO.name}?
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Instant AI-Powered Quotes</h3>
                      <p className="text-gray-600">
                        Get accurate quotes in minutes, not days. Our advanced AI system 
                        analyzes your project details to provide transparent, competitive pricing.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Premium Quality Guaranteed</h3>
                      <p className="text-gray-600">
                        We use only top-tier paints from trusted brands and employ skilled 
                        professionals who take pride in delivering flawless results.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fully Licensed & Insured</h3>
                      <p className="text-gray-600">
                        Rest easy knowing we're fully licensed, bonded, and insured. 
                        Your property and project are protected throughout the entire process.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="/about">Learn More About Us</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="/images/happy-contractor-working-on-blueprints-in-house.jpg"
                  alt="Happy contractor reviewing project"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">{COMPANY_INFO.projectsCompleted.toLocaleString()}+</div>
                  <div className="text-sm">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Get your free, no-obligation quote in minutes. Our AI-powered system 
              ensures accurate pricing and our team delivers exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg">
                <Link href="/get-quote">Get Your Free Quote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg bg-transparent text-white border-white hover:bg-white hover:text-primary-600">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}