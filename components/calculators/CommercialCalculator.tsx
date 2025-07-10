'use client'

import React, { useState } from 'react'
import { 
  calculatePaintingProject, 
  PaintCalculationInput, 
  PaintCalculationResult
} from '@/lib/calculators/paint-calculator-engine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Building2, Info, Clock } from 'lucide-react'

interface CommercialCalculatorProps {
  onCalculate: (result: PaintCalculationResult) => void
}

export function CommercialCalculator({ onCalculate }: CommercialCalculatorProps) {
  const [buildingType, setBuildingType] = useState('office')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    floors: '1'
  })
  
  const [surfaces, setSurfaces] = useState({
    walls: true,
    ceiling: false,
    trim: false,
    doors: false,
    floors: false // For epoxy coating
  })
  
  const [additionalInputs, setAdditionalInputs] = useState({
    doors: '10',
    rooms: '1',
    openCeiling: false
  })
  
  const [paintQuality, setPaintQuality] = useState<'economy' | 'standard' | 'premium'>('standard')
  const [numberOfCoats, setNumberOfCoats] = useState('2')
  const [workSchedule, setWorkSchedule] = useState('business-hours')
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleDimensionChange = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handleSurfaceChange = (surface: string, checked: boolean) => {
    setSurfaces(prev => ({ ...prev, [surface]: checked }))
    setErrors([])
  }

  const validateInputs = (): boolean => {
    const newErrors: string[] = []
    
    if (!dimensions.length || parseFloat(dimensions.length) <= 0) {
      newErrors.push('Please enter a valid building length')
    }
    if (!dimensions.width || parseFloat(dimensions.width) <= 0) {
      newErrors.push('Please enter a valid building width')
    }
    if (!dimensions.height || parseFloat(dimensions.height) <= 0) {
      newErrors.push('Please enter a valid ceiling height')
    }
    if (!Object.values(surfaces).some(v => v)) {
      newErrors.push('Please select at least one surface to paint')
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCalculate = async () => {
    if (!validateInputs()) return
    
    setIsCalculating(true)
    
    try {
      // Adjust labor rate for after-hours work
      let laborRate = undefined
      if (workSchedule === 'after-hours') {
        laborRate = 65 // Higher rate for evening work
      } else if (workSchedule === 'weekend') {
        laborRate = 75 // Premium rate for weekend work
      }
      
      const input: PaintCalculationInput = {
        type: 'commercial',
        dimensions: {
          length: parseFloat(dimensions.length),
          width: parseFloat(dimensions.width),
          height: parseFloat(dimensions.height) * parseInt(dimensions.floors),
          doors: surfaces.doors ? parseInt(additionalInputs.doors) : 0
        },
        surfaces: {
          walls: surfaces.walls,
          ceiling: surfaces.ceiling && !additionalInputs.openCeiling,
          trim: surfaces.trim,
          doors: surfaces.doors
        },
        paintQuality,
        coats: parseInt(numberOfCoats),
        laborRate
      }
      
      const result = calculatePaintingProject(input)
      
      // Adjust for commercial specifics
      if (buildingType === 'warehouse' || buildingType === 'industrial') {
        result.recommendations.paintType = 'Industrial-Grade Epoxy or Acrylic'
        result.recommendations.sheenType = 'Semi-Gloss or Gloss'
      }
      
      onCalculate(result)
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors(['An error occurred during calculation. Please try again.'])
    } finally {
      setIsCalculating(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Building Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Building Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="buildingType">Building Type</Label>
            <select 
              id="buildingType"
              className="w-full mt-2 p-2 border rounded-md"
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
            >
              <option value="office">Office Building</option>
              <option value="retail">Retail Space</option>
              <option value="warehouse">Warehouse</option>
              <option value="industrial">Industrial Facility</option>
              <option value="medical">Medical/Healthcare</option>
              <option value="education">School/Education</option>
              <option value="hospitality">Hotel/Restaurant</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Building Length (ft)</Label>
              <Input
                id="length"
                type="number"
                value={dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                placeholder="100"
                step="10"
              />
            </div>
            <div>
              <Label htmlFor="width">Building Width (ft)</Label>
              <Input
                id="width"
                type="number"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                placeholder="80"
                step="10"
              />
            </div>
            <div>
              <Label htmlFor="height">Ceiling Height (ft)</Label>
              <Input
                id="height"
                type="number"
                value={dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                placeholder="12"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="floors">Number of Floors</Label>
              <select 
                id="floors"
                className="w-full p-2 border rounded-md"
                value={dimensions.floors}
                onChange={(e) => handleDimensionChange('floors', e.target.value)}
              >
                <option value="1">1 Floor</option>
                <option value="2">2 Floors</option>
                <option value="3">3 Floors</option>
                <option value="4">4 Floors</option>
                <option value="5">5+ Floors</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Surfaces to Paint */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Surfaces to Paint</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="walls" 
              checked={surfaces.walls}
              onCheckedChange={(checked) => handleSurfaceChange('walls', !!checked)}
            />
            <Label htmlFor="walls" className="cursor-pointer">
              Interior Walls
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ceiling" 
                checked={surfaces.ceiling}
                onCheckedChange={(checked) => handleSurfaceChange('ceiling', !!checked)}
              />
              <Label htmlFor="ceiling" className="cursor-pointer">
                Ceilings
              </Label>
            </div>
            {surfaces.ceiling && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="openCeiling" 
                  checked={additionalInputs.openCeiling}
                  onCheckedChange={(checked) => setAdditionalInputs(prev => ({ ...prev, openCeiling: !!checked }))}
                />
                <Label htmlFor="openCeiling" className="cursor-pointer text-sm">
                  Open/Exposed Ceiling
                </Label>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="trim" 
              checked={surfaces.trim}
              onCheckedChange={(checked) => handleSurfaceChange('trim', !!checked)}
            />
            <Label htmlFor="trim" className="cursor-pointer">
              Trim/Baseboards
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="doors" 
                checked={surfaces.doors}
                onCheckedChange={(checked) => handleSurfaceChange('doors', !!checked)}
              />
              <Label htmlFor="doors" className="cursor-pointer">
                Doors & Frames
              </Label>
            </div>
            {surfaces.doors && (
              <Input
                type="number"
                value={additionalInputs.doors}
                onChange={(e) => setAdditionalInputs(prev => ({ ...prev, doors: e.target.value }))}
                placeholder="10"
                className="w-20"
                min="0"
                max="100"
              />
            )}
          </div>
          {(buildingType === 'warehouse' || buildingType === 'industrial') && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="floors" 
                checked={surfaces.floors}
                onCheckedChange={(checked) => handleSurfaceChange('floors', !!checked)}
              />
              <Label htmlFor="floors" className="cursor-pointer">
                Floor Coating (Epoxy)
                <span className="text-sm text-gray-500 block">Industrial floor coating</span>
              </Label>
            </div>
          )}
        </div>
      </Card>
      
      {/* Work Schedule */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Work Schedule
        </h3>
        <RadioGroup value={workSchedule} onValueChange={setWorkSchedule}>
          <div className="flex items-center space-x-2 mt-2">
            <RadioGroupItem value="business-hours" id="business-hours" />
            <Label htmlFor="business-hours" className="cursor-pointer">
              Business Hours (Standard rates)
              <span className="text-sm text-gray-500 block">8 AM - 5 PM weekdays</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <RadioGroupItem value="after-hours" id="after-hours" />
            <Label htmlFor="after-hours" className="cursor-pointer">
              After Hours (+30% labor)
              <span className="text-sm text-gray-500 block">5 PM - 12 AM weekdays</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <RadioGroupItem value="weekend" id="weekend" />
            <Label htmlFor="weekend" className="cursor-pointer">
              Weekends (+50% labor)
              <span className="text-sm text-gray-500 block">Minimal business disruption</span>
            </Label>
          </div>
        </RadioGroup>
      </Card>
      
      {/* Paint Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Paint Options</h3>
        <div className="space-y-6">
          <div>
            <Label>Paint Quality</Label>
            <RadioGroup value={paintQuality} onValueChange={(value: any) => setPaintQuality(value)}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="economy" id="economy" />
                <Label htmlFor="economy" className="cursor-pointer">
                  Economy ($25-35/gallon)
                  <span className="text-sm text-gray-500 block">Basic commercial grade</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer">
                  Standard ($40-55/gallon)
                  <span className="text-sm text-gray-500 block">Durable, washable finish</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="cursor-pointer">
                  Premium ($60-80/gallon)
                  <span className="text-sm text-gray-500 block">Zero-VOC, antimicrobial options</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="coats">Number of Coats</Label>
            <select 
              id="coats"
              className="w-full mt-2 p-2 border rounded-md"
              value={numberOfCoats}
              onChange={(e) => setNumberOfCoats(e.target.value)}
            >
              <option value="1">1 Coat (refresh only)</option>
              <option value="2">2 Coats (standard)</option>
              <option value="3">3 Coats (color change/new construction)</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 font-semibold mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Calculate Button */}
      <Button 
        onClick={handleCalculate}
        disabled={isCalculating}
        className="w-full"
        size="lg"
      >
        {isCalculating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Calculating...
          </>
        ) : (
          <>
            <Building2 className="w-5 h-5 mr-2" />
            Calculate Commercial Painting Cost
          </>
        )}
      </Button>
      
      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Commercial Project Note:</p>
            <p>Commercial projects often require specialized insurance, permits, and safety equipment. 
            Our calculator includes standard commercial overhead. Large projects may qualify for volume discounts.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}