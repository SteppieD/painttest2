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
    <Card`}>
      <CardHeader>
        <div>
          <DollarSign />
        </div>
        <CardTitle>{title}</CardTitle>
        <p>Compare DIY vs hiring professionals</p>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <label>
              Square Footage to Paint
            </label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
             
              placeholder="1000"
            />
          </div>
          
          <div>
            <label>
              Paint Quality
            </label>
            <select
              value={paintQuality}
              onChange={(e) => setPaintQuality(e.target.value)}
             
            >
              {Object.entries(paintPrices).map(([key, data]) => (
                <option key={key} value={key}>{data.name} (${data.price}/gal)</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={calculateComparison}
           
            size="sm"
          >
            Compare Costs
            <TrendingUp />
          </Button>
          
          {result && (
            <div>
              {/* DIY Option */}
              <div>
                <div>
                  <div>DIY Option</div>
                  <div>${result.diy.total}</div>
                </div>
                <div>
                  <div>Materials: ${result.diy.materials}</div>
                  <div>Tools: ${result.diy.tools}</div>
                  <div>
                    Time: {result.diy.time} hours
                  </div>
                </div>
              </div>
              
              {/* Professional Option */}
              <div>
                <div>
                  <div>Professional</div>
                  <div>${result.professional.total}</div>
                </div>
                <div>
                  <div>Materials: ${result.professional.materials}</div>
                  <div>Labor: ${result.professional.labor}</div>
                  <div>
                    Time: {result.professional.time} hours
                  </div>
                </div>
              </div>
              
              {/* Comparison */}
              <div>
                <div>
                  {result.savings > 0 ? 'DIY Saves' : 'Professional Saves'}: ${Math.abs(result.savings)}
                </div>
                <div>
                  Professional saves {result.timeSavings} hours
                </div>
                <Button asChild size="sm">
                  <Link href="/trial-signup">
                    Get Professional Quote
                    <ArrowRight />
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