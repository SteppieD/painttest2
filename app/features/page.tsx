import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Zap, Calculator, Smartphone, FileText, TrendingUp, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Zap,
    name: "AI-Powered Quote Generation",
    description: "Create professional quotes in seconds with our advanced AI that understands your project details and calculates accurate estimates.",
    benefits: [
      "30-second quote generation",
      "99% accuracy rate", 
      "Natural language processing",
      "Industry-standard calculations"
    ]
  },
  {
    icon: Calculator,
    name: "Advanced Calculators",
    description: "Multiple specialized calculators for different project types, from simple rooms to complex commercial jobs.",
    benefits: [
      "Interior & exterior calculators",
      "Commercial project support",
      "Material cost optimization",
      "Labor cost estimation"
    ]
  },
  {
    icon: Smartphone,
    name: "Mobile-First Design",
    description: "Quote on-site with your phone or tablet. Works perfectly offline and syncs when you're back online.",
    benefits: [
      "Offline functionality",
      "Touch-optimized interface",
      "Auto-sync capabilities",
      "Works on any device"
    ]
  },
  {
    icon: FileText,
    name: "Professional Templates",
    description: "Beautiful, customizable quote templates that make you look like a million-dollar company.",
    benefits: [
      "20+ professional templates",
      "Custom branding options",
      "Digital signatures",
      "PDF generation"
    ]
  },
  {
    icon: TrendingUp,
    name: "Business Analytics",
    description: "Track your win rates, revenue, and performance with detailed analytics and insights.",
    benefits: [
      "Win rate tracking",
      "Revenue analytics",
      "Performance insights",
      "Profit optimization"
    ]
  },
  {
    icon: Users,
    name: "Customer Portal",
    description: "Let customers view, approve, and pay for quotes online with a beautiful customer portal.",
    benefits: [
      "Online quote approval",
      "Digital payments",
      "Project updates",
      "Communication tools"
    ]
  }
]

export default function FeaturesPage() {
  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="font-display text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                Everything You Need to Win More Jobs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From instant quotes to customer management, we've built every tool painting contractors need to dominate their market.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Watch how easy it is to create a professional quote that wins jobs
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="ml-4 font-medium">Paint Quote Pro - Demo</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Demo Coming Soon</h3>
                    <p className="text-gray-600 mb-6">
                      Experience our AI-powered quote generation in a full interactive demo
                    </p>
                    <Button asChild variant="kofi">
                      <Link href="/get-quote">Try It Now - Free</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Contractors Choose Us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of painting contractors who've transformed their businesses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">47%</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Higher Win Rate</div>
                <div className="text-gray-600">Professional quotes impress customers and win more jobs</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Time Saved</div>
                <div className="text-gray-600">What used to take hours now takes seconds</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">$8,400</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Monthly Revenue Increase</div>
                <div className="text-gray-600">Average increase from faster, more professional quoting</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Join 5,247+ contractors who are winning more jobs with professional quotes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg font-semibold h-14 px-10 bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/trial-signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg font-semibold h-14 px-10 bg-transparent text-white border-2 border-white/50 hover:bg-white hover:text-gray-900">
                <Link href="/get-quote">Try Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}