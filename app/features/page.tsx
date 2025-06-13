import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  Smartphone,
  Users,
  TrendingUp,
  Shield,
  Palette,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Features - ProPaint Quote Software for Professional Contractors',
  description: 'Discover all the powerful features of ProPaint Quote. Smart calculators, mobile optimization, customer management, and profit analytics for painting contractors.',
  keywords: 'painting software features, quote calculator, mobile estimating, contractor tools, painting business management',
  alternates: {
    canonical: '/features',
  },
  openGraph: {
    title: 'Features - ProPaint Quote Software',
    description: 'Powerful features designed specifically for painting contractors to create accurate quotes and grow their business.',
    url: '/features',
  },
};

export default function FeaturesPage() {
  const features = [
    {
      icon: Calculator,
      title: 'Smart Quote Calculator',
      description: 'Industry-standard formulas automatically calculate materials, labor, and markup. Built by contractors, for contractors.',
      benefits: [
        'Accurate material calculations',
        'Labor cost estimation',
        'Automatic markup application',
        'Paint coverage calculations'
      ]
    },
    {
      icon: Clock,
      title: '5-Minute Professional Quotes',
      description: 'Generate detailed, professional quotes faster than your competition. Respond to leads while they\'re still hot.',
      benefits: [
        'Instant quote generation',
        'Professional PDF exports',
        'Branded quote templates',
        'Mobile-friendly delivery'
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Create quotes on-site with your phone or tablet. Perfect for walk-through estimates and immediate responses.',
      benefits: [
        'Works on any device',
        'Offline capability',
        'Touch-optimized interface',
        'Camera integration ready'
      ]
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Keep track of all your quotes and customers in one place. Never lose a lead or forget to follow up.',
      benefits: [
        'Complete customer database',
        'Quote history tracking',
        'Follow-up reminders',
        'Lead conversion tracking'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Profit Analytics',
      description: 'Track your business performance with detailed analytics. See what\'s working and optimize for growth.',
      benefits: [
        'Win rate tracking',
        'Average job value',
        'Profit margin analysis',
        'Monthly growth reports'
      ]
    },
    {
      icon: Shield,
      title: 'Professional Branding',
      description: 'Stand out from competitors with professional, branded quotes that build trust and credibility.',
      benefits: [
        'Custom logo integration',
        'Branded quote templates',
        'Professional presentation',
        'Trust-building design'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Palette className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProPaint Quote</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/features" className="text-blue-600 font-medium">Features</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Button asChild>
                <Link href="/access-code">Start Free Trial</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to <span className="text-blue-600">Quote Like a Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ProPaint Quote is packed with features designed specifically for painting contractors who want to win more jobs and increase their profit margins.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/access-code">
              Try All Features Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-blue-600 mb-4" />
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience All These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free 14-day trial and see how ProPaint Quote can transform your painting business
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/access-code">
              Start Free Trial Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • Full access to all features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">ProPaint Quote</span>
          </div>
          <p className="text-gray-400 mb-8">
            Professional painting quote software for contractors who want to win more jobs and increase profits.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/features" className="hover:text-white">Features</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProPaint Quote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}