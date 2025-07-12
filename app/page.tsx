import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Shield, Star, Calculator, Palette, Home, Building, Bot, FileText } from 'lucide-react'
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
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-white/90 text-sm font-medium">Trusted by 5,247+ Painting Contractors</span>
                </div>
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                The Quote Tool Built<br />For Painting Contractors
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed font-medium">
                Create professional painting quotes in <strong>30 seconds instead of 3 hours</strong>. Close deals on the spot while your competitors are still driving back to the office.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button size="lg" asChild className="text-lg font-semibold h-14 px-10" variant="kofi">
                  <Link href="/trial-signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg font-semibold h-14 px-10 bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white hover:text-gray-900 hover:border-white">
                  <Link href="/get-quote">See How It Works</Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-4 h-4" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-4 h-4" />
                  <span>30-day guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-4 h-4" />
                  <span>2-min setup</span>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">M</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">J</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">D</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">+</div>
                  </div>
                  <span className="font-medium">5,247+ Active</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <Star className="w-6 h-6 fill-current text-yellow-300" />
                  <span className="font-medium">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Instant Quote Generator LIVE
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Watch a Quote Generated in Real Time
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how contractors create professional quotes in seconds, not hours
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="ml-4 font-medium">Paint Quote Pro - Live Demo</span>
                    </div>
                    <div className="text-sm opacity-90">paintquoteapp.com</div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">1</span>
                          </div>
                          Customer: Johnson Residence
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 mb-2">
                            <strong>Project:</strong> Interior painting for 3 bedrooms, living room, and kitchen
                          </p>
                          <p className="text-gray-700 mb-2">
                            <strong>Square footage:</strong> 2,100 sq ft
                          </p>
                          <p className="text-gray-700">
                            <strong>Paint quality:</strong> Premium (Benjamin Moore Advance)
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 text-green-600 font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          Quote generated automatically
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <div className="text-center">
                        <div className="mb-4">
                          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-sm text-green-700">Time</div>
                          <div className="text-3xl font-bold text-green-800">28 sec</div>
                        </div>
                        
                        <div className="border-t border-green-200 pt-4 mb-4">
                          <div className="text-sm text-green-700">Total</div>
                          <div className="text-4xl font-bold text-green-800">$4,850</div>
                        </div>
                        
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Send to Customer
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">+47%</div>
                            <div className="text-xs text-gray-600">More Jobs</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">32hrs</div>
                            <div className="text-xs text-gray-600">Saved/mo</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button size="lg" asChild variant="kofi" className="text-lg font-semibold h-14 px-10">
                  <Link href="/trial-signup">Try This For Free - No Credit Card Required</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contractor Pain Points Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Built By Contractors, For Contractors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We know the challenges you face every day. That's why we built the solution.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                    <Clock className="w-10 h-10 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Losing Jobs to Faster Competitors?</h3>
                <p className="text-gray-600 mb-4">
                  While you're driving back to the office to create a quote, your competitor already sent theirs.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  ✓ Create quotes on-site in 30 seconds
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                    <Calculator className="w-10 h-10 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Calculation Errors Eating Profits?</h3>
                <p className="text-gray-600 mb-4">
                  One math mistake can turn a profitable job into a loss. Manual calculations are risky.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  ✓ AI-powered accuracy every time
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                    <FileText className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Unprofessional Handwritten Quotes?</h3>
                <p className="text-gray-600 mb-4">
                  First impressions matter. Scribbled estimates on notepads don't inspire confidence.
                </p>
                <p className="text-sm font-semibold text-green-600">
                  ✓ Beautiful PDFs that win trust
                </p>
              </div>
            </div>
            
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 lg:p-12 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">
                  The Math is Simple
                </h3>
                <p className="text-xl mb-8 opacity-90">
                  Win just ONE extra job per month and ProPaint Quote pays for itself 10x over
                </p>
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <div className="text-4xl font-bold mb-2">$2,800</div>
                    <div className="text-sm opacity-80">Average job value</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">$79</div>
                    <div className="text-sm opacity-80">Monthly cost</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">35x</div>
                    <div className="text-sm opacity-80">Return on investment</div>
                  </div>
                </div>
                <Button size="lg" variant="secondary" asChild className="bg-white text-primary-600 hover:bg-gray-100">
                  <Link href="/roi-calculator">Calculate Your ROI →</Link>
                </Button>
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
                <Link href="/get-quote">🔨 Try Quote Builder Demo</Link>
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Built for contractors • No credit card • See it in action
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
                Real Results from Real Contractors
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                See how painting contractors across America have transformed their businesses with professional quoting
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-green-600 mb-2">340%</div>
                    <div className="text-lg font-semibold text-gray-900">Revenue Increase</div>
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "We went from $150K to $500K in just 18 months. The speed of quoting changed everything."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">Mike's Painting Co.</div>
                      <div className="text-sm text-gray-600">Denver, CO</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-blue-600 mb-2">85%</div>
                    <div className="text-lg font-semibold text-gray-900">Time Saved</div>
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "What used to take me 3 hours now takes 30 seconds. I can bid on 10x more jobs."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">Professional Painters LLC</div>
                      <div className="text-sm text-gray-600">Austin, TX</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-purple-600 mb-2">60%</div>
                    <div className="text-lg font-semibold text-gray-900">Close Rate</div>
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "Professional quotes impress customers. Our close rate doubled in 90 days."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      E
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">Elite Coatings</div>
                      <div className="text-sm text-gray-600">Miami, FL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" asChild className="text-lg font-semibold">
                <Link href="/painting-contractor-software-case-study">Read Full Case Studies</Link>
              </Button>
            </div>

            {/* Industry-Wide Results */}
            <div className="mt-20 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry-Wide Results</h3>
              <p className="text-gray-600 mb-12">Based on data from 5,000+ active contractors using our platform</p>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="text-5xl font-bold text-green-600 mb-2">47%</div>
                  <div className="text-gray-700 font-medium">Average win rate increase</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">$8,400</div>
                  <div className="text-gray-700 font-medium">Average monthly revenue increase</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-purple-600 mb-2">4.2x</div>
                  <div className="text-gray-700 font-medium">Faster quote delivery</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-600 mb-2">94%</div>
                  <div className="text-gray-700 font-medium">Customer satisfaction rate</div>
                </div>
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
            <div className="inline-flex items-center gap-2 bg-red-500 text-white rounded-full px-6 py-3 text-lg font-bold mb-8 animate-pulse">
              <span>⏰ Limited Time Offer</span>
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to 14x Your Quote Speed?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Join 5,000+ contractors winning more jobs with professional quotes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button size="lg" variant="secondary" asChild className="text-lg font-semibold h-14 px-10 bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/trial-signup">Start Free Trial - 10 Quotes Included</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg font-semibold h-14 px-10 bg-transparent text-white border-2 border-white/50 hover:bg-white hover:text-gray-900 hover:border-white">
                <Link href="/get-quote">Watch Demo</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Full feature access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}