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
    <Card`}>
      <CardHeader>
        <div>
          <Palette />
        </div>
        <CardTitle>{title}</CardTitle>
        <p>How much area will your paint cover?</p>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <label>
              Paint Gallons
            </label>
            <input
              type="number"
              step="0.5"
              value={gallons}
              onChange={(e) => setGallons(e.target.value)}
             
              placeholder="2.5"
            />
          </div>
          
          <div>
            <label>
              Number of Coats
            </label>
            <select
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
             
            >
              <option value="1">1 coat</option>
              <option value="2">2 coats (recommended)</option>
              <option value="3">3 coats (high coverage)</option>
            </select>
          </div>
          
          <div>
            <label>
              Surface Type
            </label>
            <select
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
             
            >
              {Object.entries(surfaceFactors).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={calculateCoverage}
           
            size="sm"
          >
            Calculate Coverage
            <Droplets />
          </Button>
          
          {result && (
            <div>
              <div>
                <div>
                  {result.coverage.toLocaleString()} sq ft
                </div>
                <div>Total Coverage</div>
              </div>
              <div>
                <div>
                  <div>~{result.rooms} rooms</div>
                  <div>Estimated rooms</div>
                </div>
                <div>
                  <div>${result.cost}</div>
                  <div>Paint cost</div>
                </div>
              </div>
              <div>
                *Based on {surfaceFactors[surface as keyof typeof surfaceFactors].factor} sqft/gallon coverage
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}