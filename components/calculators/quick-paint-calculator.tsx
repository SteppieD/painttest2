'use client'

import { useState } from 'react'
import { Calculator, Home, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuickPaintCalculatorProps {
  title?: string
  subtitle?: string
  className?: string
}

export function QuickPaintCalculator({ 
  title = "Quick Paint Calculator", 
  subtitle = "Get instant estimate",
 
}: QuickPaintCalculatorProps) {
  const [sqft, setSqft] = useState('')
  const [rooms, setRooms] = useState('2')
  const [result, setResult] = useState<{
    gallons: number
    cost: number
    laborCost: number
    total: number
  } | null>(null)

  const calculatePaint = () => {
    const squareFeet = parseInt(sqft) || 0
    const roomCount = parseInt(rooms) || 1
    
    if (squareFeet > 0) {
      // Basic calculation: 1 gallon covers ~350 sqft, 2 coats needed
      const gallons = Math.ceil((squareFeet * 2) / 350)
      const paintCost = gallons * 45 // $45 per gallon average
      const laborCost = squareFeet * 2.50 // $2.50 per sqft average
      const total = paintCost + laborCost
      
      setResult({
        gallons,
        cost: paintCost,
        laborCost,
        total
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div>
          <Calculator />
        </div>
        <CardTitle>{title}</CardTitle>
        <p>{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <label>
              Square Footage
            </label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
             
              placeholder="Enter square feet"
            />
          </div>
          
          <div>
            <label>
              Number of Rooms
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
             
            >
              <option value="1">1 room</option>
              <option value="2">2 rooms</option>
              <option value="3">3 rooms</option>
              <option value="4">4 rooms</option>
              <option value="5">5+ rooms</option>
            </select>
          </div>
          
          <Button 
            onClick={calculatePaint}
           
            size="sm"
          >
            Calculate
            <Calculator />
          </Button>
          
          {result && (
            <div>
              <div>
                <div>
                  ${result.total.toLocaleString()}
                </div>
                <div>Total Estimate</div>
              </div>
              <div>
                <div>
                  <div>{result.gallons} gallons</div>
                  <div>Paint needed</div>
                </div>
                <div>
                  <div>${result.cost}</div>
                  <div>Paint cost</div>
                </div>
              </div>
              <div>
                *Rough estimate. Get precise quote with full calculator
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}