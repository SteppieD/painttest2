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
    <div>
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <h1>
                Professional Painting Software for Serious Contractors
              </h1>
              <p>
                Complete business management platform trusted by 10,000+ painting contractors. 
                Quotes, customers, analytics, and growth tools in one professional suite.
              </p>
              <div>
                <Button asChild size="lg">
                  <Link href="/trial-signup">
                    <Zap />
                    Start Free Trial
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/features">
                    View All Features
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
              <div>
                <div>
                  <div>10,000+</div>
                  <div>Active Contractors</div>
                </div>
                <div>
                  <div>$50M+</div>
                  <div>Quotes Generated</div>
                </div>
                <div>
                  <div>340%</div>
                  <div>Avg Revenue Growth</div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Professional Painting Software Dashboard"
               
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h2>
              Everything You Need to Run a Professional Painting Business
            </h2>
            <p>
              From your first quote to scaling a multi-crew operation, our platform grows with your business.
            </p>
          </div>
          
          <div>
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    <feature.icon />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                  <ul>
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <CheckCircle />
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
      <section>
        <div>
          <div>
            <h2>
              Trusted by Successful Painting Contractors
            </h2>
            <p>
              See how professional painting software transforms businesses
            </p>
          </div>
          
          <div>
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>"{testimonial.quote}"</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>{testimonial.name}</div>
                    <div>{testimonial.company}</div>
                    <div>{testimonial.results}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <div>
          <div>
            <h2>
              Professional Plans for Every Business Size
            </h2>
            <p>
              Start with a 14-day free trial. No contracts, cancel anytime.
            </p>
          </div>
          
          <div>
            {pricingPlans.map((plan, index) => (
              <Card key={index}`}>
                {plan.popular && (
                  <div>
                    <span>
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div>
                    {plan.price}<span>/{plan.period}</span>
                  </div>
                  <p>{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg">
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
      <section>
        <div>
          <h2>
            Ready to Grow Your Painting Business?
          </h2>
          <p>
            Join 10,000+ successful painting contractors using professional software to scale their business.
          </p>
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start 14-Day Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
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