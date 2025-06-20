import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Clock, 
  Zap, 
  CheckCircle, 
  Users, 
  Target, 
  Quote,
  ArrowRight,
  Star,
  TrendingUp,
  BarChart3,
  Timer,
  Award
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Painting Estimate Software Success Story: From 4 Hours to 18 Minutes | Real Results',
  description: 'See how painting contractors save 85% time with estimate software. Real success stories from contractors who cut quote time from hours to minutes.',
  keywords: 'painting estimate software success story, painting estimating software results, painting quote software time savings, painting contractor efficiency software, painting estimate software testimonials',
  openGraph: {
    title: 'Painting Estimate Software Success Story: From 4 Hours to 18 Minutes',
    description: 'See how painting contractors save 85% time with estimate software. Real success stories and time-saving results.',
    type: 'article',
    url: 'https://propaintquote.com/painting-estimate-software-success-story',
  },
  alternates: {
    canonical: 'https://propaintquote.com/painting-estimate-software-success-story',
  },
};

export default function PaintingEstimateSoftwareSuccessStory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Time Savings Success Story • Real Results
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Painting Estimate Software Success Story: <span className="text-purple-600">From 4 Hours to 18 Minutes</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real painting contractors share how estimate software transformed their businesses, 
            <strong className="text-purple-600"> saving 85% of quote time</strong> and allowing them to quote 
            <strong className="text-green-600"> 10x more jobs monthly</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/trial-signup">
                Start Saving Time Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Estimate Tool</Link>
            </Button>
          </div>
        </div>

        {/* Time Savings Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Painting Estimate Software Time Savings Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Time Savings</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Timer className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">18min</div>
              <div className="text-gray-600">Average Quote Time</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,200%</div>
              <div className="text-gray-600">Productivity Increase</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Main Success Story */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Success Story</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              Customer Spotlight
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Elite Painting Solutions - Phoenix, AZ</h3>
              <p className="text-gray-600">Family-owned painting business serving Phoenix since 2018</p>
            </div>
            
            {/* Before/After Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">Before Estimate Software</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Quote Creation Time</span>
                    <span className="font-bold text-red-600">3.5-4.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Quotes Per Week</span>
                    <span className="font-bold text-red-600">4-6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Accuracy Issues</span>
                    <span className="font-bold text-red-600">25% rework</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Client Response</span>
                    <span className="font-bold text-red-600">48-72 hours</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">After ProPaint Quote</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Quote Creation Time</span>
                    <span className="font-bold text-green-600">15-25 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Quotes Per Week</span>
                    <span className="font-bold text-green-600">35-45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Accuracy Issues</span>
                    <span className="font-bold text-green-600">2% rework</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Client Response</span>
                    <span className="font-bold text-green-600">Same day</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <Quote className="w-10 h-10 text-blue-600 mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "The time savings are incredible. What used to take me an entire afternoon now takes 18 minutes. 
                I can quote jobs on-site and give customers immediate responses. We've grown from 4 quotes per week 
                to 40+ quotes per week, and our win rate increased from 28% to 52%. It's completely transformed our business."
              </blockquote>
              <div className="text-sm text-gray-600">
                <strong>Robert Martinez</strong>, Owner - Elite Painting Solutions
              </div>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current text-yellow-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Time Comparison Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
            Estimate Creation Time: Manual vs Software
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Manual Estimate Process</span>
                <span className="text-red-600 font-bold">4.2 hours average</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4">
                <div className="bg-red-500 h-4 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">Site visit → Manual calculations → Pricing research → Proposal creation → Follow-up</div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">ProPaint Quote Software</span>
                <span className="text-green-600 font-bold">18 minutes average</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{width: '7%'}}></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">Measurements → One-click paint selection → Instant calculations → Professional proposal → Send immediately</div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-800 rounded-full">
              <Zap className="w-5 h-5" />
              <span className="font-bold">93% Time Reduction</span>
            </div>
          </div>
        </div>

        {/* More Success Stories */}
        <div className="space-y-6 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            More Painting Estimate Software Success Stories
          </h2>
          
          {/* Success Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Story 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Perfect Paint Co.</h3>
                  <p className="text-sm text-gray-600">Seattle, WA</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Before</div>
                  <div className="text-lg font-bold text-gray-900">3.8 hrs</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">After</div>
                  <div className="text-lg font-bold text-gray-900">22 min</div>
                </div>
              </div>
              
              <blockquote className="text-sm italic text-gray-700 border-l-4 border-blue-500 pl-3">
                "We increased our quote capacity by 900%. Now we can respond to leads the same day instead of next week."
              </blockquote>
              <div className="text-xs text-gray-600 mt-2">— Jennifer Liu, Owner</div>
            </div>
            
            {/* Story 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Precision Painters</h3>
                  <p className="text-sm text-gray-600">Charlotte, NC</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Before</div>
                  <div className="text-lg font-bold text-gray-900">5.2 hrs</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">After</div>
                  <div className="text-lg font-bold text-gray-900">16 min</div>
                </div>
              </div>
              
              <blockquote className="text-sm italic text-gray-700 border-l-4 border-green-500 pl-3">
                "The mobile quoting feature is a game-changer. We close 60% of deals on-site now vs. 15% before."
              </blockquote>
              <div className="text-xs text-gray-600 mt-2">— Marcus Johnson, Co-Owner</div>
            </div>
            
            {/* Story 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-full p-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Artisan Painting</h3>
                  <p className="text-sm text-gray-600">Miami, FL</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Before</div>
                  <div className="text-lg font-bold text-gray-900">4.5 hrs</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">After</div>
                  <div className="text-lg font-bold text-gray-900">19 min</div>
                </div>
              </div>
              
              <blockquote className="text-sm italic text-gray-700 border-l-4 border-purple-500 pl-3">
                "Accuracy improved dramatically. No more embarrassing pricing errors or forgotten materials in quotes."
              </blockquote>
              <div className="text-xs text-gray-600 mt-2">— Sofia Rodriguez, Estimator</div>
            </div>
            
            {/* Story 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 rounded-full p-2">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Fast Track Painting</h3>
                  <p className="text-sm text-gray-600">Portland, OR</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Before</div>
                  <div className="text-lg font-bold text-gray-900">6.1 hrs</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">After</div>
                  <div className="text-lg font-bold text-gray-900">14 min</div>
                </div>
              </div>
              
              <blockquote className="text-sm italic text-gray-700 border-l-4 border-orange-500 pl-3">
                "From 8 quotes per month to 75 quotes per month. Our business doubled in size within 6 months."
              </blockquote>
              <div className="text-xs text-gray-600 mt-2">— Alex Kim, Owner</div>
            </div>
          </div>
        </div>

        {/* ROI of Time Savings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
            The ROI of Time Savings with Painting Estimate Software
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Time Saved</h3>
              <div className="text-2xl font-bold text-blue-600 mb-2">3.5 hours</div>
              <p className="text-gray-600 text-sm">Per quote vs. manual process</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Extra Quotes</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">8-12x</div>
              <p className="text-gray-600 text-sm">More quotes possible monthly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Value Created</h3>
              <div className="text-2xl font-bold text-purple-600 mb-2">$2,800+</div>
              <p className="text-gray-600 text-sm">Monthly value of time saved</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-green-50 rounded-xl text-center">
            <h3 className="text-lg font-bold text-green-700 mb-2">Software pays for itself in 2.1 days</h3>
            <p className="text-gray-600">Based on average contractor hourly rate of $85 and time savings achieved</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Start Saving Time with Your Estimates Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of painting contractors who've transformed their quoting process
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free Trial - Create First Quote in 5 Minutes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link href="/painting-estimate-calculator">Try Free Estimate Tool</Link>
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-80">
            ✅ No credit card required ✅ 18-minute average quote time ✅ Professional proposals ✅ Mobile ready
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}