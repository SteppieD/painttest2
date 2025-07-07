import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Shield,
  Smartphone,
  FileText,
  BarChart3,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: 'Professional Painting Software | Complete Business Management for Contractors',
  description: 'All-in-one professional painting software. Quotes, estimates, customer management, and business analytics. Join 10,000+ contractors growing 40% faster.',
  keywords: 'professional painting software, painting business software, painting contractor management, painting CRM, painting business platform, contractor software suite',
  alternates: {
    canonical: '/professional-painting-software',
  },
  openGraph: {
    title: 'Professional Painting Software - Complete Business Management',
    description: 'All-in-one painting business platform. Quotes, estimates, customer management, and growth analytics in one professional suite.',
    url: '/professional-painting-software',
  },
}

const features = [
  {
    icon: Calculator,
    title: 'Professional Quote System',
    description: 'AI-powered quote generation with industry-standard pricing formulas. Create professional estimates in 6 minutes vs 6 hours.',
    benefits: ['90% faster quote creation', 'Industry-standard calculations', 'Professional PDF output']
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Complete CRM for painting contractors. Track customers, projects, follow-ups, and communication history.',
    benefits: ['Centralized customer database', 'Project tracking', 'Automated follow-ups']
  },
  {
    icon: FileText,
    title: 'Business Documentation',
    description: 'Professional templates, contracts, and documentation system. Everything you need to run a professional operation.',
    benefits: ['Contract templates', 'Quote templates', 'Professional branding']
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Real-time insights into your painting business. Track revenue, win rates, customer acquisition, and growth metrics.',
    benefits: ['Revenue tracking', 'Win rate optimization', 'Growth insights']
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Work from anywhere with mobile-optimized tools. Create quotes on-site, manage customers on the go.',
    benefits: ['On-site quote creation', 'Mobile customer access', 'Offline capability']
  },
  {
    icon: Shield,
    title: 'Professional Security',
    description: 'Enterprise-grade security and data protection. Your business data and customer information stay secure.',
    benefits: ['Data encryption', 'Secure backups', 'Privacy compliance']
  }
]

const testimonials = [
  {
    name: 'Mike Rodriguez',
    company: 'Rodriguez Painting Services',
    quote: 'This software transformed my business. I went from 2-3 quotes per week to 15+ quotes per week. Revenue increased 340% in 8 months.',
    results: '340% revenue increase'
  },
  {
    name: 'Sarah Chen',
    company: 'Premium Paint Pros',
    quote: 'The professional image this software gives my business is incredible. Customers see the detailed quotes and immediately trust our expertise.',
    results: '60% higher win rate'
  },
  {
    name: 'David Thompson',
    company: 'Thompson Family Painting',
    quote: 'From a one-man operation to a 6-person team in 18 months. This software handled our growth without missing a beat.',
    results: '6x team growth'
  }
]

const pricingPlans = [
  {
    name: 'Professional',
    price: '$49',
    period: 'per month',
    description: 'Perfect for established painting contractors',
    features: [
      'Unlimited quotes and customers',
      'Professional quote templates',
      'Customer management system',
      'Business analytics dashboard',
      'Mobile app access',
      'Email support'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'For growing painting businesses',
    features: [
      'Everything in Professional',
      'Team collaboration tools',
      'Advanced analytics',
      'Custom branding',
      'Priority phone support',
      'Training and onboarding'
    ]
  }
]

export default function ProfessionalPaintingSoftwarePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Professional Painting Software for Serious Contractors
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Complete business management platform trusted by 10,000+ painting contractors. 
                Quotes, customers, analytics, and growth tools in one professional suite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/trial-signup">
                    <Zap className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/features">
                    View All Features
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-blue-200">Active Contractors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$50M+</div>
                  <div className="text-blue-200">Quotes Generated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">340%</div>
                  <div className="text-blue-200">Avg Revenue Growth</div>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <img 
                src="/api/placeholder/600/400" 
                alt="Professional Painting Software Dashboard"
                className="rounded-lg shadow-2xl border border-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run a Professional Painting Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From your first quote to scaling a multi-crew operation, our platform grows with your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Successful Painting Contractors
            </h2>
            <p className="text-xl text-gray-600">
              See how professional painting software transforms businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardHeader>
                <CardContent>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                    <div className="text-sm font-medium text-green-600 mt-2">{testimonial.results}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Professional Plans for Every Business Size
            </h2>
            <p className="text-xl text-gray-600">
              Start with a 14-day free trial. No contracts, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`h-full ${plan.popular ? 'border-2 border-blue-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600">
                    {plan.price}<span className="text-lg text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/trial-signup">
                      Start Free Trial
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Painting Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 10,000+ successful painting contractors using professional software to scale their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/trial-signup">
                Start 14-Day Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">
                Schedule Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}