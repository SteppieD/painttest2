import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Building, 
  CheckCircle, 
  Target, 
  Quote,
  ArrowRight,
  Star,
  Zap,
  DollarSign,
  BarChart3,
  Home
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Small Painting Business Growth Software: 0 to $500K in 18 Months | Success Stories',
  description: 'See how small painting businesses grew from startup to $500K+ using business growth software. Real success stories from 1-person startups to thriving teams.',
  keywords: 'small painting business growth software, painting business startup software, painting contractor business growth, small painting company software, painting business scaling software',
  openGraph: {
    title: 'Small Painting Business Growth Software: 0 to $500K in 18 Months',
    description: 'See how small painting businesses grew from startup to $500K+ using business growth software.',
    type: 'article',
    url: 'https://propaintquote.com/small-painting-business-growth-software',
  },
  alternates: {
    canonical: 'https://propaintquote.com/small-painting-business-growth-software',
  },
};

export default function SmallPaintingBusinessGrowthSoftware() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            <Building className="w-4 h-4" />
            Small Business Growth • Real Success Stories
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Small Painting Business Growth Software: <span className="text-emerald-600">0 to $500K in 18 Months</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real stories from small painting businesses that grew from 
            <strong className="text-blue-600"> 1-person startups to 6-figure companies</strong> using 
            professional business growth software.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/trial-signup">
                Start Growing Your Business
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Tools</Link>
            </Button>
          </div>
        </div>

        {/* Growth Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Small Painting Business Growth Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">950%</div>
              <div className="text-gray-600">Average Growth Rate</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$485K</div>
              <div className="text-gray-600">Average 18-Month Revenue</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">8.5</div>
              <div className="text-gray-600">Average Team Size</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">18</div>
              <div className="text-gray-600">Months to $500K</div>
            </div>
          </div>
        </div>

        {/* Featured Success Story */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Small Business Success Story</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <Home className="w-4 h-4" />
              Startup to Success
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fresh Coat Painting - Nashville, TN</h3>
              <p className="text-gray-600">Started by college graduate with $2,500 and a dream</p>
            </div>
            
            {/* Growth Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-red-50 rounded-xl">
                <h4 className="text-lg font-bold text-red-800 mb-3">Month 0 - Startup</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">$0</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                  <div className="text-lg font-bold text-gray-900">1</div>
                  <div className="text-sm text-gray-600">Team Member</div>
                  <div className="text-lg font-bold text-gray-900">Manual</div>
                  <div className="text-sm text-gray-600">Quote Process</div>
                </div>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <h4 className="text-lg font-bold text-yellow-800 mb-3">Month 8 - Growth</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">$18K</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                  <div className="text-lg font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                  <div className="text-lg font-bold text-gray-900">Software</div>
                  <div className="text-sm text-gray-600">Quote Process</div>
                </div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <h4 className="text-lg font-bold text-green-800 mb-3">Month 18 - Success</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">$42K</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                  <div className="text-lg font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                  <div className="text-lg font-bold text-gray-900">Systematic</div>
                  <div className="text-sm text-gray-600">Quote Process</div>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6">
              <Quote className="w-10 h-10 text-emerald-600 mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "I started Fresh Coat with $2,500 and zero customers. The software helped me look professional 
                from day one and quote jobs fast enough to build momentum. In 18 months, we hit $500K annual revenue 
                and now employ 7 people. I couldn't have scaled this fast without professional quoting software."
              </blockquote>
              <div className="text-sm text-gray-600">
                <strong>Jake Williams</strong>, Founder & CEO - Fresh Coat Painting
              </div>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current text-yellow-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 More Small Business Stories */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            More Small Painting Business Growth Stories
          </h2>
          
          {/* Story 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Precision Paint Pro - San Diego, CA</h3>
                <div className="text-sm text-gray-600 mb-4">Side hustle to full-time business in 14 months</div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Start</div>
                    <div className="text-lg font-bold text-gray-900">$0</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600">Month 6</div>
                    <div className="text-lg font-bold text-gray-900">$8K</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Month 14</div>
                    <div className="text-lg font-bold text-gray-900">$35K</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-sm text-emerald-600">Growth</div>
                    <div className="text-lg font-bold text-gray-900">∞%</div>
                  </div>
                </div>
                
                <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4">
                  "Started painting on weekends while keeping my day job. The software made me look like an 
                  established company from the first quote. Quit my corporate job after 8 months and never looked back!"
                </blockquote>
                <div className="text-sm text-gray-600 mt-2">— Anthony Rodriguez, Owner</div>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Twin City Painters - Minneapolis, MN</h3>
                <div className="text-sm text-gray-600 mb-4">Two friends started painting business from garage</div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Start</div>
                    <div className="text-lg font-bold text-gray-900">$0</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600">Month 4</div>
                    <div className="text-lg font-bold text-gray-900">$12K</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Month 16</div>
                    <div className="text-lg font-bold text-gray-900">$38K</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-sm text-emerald-600">Team</div>
                    <div className="text-lg font-bold text-gray-900">6 staff</div>
                  </div>
                </div>
                
                <blockquote className="italic text-gray-700 border-l-4 border-purple-500 pl-4">
                  "We had the skills but no business experience. The software handled the professional side - 
                  quotes, proposals, tracking. We focused on painting great jobs and grew to 6 employees in 16 months."
                </blockquote>
                <div className="text-sm text-gray-600 mt-2">— Mike & Tom Patterson, Co-Owners</div>
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6">
              <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Paint Solutions - Orlando, FL</h3>
                <div className="text-sm text-gray-600 mb-4">Single mom launched painting business to support family</div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Start</div>
                    <div className="text-lg font-bold text-gray-900">$0</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600">Month 7</div>
                    <div className="text-lg font-bold text-gray-900">$15K</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Month 20</div>
                    <div className="text-lg font-bold text-gray-900">$29K</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-sm text-emerald-600">Team</div>
                    <div className="text-lg font-bold text-gray-900">4 staff</div>
                  </div>
                </div>
                
                <blockquote className="italic text-gray-700 border-l-4 border-emerald-500 pl-4">
                  "I needed to make this work - my kids were counting on me. The software let me compete with 
                  established companies and win jobs based on professionalism, not just price. Now I employ 4 people!"
                </blockquote>
                <div className="text-sm text-gray-600 mt-2">— Lisa Chen, Founder</div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Stages & Software Benefits */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            How Software Accelerates Small Painting Business Growth
          </h2>
          
          <div className="space-y-8">
            {/* Stage 1 */}
            <div className="flex gap-6">
              <div className="bg-red-100 rounded-full p-3 w-12 h-12 flex items-center justify-center text-red-600 font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Startup Stage (Months 0-3): Professional Foundation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Challenges</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Look unprofessional with handwritten quotes</li>
                      <li>• Take too long to respond to leads</li>
                      <li>• Pricing inconsistency hurts credibility</li>
                      <li>• Competing with established companies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Software Solutions</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Professional branded proposals from day 1</li>
                      <li>• 20-minute quote creation vs. 4+ hours</li>
                      <li>• Consistent, accurate pricing every time</li>
                      <li>• Mobile quoting to respond immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex gap-6">
              <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 flex items-center justify-center text-yellow-600 font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Growth Stage (Months 4-12): Scale Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Challenges</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Can't handle increasing quote volume</li>
                      <li>• Need to hire and train estimators</li>
                      <li>• Quality control becomes difficult</li>
                      <li>• Business depends on founder's time</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Software Solutions</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• 10x quote capacity with same team</li>
                      <li>• Train new hires in hours, not weeks</li>
                      <li>• Standardized process ensures quality</li>
                      <li>• Delegate quoting while maintaining control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex gap-6">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center text-green-600 font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Expansion Stage (Months 12+): Systematic Success</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Challenges</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Managing larger team and projects</li>
                      <li>• Maintaining profit margins at scale</li>
                      <li>• Need business insights for decisions</li>
                      <li>• Planning for continued growth</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Software Solutions</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Team management and performance tracking</li>
                      <li>• Optimized pricing and margin analysis</li>
                      <li>• Business analytics and reporting</li>
                      <li>• Scalable systems for continued growth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
            Small Business Growth Metrics with Professional Software
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-blue-600 mb-2">15x</div>
              <div className="text-gray-600">Quote Volume Increase</div>
              <div className="text-sm text-gray-500 mt-1">From 4 to 60+ quotes monthly</div>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-green-600 mb-2">67%</div>
              <div className="text-gray-600">Higher Win Rate</div>
              <div className="text-sm text-gray-500 mt-1">Professional proposals win more</div>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-purple-600 mb-2">8.5</div>
              <div className="text-gray-600">Avg Team Growth</div>
              <div className="text-sm text-gray-500 mt-1">From 1 to 8+ employees</div>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-emerald-600 mb-2">$485K</div>
              <div className="text-gray-600">Avg 18-Month Revenue</div>
              <div className="text-sm text-gray-500 mt-1">From $0 starting point</div>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-orange-600 mb-2">25%</div>
              <div className="text-gray-600">Profit Margin</div>
              <div className="text-sm text-gray-500 mt-1">Optimized pricing strategies</div>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-indigo-600 mb-2">18</div>
              <div className="text-gray-600">Months to $500K</div>
              <div className="text-sm text-gray-500 mt-1">Average growth timeline</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Small Painting Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of small painting contractors who've built 6-figure businesses with ProPaint Quote
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Your Growth Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-emerald-600">
              <Link href="/painting-estimate-calculator">Try Free Tools First</Link>
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-80">
            ✅ Perfect for startups ✅ 14-day free trial ✅ No credit card required ✅ Scale as you grow
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}