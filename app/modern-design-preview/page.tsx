import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  Zap, 
  TrendingUp,
  Users,
  Target,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Smartphone,
  Calculator,
  PaintBucket,
  ChartBar,
  Shield,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/shared/footer';

// Import the new design system
import '@/styles/adcreative-inspired.css';

export const metadata: Metadata = {
  title: 'Modern Design Preview | ProPaint Quote',
  description: 'Experience the new vibrant, modern design inspired by cutting-edge SaaS platforms',
};

export default function ModernDesignPreview() {
  const stats = [
    { number: "5,000+", label: "Active Contractors", icon: Users },
    { number: "40%", label: "Win Rate Increase", icon: TrendingUp },
    { number: "30 sec", label: "Quote Creation", icon: Clock },
    { number: "4.9/5", label: "Customer Rating", icon: Star }
  ];

  const features = [
    {
      icon: Calculator,
      title: "AI-Powered Estimates",
      description: "Smart calculations that learn from your quote history and suggest optimal pricing"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Create professional quotes on-site from any device, even offline"
    },
    {
      icon: ChartBar,
      title: "Business Intelligence",
      description: "Track win rates, revenue trends, and optimize your pricing strategy"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and SOC 2 compliance for total data protection"
    }
  ];

  const testimonials = [
    {
      quote: "ProPaint Quote transformed our business. We're winning 70% more jobs!",
      author: "Mike Johnson",
      company: "Elite Painting Co.",
      rating: 5
    },
    {
      quote: "The mobile app is incredible. I close deals right in the customer's driveway.",
      author: "Sarah Martinez",
      company: "ProPaint Solutions",
      rating: 5
    },
    {
      quote: "From $180K to $420K revenue in 18 months. This software pays for itself!",
      author: "David Chen",
      company: "Precision Painters",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section with AdCreative.ai Style */}
      <section className="ad-hero relative">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center ad-badge ad-badge-pink mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Introducing Our New Design</span>
            </div>
            
            <h1 className="ad-heading-hero mb-6">
              Create <span className="ad-gradient-text">Stunning Quotes</span><br />
              Win More Painting Jobs
            </h1>
            
            <p className="ad-text-lg max-w-3xl mx-auto mb-8 text-gray-600">
              Join 5,000+ painting contractors using AI-powered quoting software. 
              Create professional estimates in 30 seconds, increase win rates by 40%, 
              and grow your business with data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="ad-button ad-button-primary text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="ad-button ad-button-secondary text-lg px-8 py-4">
                Watch Demo
                <Zap className="w-5 h-5" />
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>5 minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="ad-feature-icon mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ad-heading-2 ad-gradient-text">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="ad-heading-1 mb-4">
              Everything You Need to <span className="ad-gradient-text">Grow</span>
            </h2>
            <p className="ad-text-lg max-w-2xl mx-auto">
              Professional tools designed specifically for painting contractors, 
              backed by AI and loved by thousands.
            </p>
          </div>
          
          <div className="ad-feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="ad-feature-card">
                  <div className="ad-feature-icon">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="ad-heading-1 mb-4">
              Contractors <span className="ad-gradient-text">Love</span> ProPaint Quote
            </h2>
            <p className="ad-text-lg">
              Real stories from painting professionals who transformed their business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="ad-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm ad-gradient-text font-medium">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="ad-card bg-gradient-to-br from-purple-50 to-pink-50 border-0">
            <Rocket className="w-16 h-16 text-pink-500 mx-auto mb-6" />
            <h2 className="ad-heading-1 mb-6">
              Ready to <span className="ad-gradient-text">Transform</span> Your Business?
            </h2>
            <p className="ad-text-lg mb-8">
              Join 5,000+ contractors who are winning more jobs and growing faster with ProPaint Quote.
            </p>
            
            <button className="ad-button ad-button-primary text-lg px-12 py-4">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Full access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design System Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="ad-heading-1 mb-4">Design System Elements</h2>
            <p className="ad-text-lg">Preview of AdCreative.ai-inspired components</p>
          </div>
          
          <div className="space-y-8">
            {/* Buttons */}
            <div className="ad-card">
              <h3 className="text-xl font-bold mb-6">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="ad-button ad-button-primary">Primary Button</button>
                <button className="ad-button ad-button-secondary">Secondary Button</button>
                <button className="ad-button ad-button-primary" disabled style={{opacity: 0.6, cursor: 'not-allowed'}}>
                  Disabled Button
                </button>
              </div>
            </div>
            
            {/* Badges */}
            <div className="ad-card">
              <h3 className="text-xl font-bold mb-6">Badges</h3>
              <div className="flex flex-wrap gap-4">
                <div className="ad-badge">
                  <Sparkles className="w-4 h-4" />
                  Default Badge
                </div>
                <div className="ad-badge ad-badge-pink">
                  <Zap className="w-4 h-4" />
                  Pink Badge
                </div>
              </div>
            </div>
            
            {/* Typography */}
            <div className="ad-card">
              <h3 className="text-xl font-bold mb-6">Typography</h3>
              <div className="space-y-4">
                <h1 className="ad-heading-hero">Hero Heading</h1>
                <h2 className="ad-heading-1">Heading 1</h2>
                <h3 className="ad-heading-2">Heading 2</h3>
                <p className="ad-text-lg">Large body text for important descriptions</p>
                <p className="ad-gradient-text text-2xl font-bold">Gradient Text Effect</p>
              </div>
            </div>
            
            {/* Cards */}
            <div className="ad-card">
              <h3 className="text-xl font-bold mb-6">Card Styles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ad-feature-card">
                  <div className="ad-feature-icon">
                    <PaintBucket className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-2">Feature Card</h4>
                  <p className="text-gray-600 text-sm">Hover me to see the effect</p>
                </div>
                <div className="ad-card" style={{padding: '1.5rem'}}>
                  <h4 className="font-bold mb-2">Standard Card</h4>
                  <p className="text-gray-600 text-sm">With top border on hover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}