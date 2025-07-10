'use client'

import React, { useState } from 'react'
import { Check, X, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'

interface Feature {
  name: string
  description?: string
  category: string
}

interface CompetitorData {
  name: string
  features: {
    [key: string]: boolean | string
  }
  pricing: string
  highlight?: boolean
}

const features: Feature[] = [
  // Core Features
  { name: 'AI-Powered Quote Generation', category: 'Core Features', description: 'Natural language AI that understands painting projects' },
  { name: '30-Second Express Quotes', category: 'Core Features', description: 'Create quotes in 30 seconds with templates' },
  { name: 'Professional PDF Quotes', category: 'Core Features', description: 'Branded, customizable quote documents' },
  { name: 'Digital Quote Acceptance', category: 'Core Features', description: 'Customers can accept quotes online' },
  { name: 'Multi-Surface Calculations', category: 'Core Features', description: 'Handles walls, ceilings, trim, cabinets, etc.' },
  
  // Calculation Features
  { name: 'Interior Painting Calculator', category: 'Calculators' },
  { name: 'Exterior Painting Calculator', category: 'Calculators' },
  { name: 'Commercial Calculator', category: 'Calculators' },
  { name: 'Cabinet Painting Calculator', category: 'Calculators' },
  { name: 'Real-Time Price Updates', category: 'Calculators' },
  
  // Business Management
  { name: 'Customer Management', category: 'Business Tools' },
  { name: 'Quote History & Analytics', category: 'Business Tools' },
  { name: 'Revenue Tracking', category: 'Business Tools' },
  { name: 'Team Collaboration', category: 'Business Tools' },
  { name: 'Admin Portal', category: 'Business Tools' },
  
  // Integration & Mobile
  { name: 'Mobile Responsive', category: 'Platform' },
  { name: 'Native Mobile Apps', category: 'Platform' },
  { name: 'QuickBooks Integration', category: 'Platform' },
  { name: 'API Access', category: 'Platform' },
  { name: 'White Label Option', category: 'Platform' },
  
  // Support & Training
  { name: '24/7 Support', category: 'Support' },
  { name: 'Video Training Library', category: 'Support' },
  { name: 'Onboarding Assistance', category: 'Support' },
  { name: 'Free Updates', category: 'Support' },
  { name: 'Money-Back Guarantee', category: 'Support' }
]

const competitors: CompetitorData[] = [
  {
    name: 'ProPaint Quote',
    highlight: true,
    pricing: '$79-149/mo',
    features: {
      'AI-Powered Quote Generation': true,
      '30-Second Express Quotes': true,
      'Professional PDF Quotes': true,
      'Digital Quote Acceptance': true,
      'Multi-Surface Calculations': true,
      'Interior Painting Calculator': true,
      'Exterior Painting Calculator': true,
      'Commercial Calculator': true,
      'Cabinet Painting Calculator': true,
      'Real-Time Price Updates': true,
      'Customer Management': true,
      'Quote History & Analytics': true,
      'Revenue Tracking': true,
      'Team Collaboration': 'Coming Soon',
      'Admin Portal': true,
      'Mobile Responsive': true,
      'Native Mobile Apps': 'Coming Soon',
      'QuickBooks Integration': 'Coming Soon',
      'API Access': true,
      'White Label Option': 'Enterprise',
      '24/7 Support': 'Email & Chat',
      'Video Training Library': true,
      'Onboarding Assistance': true,
      'Free Updates': true,
      'Money-Back Guarantee': '14-day'
    }
  },
  {
    name: 'PaintScout Pro',
    pricing: '$99-299/mo',
    features: {
      'AI-Powered Quote Generation': false,
      '30-Second Express Quotes': false,
      'Professional PDF Quotes': true,
      'Digital Quote Acceptance': true,
      'Multi-Surface Calculations': true,
      'Interior Painting Calculator': true,
      'Exterior Painting Calculator': true,
      'Commercial Calculator': false,
      'Cabinet Painting Calculator': false,
      'Real-Time Price Updates': false,
      'Customer Management': true,
      'Quote History & Analytics': true,
      'Revenue Tracking': true,
      'Team Collaboration': true,
      'Admin Portal': true,
      'Mobile Responsive': true,
      'Native Mobile Apps': true,
      'QuickBooks Integration': true,
      'API Access': false,
      'White Label Option': false,
      '24/7 Support': 'Phone',
      'Video Training Library': false,
      'Onboarding Assistance': '1 hour',
      'Free Updates': true,
      'Money-Back Guarantee': false
    }
  },
  {
    name: 'Estimate Rocket',
    pricing: '$39-129/mo',
    features: {
      'AI-Powered Quote Generation': false,
      '30-Second Express Quotes': false,
      'Professional PDF Quotes': true,
      'Digital Quote Acceptance': false,
      'Multi-Surface Calculations': 'Basic',
      'Interior Painting Calculator': true,
      'Exterior Painting Calculator': true,
      'Commercial Calculator': false,
      'Cabinet Painting Calculator': false,
      'Real-Time Price Updates': false,
      'Customer Management': true,
      'Quote History & Analytics': 'Basic',
      'Revenue Tracking': false,
      'Team Collaboration': false,
      'Admin Portal': false,
      'Mobile Responsive': true,
      'Native Mobile Apps': false,
      'QuickBooks Integration': true,
      'API Access': false,
      'White Label Option': false,
      '24/7 Support': false,
      'Video Training Library': false,
      'Onboarding Assistance': false,
      'Free Updates': true,
      'Money-Back Guarantee': '30-day'
    }
  },
  {
    name: 'JobNimbus',
    pricing: '$25-85/user/mo',
    features: {
      'AI-Powered Quote Generation': false,
      '30-Second Express Quotes': false,
      'Professional PDF Quotes': true,
      'Digital Quote Acceptance': true,
      'Multi-Surface Calculations': false,
      'Interior Painting Calculator': false,
      'Exterior Painting Calculator': false,
      'Commercial Calculator': false,
      'Cabinet Painting Calculator': false,
      'Real-Time Price Updates': false,
      'Customer Management': true,
      'Quote History & Analytics': true,
      'Revenue Tracking': true,
      'Team Collaboration': true,
      'Admin Portal': true,
      'Mobile Responsive': true,
      'Native Mobile Apps': true,
      'QuickBooks Integration': true,
      'API Access': true,
      'White Label Option': false,
      '24/7 Support': 'Business hours',
      'Video Training Library': true,
      'Onboarding Assistance': true,
      'Free Updates': true,
      'Money-Back Guarantee': false
    }
  }
]

export function FeatureComparison() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Core Features', 'Calculators'])
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  
  const categories = [...new Set(features.map(f => f.category))]
  
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      )
    }
    return <span className="text-sm text-gray-600">{value}</span>
  }
  
  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 min-w-[250px] sticky left-0 bg-gray-50 z-10">
                  Features
                </th>
                {competitors.map((competitor) => (
                  <th
                    key={competitor.name}
                    className={`text-center p-4 min-w-[150px] ${
                      competitor.highlight
                        ? 'bg-blue-50 border-x-2 border-blue-200'
                        : ''
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {competitor.name}
                    </div>
                    <div className="text-sm text-gray-600 font-normal mt-1">
                      {competitor.pricing}
                    </div>
                    {competitor.highlight && (
                      <div className="mt-2">
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          BEST VALUE
                        </span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const categoryFeatures = features.filter(f => f.category === category)
                const isExpanded = expandedCategories.includes(category)
                
                return (
                  <React.Fragment key={category}>
                    <tr 
                      className="bg-gray-100 border-y cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => toggleCategory(category)}
                    >
                      <td colSpan={competitors.length + 1} className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">
                            {category}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && categoryFeatures.map((feature, index) => (
                      <tr
                        key={feature.name}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="p-4 sticky left-0 bg-inherit">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              {feature.name}
                            </span>
                            {feature.description && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="w-4 h-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{feature.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        {competitors.map((competitor) => (
                          <td
                            key={competitor.name}
                            className={`p-4 text-center ${
                              competitor.highlight
                                ? 'bg-blue-50/50 border-x-2 border-blue-100'
                                : ''
                            }`}
                          >
                            {renderFeatureValue(
                              competitor.features[feature.name]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gray-50 p-6 text-center border-t">
          <h3 className="text-lg font-semibold mb-2">
            See Why ProPaint Quote is the #1 Choice
          </h3>
          <p className="text-gray-600 mb-4">
            More features, better pricing, and AI-powered technology
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/trial-signup'}>
              Start Free 14-Day Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/demo'}>
              Watch Demo
            </Button>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}