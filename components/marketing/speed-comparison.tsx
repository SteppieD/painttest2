'use client'

import { Clock, CheckCircle, X, Smartphone, FileText, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProcessStepProps {
  step: number
  title: string
  time: string
  description: string
  isManual?: boolean
}

function ProcessStep({ step, title, time, description, isManual = false }: ProcessStepProps) {
  return (
    <div className="flex items-start space-x-4 mb-6">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
        isManual ? 'bg-red-500' : 'bg-green-500'
      }`}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <span className={`text-sm px-2 py-1 rounded ${
            isManual ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {time}
          </span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface SpeedComparisonProps {
  className?: string
}

export function SpeedComparison({ className }: SpeedComparisonProps) {
  const manualProcess = [
    {
      step: 1,
      title: "Site Visit & Measurements",
      time: "1-2 hours",
      description: "Drive to location, measure rooms, assess prep work, take notes on paper or phone"
    },
    {
      step: 2,
      title: "Return to Office",
      time: "30 mins",
      description: "Travel time back to office, potentially losing momentum with the customer"
    },
    {
      step: 3,
      title: "Calculate Pricing",
      time: "1-2 hours", 
      description: "Look up material costs, calculate labor, apply markup, double-check math"
    },
    {
      step: 4,
      title: "Create Quote Document",
      time: "1-2 hours",
      description: "Format estimate, add company branding, create professional presentation"
    },
    {
      step: 5,
      title: "Send & Follow Up",
      time: "30+ mins",
      description: "Email quote, wait for response, multiple follow-up calls over days/weeks"
    }
  ]

  const appProcess = [
    {
      step: 1,
      title: "Measure & Input On-Site",
      time: "2 mins",
      description: "Use mobile app to input measurements directly while at customer location"
    },
    {
      step: 2,
      title: "Select Materials & Options",
      time: "2 mins",
      description: "Choose from pre-loaded paint products and service options with real-time pricing"
    },
    {
      step: 3,
      title: "Generate Professional Quote",
      time: "1 min",
      description: "App automatically calculates pricing and generates branded, professional quote"
    },
    {
      step: 4,
      title: "Present & Close",
      time: "1 min",
      description: "Show quote on tablet/phone, collect digital signature and deposit on the spot"
    }
  ]

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Speed Difference That Wins Jobs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While competitors spend hours creating quotes, you can deliver professional estimates and close deals on-site
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Manual Process */}
          <Card className="border-2 border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <X className="w-6 h-6" />
                <span>Manual Process</span>
                <span className="ml-auto text-2xl font-bold">3-6 Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {manualProcess.map((step, index) => (
                <ProcessStep
                  key={index}
                  step={step.step}
                  title={step.title}
                  time={step.time}
                  description={step.description}
                  isManual={true}
                />
              ))}
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-2">Problems with Manual Process:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Customer loses interest during delay</li>
                  <li>• Competitors deliver quotes faster</li>
                  <li>• Time lost = money lost on other jobs</li>
                  <li>• Inconsistent quote formatting</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* App Process */}
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-6 h-6" />
                <span>With Our App</span>
                <span className="ml-auto text-2xl font-bold">6 Minutes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {appProcess.map((step, index) => (
                <ProcessStep
                  key={index}
                  step={step.step}
                  title={step.title}
                  time={step.time}
                  description={step.description}
                  isManual={false}
                />
              ))}
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Benefits of App Process:</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Close deals while excitement is high</li>
                  <li>• Beat all competitors on speed</li>
                  <li>• Professional presentation builds trust</li>
                  <li>• Collect deposits immediately</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">4.5 Hours</div>
              <p className="text-blue-100">Saved per quote</p>
              <p className="text-sm text-blue-200 mt-1">Worth $225 at $50/hour</p>
            </div>
            
            <div>
              <DollarSign className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">40-60%</div>
              <p className="text-blue-100">Higher win rates</p>
              <p className="text-sm text-blue-200 mt-1">From professional presentation</p>
            </div>
            
            <div>
              <Smartphone className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">Same Day</div>
              <p className="text-blue-100">Quote delivery</p>
              <p className="text-sm text-blue-200 mt-1">While competitors take days</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Quote at Light Speed?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of contractors who've made the switch to instant professional quoting
          </p>
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/trial-signup">
              Start Free Trial - 10 Quotes Free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}