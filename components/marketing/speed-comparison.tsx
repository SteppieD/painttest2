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
    <div>
      <div`}>
        {step}
      </div>
      <div>
        <div>
          <h4>{title}</h4>
          <span`}>
            {time}
          </span>
        </div>
        <p>{description}</p>
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
    <section`}>
      <div>
        <div>
          <h2>
            The Speed Difference That Wins Jobs
          </h2>
          <p>
            While competitors spend hours creating quotes, you can deliver professional estimates and close deals on-site
          </p>
        </div>

        <div>
          {/* Manual Process */}
          <Card>
            <CardHeader>
              <CardTitle>
                <X />
                <span>Manual Process</span>
                <span>3-6 Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
              
              <div>
                <h5>Problems with Manual Process:</h5>
                <ul>
                  <li>• Customer loses interest during delay</li>
                  <li>• Competitors deliver quotes faster</li>
                  <li>• Time lost = money lost on other jobs</li>
                  <li>• Inconsistent quote formatting</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* App Process */}
          <Card>
            <CardHeader>
              <CardTitle>
                <CheckCircle />
                <span>With Our App</span>
                <span>6 Minutes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
              
              <div>
                <h5>Benefits of App Process:</h5>
                <ul>
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
        <div>
          <div>
            <div>
              <Clock />
              <div>4.5 Hours</div>
              <p>Saved per quote</p>
              <p>Worth $225 at $50/hour</p>
            </div>
            
            <div>
              <DollarSign />
              <div>40-60%</div>
              <p>Higher win rates</p>
              <p>From professional presentation</p>
            </div>
            
            <div>
              <Smartphone />
              <div>Same Day</div>
              <p>Quote delivery</p>
              <p>While competitors take days</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <h3>
            Ready to Quote at Light Speed?
          </h3>
          <p>
            Join thousands of contractors who've made the switch to instant professional quoting
          </p>
          <Button size="lg" asChild>
            <Link href="/trial-signup">
              Start Free Trial - 10 Quotes Free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}