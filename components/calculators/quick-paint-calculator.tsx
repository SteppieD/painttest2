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
  className = ""
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
    <Card className={`border-2 border-blue-100 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Square Footage
            </label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter square feet"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rooms
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            Calculate
            <Calculator className="w-4 h-4 ml-2" />
          </Button>
          
          {result && (
            <div className="mt-4 space-y-2 bg-green-50 border border-green-200 p-3 rounded-md">
              <div className="text-center">
                <div className="text-lg font-bold text-green-800">
                  ${result.total.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Total Estimate</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold">{result.gallons} gallons</div>
                  <div className="text-gray-600">Paint needed</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">${result.cost}</div>
                  <div className="text-gray-600">Paint cost</div>
                </div>
              </div>
              <div className="text-xs text-center text-gray-500 pt-2 border-t">
                *Rough estimate. Get precise quote with full calculator
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}