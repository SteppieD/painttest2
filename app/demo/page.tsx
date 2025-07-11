import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Play, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Users, 
  Target, 
  Smartphone, 
  Calculator, 
  TrendingUp,
  Shield,
  Zap,
  PhoneCall,
  Calendar,
  Award,
  Eye,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Live Demo - See ProPaint Quote in Action | Professional Painting Software',
  description: 'Watch a live demo of ProPaint Quote - the painting contractor software trusted by 5,000+ professionals. See how to create quotes in 5 minutes and increase win rates by 40%.',
  keywords: 'painting software demo, quote software demonstration, contractor tool preview, painting estimator demo, live software walkthrough',
  alternates: {
    canonical: '/demo',
  },
  openGraph: {
    title: 'Live Demo - ProPaint Quote Painting Contractor Software',
    description: 'See how 5,000+ contractors create professional quotes in minutes. Watch our live demo and discover why painters increase win rates by 40%.',
    url: '/demo',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function DemoPage() {
  // Social proof statistics
  const demoStats = [
    { icon: Users, number: "5,000+", label: "Active Contractors", color: "text-blue-600" },
    { icon: Target, number: "40%", label: "Higher Win Rates", color: "text-green-600" },
    { icon: Clock, number: "5 Min", label: "Average Quote Time", color: "text-purple-600" },
    { icon: Award, number: "95%", label: "Quote Accuracy", color: "text-orange-600" }
  ];

  // Demo features to highlight
  const demoFeatures = [
    {
      icon: Calculator,
      title: "Smart Quote Calculator",
      description: "Watch how AI-powered calculations ensure 95% accuracy every time",
      duration: "2 minutes",
      highlight: "Industry-leading formulas"
    },
    {
      icon: Smartphone,
      title: "Mobile Quoting",
      description: "See how contractors create quotes on-site using just their phone",
      duration: "3 minutes", 
      highlight: "Works offline"
    },
    {
      icon: TrendingUp,
      title: "Professional Presentations",
      description: "Discover how beautiful quotes convert 40% more prospects",
      duration: "2 minutes",
      highlight: "Impress every customer"
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Learn how data-driven insights increase profit margins",
      duration: "3 minutes",
      highlight: "Track what matters"
    }
  ];

  // Customer success stories for social proof
  const successStories = [
    {
      quote: "The demo convinced me immediately. I saw how professional our quotes could look and knew this would help us win more jobs.",
      author: "Mike Johnson",
      company: "Elite Painting Co.",
      result: "70% win rate increase",
      avatar: "M"
    },
    {
      quote: "Within 15 minutes of the demo, I understood how this would save us hours every day. The ROI was obvious.",
      author: "Sarah Martinez", 
      company: "ProPaint Solutions",
      result: "3x faster quotes",
      avatar: "S"
    },
    {
      quote: "The demo showed exactly what we needed - professional presentations that close more deals. Game changer.",
      author: "David Chen",
      company: "Precision Painters",
      result: "$15K job closed on-site",
      avatar: "D"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 5,000+ Professional Painting Contractors</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            See Why Contractors Choose <span className="text-blue-600">ProPaint Quote</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Watch a live demonstration of the painting contractor software that's helping professionals 
            increase win rates by 40% and create quotes in 5 minutes instead of hours.
          </p>
          
          {/* Demo Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {demoStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Play className="w-5 h-5 mr-2" />
              Watch Live Demo Now
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                Skip Demo - Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            ⚡ 10-minute demo • No software download required • See real features
          </p>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              10-Minute Demo: Everything You Need to See
            </h2>
            <p className="text-xl text-gray-600">
              Watch real contractors use ProPaint Quote to transform their quoting process
            </p>
          </div>
          
          {/* Video Placeholder with Play Button */}
          <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white rounded-full p-6 mb-4 inline-block shadow-lg">
                  <Play className="w-12 h-12 text-blue-600 ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Click to Watch Demo</h3>
                <p className="text-gray-600">See ProPaint Quote in action - real features, real results</p>
              </div>
            </div>
            
            {/* Demo Duration Badge */}
            <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              10:23
            </div>
          </div>
          
          {/* Demo Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <div className="text-sm text-gray-500">{feature.duration} in demo</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      {feature.highlight}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Contractors Say After the Demo
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from painting professionals who've seen ProPaint Quote in action
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  {/* Quote */}
                  <div className="mb-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{story.quote}"</p>
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {story.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{story.author}</div>
                      <div className="text-sm text-gray-600">{story.company}</div>
                    </div>
                  </div>
                  
                  {/* Result Badge */}
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {story.result}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Try It Yourself?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Don't just watch - experience ProPaint Quote firsthand with our interactive demo account
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-6 mb-4">
                  <Eye className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Interactive Demo</h3>
                  <p className="text-blue-100">Try all features with demo data</p>
                </div>
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/dashboard-modern">
                    Try Interactive Demo
                    <Zap className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <p className="text-sm text-blue-200 mt-2">Access code: DEMO2024</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-6 mb-4">
                  <PhoneCall className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Personalized Demo</h3>
                  <p className="text-blue-100">1-on-1 demo with your project data</p>
                </div>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/contact">
                    Schedule Personal Demo
                    <Calendar className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <p className="text-sm text-blue-200 mt-2">15-minute call • Free consultation</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                <Shield className="w-4 h-4" />
                <span>Risk-Free: Start with 1 Free Quote</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-blue-200 text-sm">
                <span>✓ No credit card required</span>
                <span>✓ Full feature access</span>
                <span>✓ Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Demo Questions & Answers
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our demo and software
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "How long is the demo?",
                a: "Our comprehensive demo is about 10 minutes and covers all major features. You can also try our interactive demo anytime with access code DEMO2024."
              },
              {
                q: "Can I try the software after watching the demo?",
                a: "Absolutely! You can start with 1 free quote immediately after the demo. No credit card required, and you'll have access to all features."
              },
              {
                q: "Do I need to download anything for the demo?",
                a: "No downloads required. Both our video demo and interactive demo run directly in your web browser on any device."
              },
              {
                q: "Can I get a personalized demo with my project data?",
                a: "Yes! We offer free 15-minute personalized demos where we'll use your actual project data to show you exactly how ProPaint Quote works for your business."
              },
              {
                q: "What if I have questions during the demo?",
                a: "For live questions, schedule a personalized demo. For the video demo, our support team is available via chat or email to answer any questions."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data for Demo Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "ProPaint Quote Software Demo",
            "description": "Watch how professional painting contractors create quotes in 5 minutes and increase win rates by 40%",
            "thumbnailUrl": "https://propaintquote.com/demo-thumbnail.jpg",
            "uploadDate": "2025-01-01",
            "duration": "PT10M23S",
            "contentUrl": "https://propaintquote.com/demo-video",
            "embedUrl": "https://propaintquote.com/demo",
            "publisher": {
              "@type": "Organization",
              "name": "ProPaint Quote",
              "url": "https://propaintquote.com"
            }
          })
        }}
      />
    </div>
  );
}