'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface CostComparisonWidgetProps {
  title?: string
  className?: string
}

export function CostComparisonWidget({ 
  title = "DIY vs Professional Cost Calculator",
  className = ""
}: CostComparisonWidgetProps) {
  const [sqft, setSqft] = useState('')
  const [paintQuality, setPaintQuality] = useState('standard')
  const [result, setResult] = useState<{
    diy: {
      materials: number
      tools: number
      time: number
      total: number
    }
    professional: {
      materials: number
      labor: number
      total: number
      time: number
    }
    savings: number
    timeSavings: number
  } | null>(null)

  const paintPrices = {
    standard: { price: 35, name: 'Standard Paint' },
    premium: { price: 55, name: 'Premium Paint' },
    luxury: { price: 75, name: 'Luxury Paint' }
  }

  const calculateComparison = () => {
    const squareFeet = parseInt(sqft) || 0
    
    if (squareFeet > 0) {
      const paintData = paintPrices[paintQuality as keyof typeof paintPrices]
      const gallonsNeeded = Math.ceil((squareFeet * 2) / 350) // 2 coats
      
      // DIY Costs
      const diyMaterials = gallonsNeeded * paintData.price + 50 // paint + supplies
      const diyTools = 75 // brushes, rollers, drop cloths, etc.
      const diyTime = Math.ceil(squareFeet / 200) // hours at 200 sqft/hour
      const diyTotal = diyMaterials + diyTools
      
      // Professional Costs
      const profMaterials = gallonsNeeded * (paintData.price * 0.8) // contractor discount
      const profLabor = squareFeet * 2.50 // $2.50 per sqft
      const profTotal = profMaterials + profLabor
      const profTime = Math.ceil(squareFeet / 800) // 800 sqft/hour with crew
      
      // Savings calculations
      const savings = diyTotal - profTotal
      const timeSavings = diyTime - profTime
      
      setResult({
        diy: {
          materials: diyMaterials,
          tools: diyTools,
          time: diyTime,
          total: diyTotal
        },
        professional: {
          materials: profMaterials,
          labor: profLabor,
          total: profTotal,
          time: profTime
        },
        savings,
        timeSavings
      })
    }
  }

  return (
    <Card className={`border-2 border-orange-100 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">Compare DIY vs hiring professionals</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Square Footage to Paint
            </label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="1000"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Paint Quality
            </label>
            <select
              value={paintQuality}
              onChange={(e) => setPaintQuality(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {Object.entries(paintPrices).map(([key, data]) => (
                <option key={key} value={key}>{data.name} (${data.price}/gal)</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={calculateComparison}
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="sm"
          >
            Compare Costs
            <TrendingUp className="w-4 h-4 ml-2" />
          </Button>
          
          {result && (
            <div className="mt-4 space-y-3">
              {/* DIY Option */}
              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <div className="text-center mb-2">
                  <div className="text-sm font-semibold text-red-800">DIY Option</div>
                  <div className="text-lg font-bold text-red-900">${result.diy.total}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Materials: ${result.diy.materials}</div>
                  <div>Tools: ${result.diy.tools}</div>
                  <div className="col-span-2 text-center border-t pt-1">
                    Time: {result.diy.time} hours
                  </div>
                </div>
              </div>
              
              {/* Professional Option */}
              <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                <div className="text-center mb-2">
                  <div className="text-sm font-semibold text-green-800">Professional</div>
                  <div className="text-lg font-bold text-green-900">${result.professional.total}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Materials: ${result.professional.materials}</div>
                  <div>Labor: ${result.professional.labor}</div>
                  <div className="col-span-2 text-center border-t pt-1">
                    Time: {result.professional.time} hours
                  </div>
                </div>
              </div>
              
              {/* Comparison */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-center">
                <div className="text-sm font-semibold text-blue-800">
                  {result.savings > 0 ? 'DIY Saves' : 'Professional Saves'}: ${Math.abs(result.savings)}
                </div>
                <div className="text-xs text-blue-600">
                  Professional saves {result.timeSavings} hours
                </div>
                <Button asChild size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  <Link href="/trial-signup">
                    Get Professional Quote
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}