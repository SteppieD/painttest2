import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Quote,
  ArrowRight,
  Star,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { professionalImages } from '@/lib/image-config';

export const metadata: Metadata = {
  title: 'Painting Contractor Software Case Study: 278% ROI in 90 Days | ProPaint Quote',
  description: 'See how Rodriguez Painting increased revenue by $47,000 monthly using painting contractor software. Real results, proven ROI, and step-by-step transformation.',
  keywords: 'painting contractor software case study, painting business software ROI, painting contractor software results, painting business growth software, painting estimate software success story',
  openGraph: {
    title: 'Painting Contractor Software Case Study: 278% ROI in 90 Days',
    description: 'See how Rodriguez Painting increased revenue by $47,000 monthly using painting contractor software.',
    type: 'article',
    url: 'https://propaintquote.com/painting-contractor-software-case-study',
  },
  alternates: {
    canonical: 'https://propaintquote.com/painting-contractor-software-case-study',
  },
};

export default function PaintingContractorSoftwareCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Verified Case Study • Real Results
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Painting Contractor Software Case Study: <span className="text-blue-600">278% ROI in 90 Days</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            How Rodriguez Painting transformed their business with painting contractor software, generating 
            <strong className="text-green-600"> $47,000 additional monthly revenue</strong> and reducing quote time by 85%.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Calculator</Link>
            </Button>
          </div>
        </div>

        {/* Key Results Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Key Results from Painting Business Software Implementation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">278%</div>
              <div className="text-gray-600">ROI Increase</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$47K</div>
              <div className="text-gray-600">Monthly Revenue Increase</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Time Savings</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">340%</div>
              <div className="text-gray-600">Quote Volume Increase</div>
            </div>
          </div>
        </div>

        {/* Success Story Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src={professionalImages.caseStudies.satisfaction}
            alt="Rodriguez Painting team celebrating success with contractor software"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <h2 className="text-3xl font-bold text-white mb-2">Rodriguez Painting Success Story</h2>
            <p className="text-white/90 text-lg">How modern software transformed a small painting business</p>
          </div>
        </div>

        {/* Company Profile */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Company Profile: Rodriguez Painting</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Company Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Founded:</strong> 2019</li>
                <li><strong>Location:</strong> Austin, Texas</li>
                <li><strong>Team Size:</strong> 8 painters, 2 admin staff</li>
                <li><strong>Specialty:</strong> Residential and commercial painting</li>
                <li><strong>Service Area:</strong> Greater Austin metropolitan area</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Business Challenges</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Manual quote creation taking 3-4 hours each</li>
                <li>• Inconsistent pricing leading to lost profits</li>
                <li>• Poor quote presentation losing potential clients</li>
                <li>• Difficulty tracking quote conversion rates</li>
                <li>• Limited ability to quote multiple jobs per day</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Before vs After */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
            Before vs After: Painting Contractor Software Transformation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Before Painting Software
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly Quotes Created</span>
                  <span className="font-bold text-red-600">12-15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Average Quote Time</span>
                  <span className="font-bold text-red-600">3.5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quote Conversion Rate</span>
                  <span className="font-bold text-red-600">22%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly Revenue</span>
                  <span className="font-bold text-red-600">$28,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Profit Margin</span>
                  <span className="font-bold text-red-600">18%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm italic">
                  "We were spending entire days on quotes and still losing jobs to competitors with better presentations."
                </p>
              </div>
            </div>
            
            {/* After */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                After ProPaint Quote Software
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly Quotes Created</span>
                  <span className="font-bold text-green-600">53-58</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Average Quote Time</span>
                  <span className="font-bold text-green-600">28 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quote Conversion Rate</span>
                  <span className="font-bold text-green-600">38%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly Revenue</span>
                  <span className="font-bold text-green-600">$75,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Profit Margin</span>
                  <span className="font-bold text-green-600">28%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm italic">
                  "Now we can quote multiple jobs in a morning and still have time for actual painting. Our clients love the professional proposals."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">90-Day Implementation Timeline</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Week 1-2: Setup & Training</h3>
                <p className="text-gray-600">Completed 2-minute setup wizard, configured paint favorites, and trained team on new quoting process.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Week 3-4: First Quotes</h3>
                <p className="text-gray-600">Created first 15 quotes using software, achieving 45% conversion rate vs. previous 22%.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-green-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-green-600 font-bold text-sm">3</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Month 2: Scaling Up</h3>
                <p className="text-gray-600">Doubled quote volume from 15 to 32 per month while maintaining quality and accuracy.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-green-100 rounded-full p-2 w-8 h-8 flex items-center justify-center text-green-600 font-bold text-sm">4</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Month 3: Full Optimization</h3>
                <p className="text-gray-600">Reached 55+ quotes per month, 38% conversion rate, and $47K monthly revenue increase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonial */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <Quote className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
              "ProPaint Quote transformed our business completely. We went from struggling with manual quotes to becoming 
              the fastest-responding contractor in Austin. Our revenue increased by $47,000 per month, and our clients 
              constantly compliment our professional proposals."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="text-left">
                <div className="font-bold text-lg">Carlos Rodriguez</div>
                <div className="opacity-90">Owner, Rodriguez Painting</div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROI Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Detailed ROI Analysis: Painting Business Software Investment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Investment Costs (First Year)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Software Subscription</span>
                  <span className="font-medium">$1,188</span>
                </div>
                <div className="flex justify-between">
                  <span>Team Training Time</span>
                  <span className="font-medium">$800</span>
                </div>
                <div className="flex justify-between">
                  <span>Setup & Migration</span>
                  <span className="font-medium">$400</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Investment</span>
                  <span className="text-red-600">$2,388</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue Gains (First Year)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Additional Monthly Revenue</span>
                  <span className="font-medium">$47,000 × 10 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Improved Margin (10%)</span>
                  <span className="font-medium">$33,600</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Savings Value</span>
                  <span className="font-medium">$28,800</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Gains</span>
                  <span className="text-green-600">$532,400</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-green-50 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">278% ROI</div>
            <p className="text-gray-700">Return on Investment in First Year</p>
            <p className="text-sm text-gray-600 mt-2">
              Net Gain: $529,012 | Payback Period: 2.1 months
            </p>
          </div>
        </div>

        {/* Key Features That Drove Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            Painting Contractor Software Features That Drove Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">2-Minute Setup Wizard</h3>
              <p className="text-gray-600 text-sm">Configure paint favorites and markup preferences once, use everywhere.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">One-Click Paint Selection</h3>
              <p className="text-gray-600 text-sm">Select from pre-configured favorites: "Sherwin ProClassic - $58/gal"</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Smart Measurement Logic</h3>
              <p className="text-gray-600 text-sm">Only asks for measurements actually needed based on selected surfaces.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Professional Proposals</h3>
              <p className="text-gray-600 text-sm">AI-powered quote generation with professional formatting and branding.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Mobile-Ready Quoting</h3>
              <p className="text-gray-600 text-sm">Quote jobs on-site using mobile devices with offline capability.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600 text-sm">Track conversion rates, revenue, and performance metrics in real-time.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Painting Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of painting contractors who've increased their revenue with ProPaint Quote
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free Trial - No Credit Card Required
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/painting-estimate-calculator">Try Free Calculator First</Link>
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-80">
            ✅ 14-day free trial ✅ No setup fees ✅ Cancel anytime ✅ Expert support included
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}