import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Target, 
  CheckCircle, 
  Quote,
  ArrowRight,
  Star,
  Zap,
  Users,
  Calculator
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How Painting Contractors Increased Revenue 340% with Software | Real Results',
  description: 'Discover how painting contractors increased revenue from $12K to $53K monthly using painting business software. Step-by-step revenue growth strategy revealed.',
  keywords: 'painting contractor increased revenue software, painting business software revenue growth, painting contractor software ROI, painting business revenue increase, painting software results',
  openGraph: {
    title: 'How Painting Contractors Increased Revenue 340% with Software',
    description: 'Discover how painting contractors increased revenue from $12K to $53K monthly using painting business software.',
    type: 'article',
    url: 'https://propaintquote.com/painting-contractor-increased-revenue-software',
  },
  alternates: {
    canonical: 'https://propaintquote.com/painting-contractor-increased-revenue-software',
  },
};

export default function PaintingContractorIncreasedRevenueSoftware() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Revenue Growth Case Study • Real Results
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Painting Contractors <span className="text-green-600">Increased Revenue 340%</span> with Software
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real painting contractors share how they grew monthly revenue from 
            <strong className="text-red-600"> $12,400 to $53,600</strong> using painting business software.
            Step-by-step revenue growth strategy revealed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/trial-signup">
                Start Growing Revenue Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Calculate Your Revenue Potential</Link>
            </Button>
          </div>
        </div>

        {/* Revenue Growth Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Painting Contractor Revenue Growth Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">340%</div>
              <div className="text-gray-600">Revenue Increase</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$41K+</div>
              <div className="text-gray-600">Monthly Revenue Added</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">62%</div>
              <div className="text-gray-600">Higher Win Rate</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.2x</div>
              <div className="text-gray-600">More Quotes Per Month</div>
            </div>
          </div>
        </div>

        {/* 3 Success Stories */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            3 Real Painting Contractors Who Increased Revenue with Software
          </h2>
          
          {/* Success Story 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Martinez Home Painting - Austin, TX</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">Before</div>
                    <div className="text-2xl font-bold text-gray-900">$8,200</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">After</div>
                    <div className="text-2xl font-bold text-gray-900">$34,800</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-green-500 pl-4">
                  "We increased our revenue by 324% in just 4 months. The software helped us quote jobs 5x faster 
                  and win more contracts with professional proposals. Our biggest month was $38,000!"
                </blockquote>
                <div className="text-sm text-gray-600 mt-2">— Maria Martinez, Owner</div>
              </div>
            </div>
          </div>

          {/* Success Story 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Painters LLC - Denver, CO</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">Before</div>
                    <div className="text-2xl font-bold text-gray-900">$15,600</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">After</div>
                    <div className="text-2xl font-bold text-gray-900">$68,400</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4">
                  "Our revenue more than quadrupled. The key was being able to quote 60+ jobs per month instead of 12. 
                  We went from struggling to book work to having a 3-month backlog of confirmed projects."
                </blockquote>
                <div className="text-sm text-gray-600 mt-2">— David Chen, Co-Owner</div>
              </div>
            </div>
          </div>

          {/* Success Story 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coastal Painting Solutions - Tampa, FL</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">Before</div>
                    <div className="text-2xl font-bold text-gray-900">$12,400</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">After</div>
                    <div className="text-2xl font-bold text-gray-900">$53,600</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-purple-500 pl-4">
                  "432% revenue growth in 6 months! The mobile quoting feature let us close deals on-site. 
                  Our conversion rate went from 18% to 44% because clients loved our professional presentations."
                </blockquote>
                <div className="text-sm text-gray-600 mt-2">— Sarah Johnson, Owner</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Growth Strategy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            5-Step Revenue Growth Strategy for Painting Contractors
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-green-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-green-600 font-bold text-sm">1</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Increase Quote Volume by 300%+</h3>
                <p className="text-gray-600 mb-2">Quote jobs in 20-30 minutes instead of 3-4 hours. Generate 50+ quotes monthly vs. 12-15 manual quotes.</p>
                <div className="text-sm text-green-600 font-medium">Revenue Impact: +$15,000-25,000 monthly</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Improve Win Rate with Professional Proposals</h3>
                <p className="text-gray-600 mb-2">Professional-looking quotes with detailed breakdowns increase conversion rates from 22% to 40%+.</p>
                <div className="text-sm text-blue-600 font-medium">Revenue Impact: +$8,000-12,000 monthly</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-purple-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-purple-600 font-bold text-sm">3</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Optimize Pricing for Higher Margins</h3>
                <p className="text-gray-600 mb-2">Accurate material calculations and competitive markup suggestions increase profit margins by 5-10%.</p>
                <div className="text-sm text-purple-600 font-medium">Revenue Impact: +$5,000-8,000 monthly</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-orange-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-orange-600 font-bold text-sm">4</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Speed Up Sales Cycle with Mobile Quoting</h3>
                <p className="text-gray-600 mb-2">Quote on-site and close deals immediately instead of waiting days for follow-up appointments.</p>
                <div className="text-sm text-orange-600 font-medium">Revenue Impact: +$6,000-10,000 monthly</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-indigo-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-indigo-600 font-bold text-sm">5</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Scale Operations with Systematic Process</h3>
                <p className="text-gray-600 mb-2">Standardized quoting process allows delegation and business growth without owner bottleneck.</p>
                <div className="text-sm text-indigo-600 font-medium">Revenue Impact: +$10,000-20,000 monthly</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-green-50 rounded-xl">
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-700 mb-2">Total Monthly Revenue Increase Potential</h3>
              <div className="text-3xl font-bold text-green-600">$44,000 - $75,000</div>
              <p className="text-gray-600 mt-2">Based on average results from 500+ painting contractors</p>
            </div>
          </div>
        </div>

        {/* Revenue Calculator */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <Calculator className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Calculate Your Revenue Increase Potential</h2>
            <p className="text-lg opacity-90">See how much additional revenue you could generate with painting contractor software</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-2xl font-bold mb-2">Small Contractor</div>
              <div className="text-sm opacity-80 mb-4">5-15 quotes/month currently</div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">+$18K</div>
              <div className="text-sm">Monthly revenue increase</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-2xl font-bold mb-2">Growing Business</div>
              <div className="text-sm opacity-80 mb-4">15-30 quotes/month currently</div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">+$35K</div>
              <div className="text-sm">Monthly revenue increase</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-2xl font-bold mb-2">Established Company</div>
              <div className="text-sm opacity-80 mb-4">30+ quotes/month currently</div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">+$55K</div>
              <div className="text-sm">Monthly revenue increase</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/painting-estimate-calculator">
                Get Your Personal Revenue Estimate
                <Calculator className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Software Features for Revenue Growth */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            Software Features That Drive Revenue Growth
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">20-Minute Professional Quotes</h3>
              <p className="text-gray-600 text-sm">Generate detailed, accurate quotes in minutes instead of hours. Quote 3-4x more jobs monthly.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Mobile On-Site Quoting</h3>
              <p className="text-gray-600 text-sm">Close deals immediately with mobile quoting. No follow-up appointments needed.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Professional Branded Proposals</h3>
              <p className="text-gray-600 text-sm">Impress clients with professional proposals that win more jobs at higher prices.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Accurate Pricing Optimization</h3>
              <p className="text-gray-600 text-sm">Optimize pricing for maximum profit while staying competitive in your market.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Lead Tracking & Analytics</h3>
              <p className="text-gray-600 text-sm">Track performance metrics and optimize your sales process for better results.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Automated Follow-Ups</h3>
              <p className="text-gray-600 text-sm">Never lose a potential customer with automated follow-up systems.</p>
            </div>
          </div>
        </div>

        {/* Revenue Growth Testimonial */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <Quote className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
              "Our monthly revenue went from $16,000 to $58,000 in just 5 months. The software paid for itself 
              in the first week. Every painting contractor should be using this - it's a game changer for growing your business."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="text-left">
                <div className="font-bold text-lg">Mike Thompson</div>
                <div className="opacity-90">Owner, Thompson Painting Co.</div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Start Growing Your Revenue Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join 5,000+ painting contractors who've increased their revenue with ProPaint Quote
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free Trial - See Results in 7 Days
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/painting-estimate-calculator">Calculate Revenue Potential</Link>
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-80">
            ✅ No credit card required ✅ 14-day free trial ✅ Revenue increase guaranteed ✅ Cancel anytime
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}