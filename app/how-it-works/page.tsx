import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, FileText, Send, TrendingUp, Zap, Play, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="font-display text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                3 Simple Steps to Winning More Jobs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how painting contractors create professional quotes in 30 seconds 
                and close deals on the spot while competitors are still driving back to the office.
              </p>
            </div>

            {/* Video Demo */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" variant="secondary" className="gap-3">
                    <Play className="w-6 h-6" />
                    Watch 2-Minute Demo
                  </Button>
                </div>
                {/* Placeholder for video */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
              </div>
              <p className="text-center mt-4 text-gray-600">
                No signup required • See real contractor workflow • Actual time savings
              </p>
            </div>
          </div>
        </section>

        {/* 3-Step Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="order-2 md:order-1">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="font-mono text-sm text-gray-600 mb-2">Customer: Johnson Residence</p>
                      <p className="font-mono text-sm text-gray-600 mb-2">Project: Interior - 3 bedrooms, living room</p>
                      <p className="font-mono text-sm text-gray-600">Square feet: 1,850</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Quote
                    </Button>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">1</span>
                    </div>
                    <h2 className="text-3xl font-bold">Enter Project Details</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Input basic information while you're still at the customer's house. 
                    Room dimensions, surfaces to paint, and paint preferences. Our AI handles all calculations.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Works on any device - phone, tablet, laptop</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Smart suggestions based on your past quotes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">No math required - automatic calculations</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">2</span>
                    </div>
                    <h2 className="text-3xl font-bold">Review & Customize</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Your professional quote is generated instantly. Review the breakdown, 
                    adjust pricing if needed, and add your personal touch. Everything is calculated accurately.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Your logo and branding automatically applied</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Detailed cost breakdown builds trust</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Professional PDF that looks expensive</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Johnson Residence Quote</h3>
                      <span className="text-green-600 font-semibold">$4,850</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor (28 hrs)</span>
                        <span>$2,240</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paint & Materials</span>
                        <span>$1,850</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prep & Protection</span>
                        <span>$760</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-green-600">$4,850</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Delivery Options</h3>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Send className="w-4 h-4" />
                        Email to customer
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <FileText className="w-4 h-4" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Send className="w-4 h-4 rotate-45" />
                        Text quote link
                      </Button>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Pro tip:</strong> 73% of customers accept quotes delivered within 1 hour
                      </p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">3</span>
                    </div>
                    <h2 className="text-3xl font-bold">Send & Close the Deal</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Deliver your quote instantly - before you even leave their driveway. 
                    Email, text, or show them on your device. Close deals on the spot while competitors are still calculating.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Customer gets quote while excitement is high</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Track when they view and accept quotes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Follow-up reminders boost close rates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Real Results from Real Contractors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it. See what painting contractors achieve with ProPaint Quote.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="text-center p-6">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">47%</div>
                <p className="text-gray-600">More jobs won</p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">3 hrs</div>
                <p className="text-gray-600">Saved per quote</p>
              </Card>
              <Card className="text-center p-6">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">218</div>
                <p className="text-gray-600">Quotes per month</p>
              </Card>
              <Card className="text-center p-6">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">$47k</div>
                <p className="text-gray-600">Extra revenue/mo</p>
              </Card>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto">
              <blockquote className="text-xl text-gray-700 mb-6">
                "I was skeptical at first, but ProPaint Quote literally changed my business. 
                I'm winning jobs I would have lost before because I can quote on the spot. 
                Last month I closed <strong>$73,000 in new business</strong> - my best month ever."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  MR
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mike Rodriguez</p>
                  <p className="text-gray-600">Rodriguez Painting LLC • Dallas, TX</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 5,000+ painting contractors who are winning more jobs, 
              saving time, and growing their business with ProPaint Quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" asChild className="text-lg h-14 px-8">
                <Link href="/trial-signup">
                  Start Free 14-Day Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8 bg-transparent text-white border-white hover:bg-white/10">
                <Link href="/demo">
                  Try Live Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm opacity-80">
              No credit card required • Setup in 2 minutes • Cancel anytime
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}