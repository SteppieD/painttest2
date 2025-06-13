import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Palette, 
  ArrowRight,
  Target,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About ProPaint Quote - Built by Painters, for Painters',
  description: 'Learn about ProPaint Quote\'s mission to help painting contractors create accurate quotes, win more jobs, and grow their businesses with professional software.',
  keywords: 'about painting software, painting contractor tools, quote software company, painting business growth',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About ProPaint Quote - Professional Painting Software',
    description: 'Built by painters, for painters. Learn how ProPaint Quote helps contractors create accurate quotes and grow their businesses.',
    url: '/about',
  },
};

export default function AboutPage() {
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
              <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="text-blue-600 font-medium">About</Link>
              <Button asChild>
                <Link href="/access-code">Start Free Trial</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built by <span className="text-blue-600">Painters</span>, for <span className="text-blue-600">Painters</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ProPaint Quote was created by painting contractors who understand the challenges of running a successful painting business. We built the software we wished we had when we were quoting jobs by hand.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe every painting contractor deserves access to professional tools that help them create accurate quotes, win more jobs, and build successful businesses.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Too many great painters lose jobs because their estimates take too long or aren't professional enough. We're changing that by making quote creation fast, accurate, and professional for every contractor.
              </p>
              <Button size="lg" asChild>
                <Link href="/access-code">
                  Join Thousands of Contractors
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">95%</h3>
                  <p className="text-gray-600">Quote Accuracy</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">5000+</h3>
                  <p className="text-gray-600">Contractors Trust Us</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">40%</h3>
                  <p className="text-gray-600">Higher Win Rates</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">3x</h3>
                  <p className="text-gray-600">Faster Estimates</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why We Started ProPaint Quote
            </h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-xl leading-relaxed mb-8">
              As professional painting contractors, we experienced firsthand the frustration of losing jobs because our estimates took too long to prepare or didn't look professional enough compared to larger competitors.
            </p>
            
            <p className="text-lg leading-relaxed mb-8">
              We spent countless hours calculating materials, figuring out labor costs, and trying to format professional-looking quotes. By the time we got back to potential customers, they had often already hired someone else who could respond faster.
            </p>
            
            <p className="text-lg leading-relaxed mb-8">
              That's when we decided to build the software we wished we had – something that could generate accurate, professional quotes in minutes, not hours. Something built specifically for painting contractors who understand the industry.
            </p>
            
            <p className="text-lg leading-relaxed">
              Today, ProPaint Quote helps thousands of contractors across the country win more jobs, increase their profit margins, and grow their businesses. We're proud to be part of the painting community and to help fellow contractors succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              Everything we do is guided by these core principles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Expertise</h3>
                <p className="text-gray-600">
                  We understand painting because we are painters. Every feature is designed with real contractor needs in mind.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Simplicity First</h3>
                <p className="text-gray-600">
                  Professional tools shouldn't be complicated. We focus on making powerful features simple and intuitive to use.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Success</h3>
                <p className="text-gray-600">
                  Your success is our success. We're committed to helping every contractor grow their business and increase profits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professional painters who trust ProPaint Quote to grow their businesses
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/access-code">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            Free 14-day trial • No credit card required • Cancel anytime
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
            <Link href="/about" className="hover:text-white">About</Link>
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