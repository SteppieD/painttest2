import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Clock, Shield, Star, Phone } from 'lucide-react'
import { PAINTING_SERVICES, COMPANY_INFO } from '@/lib/constants'

export async function generateStaticParams() {
  return PAINTING_SERVICES.map((service) => ({
    service: service.id,
  }))
}

export async function generateMetadata({ params }: { params: { service: string } }) {
  const service = PAINTING_SERVICES.find(s => s.id === params.service)
  if (!service) return {}

  return {
    title: `${service.name} - Professional Painting Services`,
    description: `${service.description}. Get instant quotes for ${service.name.toLowerCase()} projects. ${COMPANY_INFO.name} - Licensed, bonded, and insured.`,
    openGraph: {
      title: `${service.name} - ${COMPANY_INFO.name}`,
      description: service.description,
    }
  }
}

const serviceImages = {
  interior: '/images/woman-painting-wall-grey-smiling.jpg',
  exterior: '/images/man-painting-exterior-highrise-tropical.jpg',
  commercial: '/images/construction-contractor-using-computer-smiling.jpg',
  specialty: '/images/woman-painting-wall-orange.jpg'
}

const serviceDetails = {
  interior: {
    process: [
      'Initial consultation and color selection',
      'Furniture protection and room preparation',
      'Surface repair and priming as needed',
      'Professional paint application',
      'Clean-up and final inspection'
    ],
    benefits: [
      'Transform your living spaces',
      'Increase home value',
      'Professional color consultation',
      'Minimal disruption to daily life',
      'Long-lasting results'
    ]
  },
  exterior: {
    process: [
      'Comprehensive exterior inspection',
      'Power washing and surface preparation',
      'Repairs and caulking as needed',
      'Premium paint application',
      'Complete cleanup and inspection'
    ],
    benefits: [
      'Protect your home from weather',
      'Boost curb appeal instantly',
      'Prevent costly repairs',
      'Energy efficiency improvements',
      'Warranty protection'
    ]
  },
  commercial: {
    process: [
      'Project planning and scheduling',
      'Minimal business disruption strategy',
      'Professional crew deployment',
      'Quality control throughout',
      'Final walkthrough and approval'
    ],
    benefits: [
      'Professional business image',
      'Flexible scheduling options',
      'Experienced commercial crews',
      'Competitive bulk pricing',
      'Long-term maintenance plans'
    ]
  },
  specialty: {
    process: [
      'Design consultation',
      'Surface preparation and priming',
      'Specialized technique application',
      'Multiple coating layers as needed',
      'Protective sealing and finishing'
    ],
    benefits: [
      'Unique, custom finishes',
      'Expert craftsmanship',
      'Premium materials only',
      'Artistic expertise',
      'Stunning visual impact'
    ]
  }
}

export default function ServicePage({ params }: { params: { service: string } }) {
  const service = PAINTING_SERVICES.find(s => s.id === params.service)
  if (!service) notFound()

  const details = serviceDetails[service.id as keyof typeof serviceDetails]
  const heroImage = serviceImages[service.id as keyof typeof serviceImages]

  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt={service.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-900/70" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 py-16">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                {service.name}
              </h1>
              <p className="text-xl text-gray-200 mb-6">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/get-quote">Get Free Quote</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white hover:text-secondary-900">
                  <a href={`tel:${COMPANY_INFO.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-secondary-900 mb-6">
                  What's Included
                </h2>
                <div className="space-y-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-2xl font-semibold text-primary-600">
                  Starting at {service.priceRange}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Shield className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Fully Insured</h3>
                    <p className="text-sm text-gray-600">Complete protection for your property</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Star className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                    <p className="text-sm text-gray-600">100% satisfaction or we make it right</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Clock className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">On-Time Promise</h3>
                    <p className="text-sm text-gray-600">We respect your time and schedule</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <CheckCircle className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Premium Materials</h3>
                    <p className="text-sm text-gray-600">Only the best paints and supplies</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-secondary-900 mb-8 text-center">
                Our Process
              </h2>
              <div className="space-y-6">
                {details.process.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-8 text-center">
              Why Choose Our {service.name}?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {details.benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <CheckCircle className="w-8 h-8 text-primary-600 mb-3" />
                  <p className="font-medium text-gray-800">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Start Your {service.name} Project?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get your free quote in minutes. No obligations, no hidden fees, 
              just transparent pricing and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/get-quote">Get Your Free Quote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-secondary-900">
                <Link href="/calculator">Try Our Calculator</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}