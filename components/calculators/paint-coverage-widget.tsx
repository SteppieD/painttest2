'use client'

import { useState } from 'react'
import { Palette, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PaintCoverageWidgetProps {
  title?: string
  className?: string
}

export function PaintCoverageWidget({ 
  title = "Paint Coverage Calculator",
  className = ""
}: PaintCoverageWidgetProps) {
  const [gallons, setGallons] = useState('')
  const [coats, setCoats] = useState('2')
  const [surface, setSurface] = useState('smooth')
  const [result, setResult] = useState<{
    coverage: number
    rooms: number
    cost: number
  } | null>(null)

  const surfaceFactors = {
    smooth: { factor: 350, name: 'Smooth (drywall, wood)' },
    textured: { factor: 300, name: 'Textured (orange peel)' },
    rough: { factor: 250, name: 'Rough (stucco, brick)' },
    primer: { factor: 300, name: 'Primer application' }
  }

  const calculateCoverage = () => {
    const g = parseFloat(gallons) || 0
    const c = parseInt(coats) || 1
    
    if (g > 0) {
      const surfaceData = surfaceFactors[surface as keyof typeof surfaceFactors]
      
      // Calculate total coverage
      const coveragePerGallon = surfaceData.factor
      const totalCoverage = (g * coveragePerGallon) / c
      
      // Estimate room count (average room ~300 sqft walls + ceiling)
      const avgRoomSize = 300
      const rooms = Math.floor(totalCoverage / avgRoomSize)
      
      // Cost calculation (average $45/gallon)
      const cost = g * 45
      
      setResult({
        coverage: Math.round(totalCoverage),
        rooms: Math.max(1, rooms),
        cost: Math.round(cost)
      })
    }
  }

  return (
    <Card className={`border-2 border-purple-100 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Palette className="w-6 h-6 text-purple-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">How much area will your paint cover?</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Paint Gallons
            </label>
            <input
              type="number"
              step="0.5"
              value={gallons}
              onChange={(e) => setGallons(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="2.5"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Number of Coats
            </label>
            <select
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1">1 coat</option>
              <option value="2">2 coats (recommended)</option>
              <option value="3">3 coats (high coverage)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Surface Type
            </label>
            <select
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {Object.entries(surfaceFactors).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={calculateCoverage}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            Calculate Coverage
            <Droplets className="w-4 h-4 ml-2" />
          </Button>
          
          {result && (
            <div className="mt-4 space-y-2 bg-purple-50 border border-purple-200 p-3 rounded-md">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-800">
                  {result.coverage.toLocaleString()} sq ft
                </div>
                <div className="text-sm text-purple-600">Total Coverage</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold">~{result.rooms} rooms</div>
                  <div className="text-gray-600">Estimated rooms</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">${result.cost}</div>
                  <div className="text-gray-600">Paint cost</div>
                </div>
              </div>
              <div className="text-xs text-center text-gray-500 pt-2 border-t">
                *Based on {surfaceFactors[surface as keyof typeof surfaceFactors].factor} sqft/gallon coverage
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}