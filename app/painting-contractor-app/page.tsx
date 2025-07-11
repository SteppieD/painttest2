import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  Clock,
  DollarSign,
  Users,
  Camera,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Painting Contractor App - Mobile Quote & Business Management | ProPaint Quote',
  description: 'Painting contractor app for iOS and Android. Create professional quotes on-site, manage customers, track jobs, and grow your painting business. 5,000+ contractors save 10 hours weekly.',
  keywords: 'painting contractor app, painting business app, painting estimate app, contractor mobile app, painting quote app, painting job management app, contractor business app, painting contractor software mobile',
  alternates: {
    canonical: '/painting-contractor-app',
  },
  openGraph: {
    title: 'Painting Contractor App - Professional Mobile Business Management',
    description: 'Painting contractor app lets you create quotes on-site, manage customers, and track jobs from your phone. Join 5,000+ contractors growing their business.',
    url: '/painting-contractor-app',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function PaintingContractorAppPage() {
  // App features
  const appFeatures = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "On-Site Quote Creation",
      description: "Create professional quotes in 5 minutes while with customers",
      benefit: "Close 3x more deals"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Photo Measurements",
      description: "Snap photos to calculate room dimensions automatically",
      benefit: "80% faster estimates"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Management",
      description: "Track leads, customers, and job history in one place",
      benefit: "Never lose a lead"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Analytics",
      description: "Real-time revenue, job tracking, and performance metrics",
      benefit: "Data-driven growth"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Job Scheduling",
      description: "Calendar view with crew assignments and reminders",
      benefit: "Zero double-bookings"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Sync",
      description: "Access your business from any device, anywhere",
      benefit: "Work from anywhere"
    }
  ];

  // Time savings breakdown
  const timeSavings = [
    { task: "Creating quotes", before: "45 min", after: "5 min", saved: "40 min/quote" },
    { task: "Customer follow-up", before: "2 hours/day", after: "15 min", saved: "1.75 hours/day" },
    { task: "Job scheduling", before: "1 hour/day", after: "10 min", saved: "50 min/day" },
    { task: "Invoicing", before: "30 min", after: "2 min", saved: "28 min/invoice" },
    { task: "Revenue tracking", before: "3 hours/week", after: "Real-time", saved: "3 hours/week" }
  ];

  // App workflow
  const workflow = [
    {
      step: "1",
      title: "Download & Setup",
      description: "Install from App Store or Google Play, create account in 2 minutes"
    },
    {
      step: "2",
      title: "Customize Settings",
      description: "Add your logo, set pricing, choose paint brands"
    },
    {
      step: "3",
      title: "Create First Quote",
      description: "Use camera or manual entry to build professional quote"
    },
    {
      step: "4",
      title: "Send to Customer",
      description: "Email or text quote instantly, get e-signatures"
    },
    {
      step: "5",
      title: "Track Everything",
      description: "Monitor jobs, payments, and business growth"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 50 quotes/month",
        "Basic customer management",
        "Email support",
        "1 user account",
        "Standard templates"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: [
        "Unlimited quotes",
        "Advanced CRM features",
        "Priority support",
        "5 user accounts",
        "Custom branding",
        "Photo measurements",
        "Analytics dashboard"
      ],
      cta: "Most Popular",
      popular: true
    },
    {
      name: "Business",
      price: "$149",
      period: "/month",
      features: [
        "Everything in Pro",
        "Unlimited users",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Training included",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  // Success stories
  const successStories = [
    {
      quote: "This app transformed my business. I'm creating quotes 10x faster and winning more jobs.",
      author: "Carlos Rodriguez",
      company: "Rodriguez Painting LLC",
      metric: "+156% revenue",
      rating: 5
    },
    {
      quote: "The photo measurement feature alone saves me 2 hours per day. Game changer!",
      author: "Sarah Chen",
      company: "Premium Painters Inc",
      metric: "10 hrs/week saved",
      rating: 5
    },
    {
      quote: "Finally, an app designed BY contractors FOR contractors. Everything just makes sense.",
      author: "Mike Thompson",
      company: "Thompson & Sons",
      metric: "45% more quotes won",
      rating: 5
    }
  ];

  // App stats
  const appStats = [
    { stat: "5,000+", label: "Active Contractors" },
    { stat: "250K+", label: "Quotes Created" },
    { stat: "4.8/5", label: "App Store Rating" },
    { stat: "$125M+", label: "Quotes Generated" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
                #1 Contractor App
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Painting Contractor App for Growing Your Business
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Painting contractor app that lets you create professional quotes on-site, 
                manage customers, and track jobs from your phone. Join 5,000+ contractors 
                saving 10 hours per week.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/trial-signup">
                    Download Free App
                    <Download className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link href="#features">
                    See Features
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">iOS & Android</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">5,000+ Users</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl transform rotate-6 opacity-20"></div>
              <Card className="relative shadow-2xl border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8">
                <div className="text-center mb-6">
                  <Smartphone className="w-20 h-20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Available Now</h3>
                  <p className="text-blue-100">Download on iOS & Android</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-black hover:bg-gray-900 text-white" asChild>
                    <Link href="/trial-signup">
                      <div className="text-left">
                        <p className="text-xs">Download on the</p>
                        <p className="text-sm font-bold">App Store</p>
                      </div>
                    </Link>
                  </Button>
                  <Button className="bg-black hover:bg-gray-900 text-white" asChild>
                    <Link href="/trial-signup">
                      <div className="text-left">
                        <p className="text-xs">Get it on</p>
                        <p className="text-sm font-bold">Google Play</p>
                      </div>
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* App Stats */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {appStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.stat}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Painting Contractor App
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools that work as hard as you do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {feature.benefit}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Time Savings */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Save 10+ Hours Every Week
            </h2>
            <p className="text-xl text-gray-600">
              See exactly where the painting contractor app saves you time
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-4 text-left">Task</th>
                    <th className="px-6 py-4 text-left">Before App</th>
                    <th className="px-6 py-4 text-left">With App</th>
                    <th className="px-6 py-4 text-left">Time Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSavings.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{item.task}</td>
                      <td className="px-6 py-4 text-red-600">{item.before}</td>
                      <td className="px-6 py-4 text-green-600">{item.after}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{item.saved}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50">
                    <td colSpan={3} className="px-6 py-4 font-bold text-right">Total Weekly Savings:</td>
                    <td className="px-6 py-4 font-bold text-xl text-blue-600">10+ hours</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Using the App in 5 Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Simple setup process to get you quoting faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {workflow.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-2 w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contractors Love Our App
            </h2>
            <p className="text-xl text-gray-600">
              Real results from painting professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{story.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{story.author}</p>
                    <p className="text-sm text-gray-600">{story.company}</p>
                    <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                      {story.metric}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Pricing for Every Painting Business
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-600 shadow-xl' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1 bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} asChild>
                    <Link href="/trial-signup">
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <Card className="overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Why Mobile Matters for Contractors
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Close Deals On-Site</h3>
                      <p className="text-blue-100 text-sm">Customers are 3x more likely to sign when you quote immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Work From Anywhere</h3>
                      <p className="text-blue-100 text-sm">Manage your business from job sites, home, or vacation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Never Lose Data</h3>
                      <p className="text-blue-100 text-sm">Cloud backup protects your business information</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6">App Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Works offline at job sites</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Syncs across all devices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Integrates with QuickBooks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Accepts digital signatures</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Processes payments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Sends automatic reminders</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join 5,000+ Contractors Growing with Our App
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Download the painting contractor app that saves you 10+ hours per week 
            and helps you win more jobs. Free 14-day trial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/trial-signup">
                Download Free App
                <Download className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/features">
                Compare Features
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              iOS & Android
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              No credit card
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}