import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            {/* Success Message */}
            <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              Payment Successful!
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Welcome to ProPaint Solutions! Your subscription has been activated and you now have access to unlimited AI-powered quotes.
            </p>
            
            {/* What's Next Card */}
            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Access Your Dashboard</h3>
                    <p className="text-gray-600">Start creating professional quotes immediately with our AI assistant.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Create Your First Quote</h3>
                    <p className="text-gray-600">Use our AI chat to describe a project and get an instant professional quote.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Manage Your Billing</h3>
                    <p className="text-gray-600">You can update payment methods or cancel anytime from your account settings.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg font-semibold h-14 px-10" variant="kofi">
                <Link href="/get-quote">
                  Start Creating Quotes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="text-lg font-semibold h-14 px-10">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
            
            {/* Support */}
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
              <p className="text-gray-600 mb-4">
                Our team is here to help you get the most out of your new subscription.
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}