import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Shield, Star, Calculator, Palette, Home, Building, Bot } from 'lucide-react'
import { COMPANY_INFO, PAINTING_SERVICES } from '@/lib/constants'

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="pt-18">
        {/* Hero Section */}
        <section className="relative min-h-[650px] lg:min-h-[750px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/man-painting-wall-light-blue.jpg"
              alt="Professional painter at work"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-blue-900/70 to-purple-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {COMPANY_INFO.tagline}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed font-medium">
                Get professional painting quotes in 30 seconds, not 3 days. Our AI assistant 
                understands your project description and creates detailed estimates instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button size="lg" asChild className="text-lg font-semibold h-14 px-10" variant="kofi">
                  <Link href="/get-quote">🤖 Get Free Quote Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg font-semibold h-14 px-10 bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white hover:text-gray-900 hover:border-white">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <Shield className="w-6 h-6 text-blue-300" />
                  <span className="font-medium">{COMPANY_INFO.licenses.join(' • ')}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <Star className="w-6 h-6 fill-current text-yellow-300" />
                  <span className="font-medium">2,000+ Contractors • 50,000+ Quotes</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <Clock className="w-6 h-6 text-purple-300" />
                  <span className="font-medium">Est. {COMPANY_INFO.established}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 lg:py-32 gradient-bg-kofi">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6 gradient-text-kofi">
                Professional Painting Services
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
                From single rooms to entire buildings, we deliver exceptional results 
                with premium materials and expert craftsmanship.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PAINTING_SERVICES.map((service) => {
                const icons = {
                  home: Home,
                  building: Building,
                  briefcase: Calculator,
                  sparkles: Palette
                }
                const Icon = icons[service.icon as keyof typeof icons] || Home
                
                return (
                  <Card key={service.id} className="group card-hover bg-gradient-to-br from-white to-blue-50/30 border-blue-100/50">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-700 transition-colors">{service.name}</CardTitle>
                      <CardDescription className="text-gray-600">{service.description}</CardDescription>
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
                      <p className="text-base font-semibold text-blue-600 mb-6">
                        {service.priceRange}
                      </p>
                      <Button asChild variant="outline" className="w-full group-hover:border-blue-300 group-hover:text-blue-700 group-hover:bg-blue-50">
                        <Link href={`/services/${service.id}`}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI Chat Features Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-600 bg-clip-text text-transparent">
                  AI-Powered Quote Assistant
                </span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Stop spending hours on quotes that customers never accept. Our AI creates 
                professional estimates in 30 seconds that win more jobs and save you time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl w-fit mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Smart Conversations</CardTitle>
                  <CardDescription className="text-gray-600">
                    Chat naturally about your project. Our AI understands context and asks the right questions.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 bg-gradient-to-r from-secondary-500 to-purple-500 rounded-2xl w-fit mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Instant Results</CardTitle>
                  <CardDescription className="text-gray-600">
                    Get accurate quotes in seconds, not days. No waiting for callbacks or site visits.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 bg-gradient-to-r from-accent-500 to-pink-500 rounded-2xl w-fit mb-4">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Professional Accuracy</CardTitle>
                  <CardDescription className="text-gray-600">
                    Based on real contractor data and industry standards for reliable estimates.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" asChild className="text-lg font-semibold h-14 px-10" variant="kofi">
                <Link href="/get-quote">🤖 Try AI Quote Assistant</Link>
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Free to use • No account required • Instant results
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-8 gradient-text">
                  Why Choose {COMPANY_INFO.name}?
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">Instant AI-Powered Quotes</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Get accurate quotes in minutes, not days. Our advanced AI system 
                        analyzes your project details to provide transparent, competitive pricing.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">Premium Quality Guaranteed</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        We use only top-tier paints from trusted brands and employ skilled 
                        professionals who take pride in delivering flawless results.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">Fully Licensed & Insured</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Rest easy knowing we're fully licensed, bonded, and insured. 
                        Your property and project are protected throughout the entire process.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <Button size="lg" asChild variant="kofi">
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
                  className="rounded-3xl shadow-2xl shadow-gray-300/30"
                />
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-3xl shadow-2xl shadow-blue-500/30 border border-white/20">
                  <div className="text-4xl font-bold">{COMPANY_INFO.projectsCompleted.toLocaleString()}+</div>
                  <div className="text-base font-medium opacity-90">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                See why thousands of painting contractors trust our AI quote system
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "This AI quote system saves me 3-4 hours every day. My customers get 
                    professional quotes instantly and I win more jobs because I respond faster."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">Mike Rodriguez</div>
                      <div className="text-sm text-gray-600">Rodriguez Painting Co.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "Increased my quote acceptance rate by 40%. The AI creates professional 
                    estimates that clients trust and the speed gives me a huge advantage."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-gray-600">Elite Painting Solutions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "Game changer for my business. I used to spend all evening doing quotes, 
                    now I finish them in minutes during the day and focus on actual painting."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">David Thompson</div>
                      <div className="text-sm text-gray-600">Thompson Painters</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8 mt-16 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">50,000+</div>
                <div className="text-gray-600">Quotes Generated</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">2,000+</div>
                <div className="text-gray-600">Active Contractors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">30 sec</div>
                <div className="text-gray-600">Average Quote Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Get your free, no-obligation quote in minutes. Our AI-powered system 
              ensures accurate pricing and our team delivers exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg font-semibold h-14 px-10 bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/get-quote">Get Your Free Quote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg font-semibold h-14 px-10 bg-transparent text-white border-2 border-white/50 hover:bg-white hover:text-gray-900 hover:border-white">
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