'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Gift, 
  DollarSign,
  Palette,
  Settings,
  Skip
} from 'lucide-react'

interface RateRange {
  low: number
  avg: number  
  high: number
}

interface SetupData {
  // Labor rates
  interior_wall_rate?: number
  ceiling_rate?: number
  trim_rate?: number
  door_rate?: number
  
  // Paint preferences
  preferred_wall_paint?: string
  wall_paint_cost?: number
  wall_paint_coverage?: number
  
  preferred_primer?: string
  primer_cost?: number
  primer_coverage?: number
  
  // Business settings
  labor_included_in_paint?: boolean
  material_markup_percent?: number
  separate_prep_charge?: boolean
}

interface SetupWizardProps {
  companyId: number
  onComplete: (data: SetupData) => void
  onSkip: () => void
  existingData?: Partial<SetupData>
}

const SETUP_SECTIONS = [
  {
    id: 'labor_rates',
    title: 'Labor Rates',
    description: 'Set your pricing for different types of work',
    icon: <DollarSign className="w-5 h-5" />,
    fields: ['interior_wall_rate', 'ceiling_rate', 'trim_rate', 'door_rate']
  },
  {
    id: 'paint_preferences', 
    title: 'Paint Preferences',
    description: 'Your go-to paints and their costs',
    icon: <Palette className="w-5 h-5" />,
    fields: ['preferred_wall_paint', 'wall_paint_cost', 'preferred_primer', 'primer_cost']
  },
  {
    id: 'business_settings',
    title: 'Business Settings', 
    description: 'How you structure your pricing',
    icon: <Settings className="w-5 h-5" />,
    fields: ['labor_included_in_paint', 'material_markup_percent']
  }
]

// Default rate ranges (would come from API in real implementation)
const RATE_RANGES: Record<string, RateRange> = {
  interior_wall_rate: { low: 0.75, avg: 1.50, high: 3.00 },
  ceiling_rate: { low: 0.50, avg: 1.25, high: 2.50 },
  trim_rate: { low: 1.00, avg: 2.00, high: 4.00 },
  door_rate: { low: 15, avg: 35, high: 75 }
}

export function SetupWizard({ companyId, onComplete, onSkip, existingData = {} }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupData, setSetupData] = useState<SetupData>(existingData)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate completion percentage
  const calculateProgress = () => {
    const totalFields = SETUP_SECTIONS.flatMap(section => section.fields).length
    const completedFields = Object.keys(setupData).filter(key => 
      setupData[key as keyof SetupData] !== undefined && 
      setupData[key as keyof SetupData] !== null &&
      setupData[key as keyof SetupData] !== ''
    ).length
    return Math.round((completedFields / totalFields) * 100)
  }

  const updateField = (field: string, value: any) => {
    setSetupData(prev => ({ ...prev, [field]: value }))
  }

  const saveProgress = async () => {
    setIsLoading(true)
    try {
      // API call to save progress
      await fetch('/api/companies/setup-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          setupData,
          sectionCompleted: SETUP_SECTIONS[currentStep].id
        })
      })
    } catch (error) {
      console.error('Failed to save setup progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const completeSetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/companies/complete-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          setupData
        })
      })
      
      const result = await response.json()
      if (result.bonusQuotesAwarded) {
        // Show bonus notification
        alert(`🎉 Setup complete! You've earned ${result.bonusQuotes} bonus quotes!`)
      }
      
      onComplete(setupData)
    } catch (error) {
      console.error('Failed to complete setup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const RateSliderField = ({ 
    field, 
    label, 
    range, 
    unit = '/sq ft',
    prefix = '$'
  }: {
    field: string
    label: string  
    range: RateRange
    unit?: string
    prefix?: string
  }) => {
    const value = setupData[field as keyof SetupData] as number || range.avg
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={field}>{label}</Label>
          <div className="flex items-center gap-2">
            <Input
              id={field}
              type="number"
              step="0.25"
              value={value}
              onChange={(e) => updateField(field, parseFloat(e.target.value) || 0)}
              className="w-24 text-right"
            />
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Slider
            value={[value]}
            onValueChange={(values) => updateField(field, values[0])}
            min={range.low}
            max={range.high}
            step={0.25}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low: {prefix}{range.low}{unit}</span>
            <span>Avg: {prefix}{range.avg}{unit}</span>
            <span>High: {prefix}{range.high}{unit}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderCurrentSection = () => {
    const section = SETUP_SECTIONS[currentStep]
    
    switch (section.id) {
      case 'labor_rates':
        return (
          <div className="space-y-6">
            <RateSliderField
              field="interior_wall_rate"
              label="Interior wall painting"
              range={RATE_RANGES.interior_wall_rate}
            />
            <RateSliderField
              field="ceiling_rate" 
              label="Ceiling painting"
              range={RATE_RANGES.ceiling_rate}
            />
            <RateSliderField
              field="trim_rate"
              label="Trim & detail work"
              range={RATE_RANGES.trim_rate}
            />
            <RateSliderField
              field="door_rate"
              label="Doors & windows"
              range={RATE_RANGES.door_rate}
              unit="/each"
            />
          </div>
        )
        
      case 'paint_preferences':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="preferred_wall_paint">Preferred wall paint</Label>
              <Input
                id="preferred_wall_paint"
                placeholder="e.g., Sherwin Williams ProClassic"
                value={setupData.preferred_wall_paint || ''}
                onChange={(e) => updateField('preferred_wall_paint', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wall_paint_cost">Cost per gallon</Label>
                <Input
                  id="wall_paint_cost"
                  type="number"
                  placeholder="55.00"
                  value={setupData.wall_paint_cost || ''}
                  onChange={(e) => updateField('wall_paint_cost', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wall_paint_coverage">Coverage (sq ft)</Label>
                <Input
                  id="wall_paint_coverage"
                  type="number"
                  placeholder="400"
                  value={setupData.wall_paint_coverage || ''}
                  onChange={(e) => updateField('wall_paint_coverage', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferred_primer">Preferred primer</Label>
              <Input
                id="preferred_primer"
                placeholder="e.g., Zinsser Bulls Eye 1-2-3"
                value={setupData.preferred_primer || ''}
                onChange={(e) => updateField('preferred_primer', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primer_cost">Primer cost per gallon</Label>
              <Input
                id="primer_cost"
                type="number"
                placeholder="45.00"
                value={setupData.primer_cost || ''}
                onChange={(e) => updateField('primer_cost', parseFloat(e.target.value))}
              />
            </div>
          </div>
        )
        
      case 'business_settings':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>How do you structure your pricing?</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pricing_structure"
                    checked={setupData.labor_included_in_paint === true}
                    onChange={() => updateField('labor_included_in_paint', true)}
                  />
                  <span>Labor included in paint pricing</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pricing_structure"
                    checked={setupData.labor_included_in_paint === false}
                    onChange={() => updateField('labor_included_in_paint', false)}
                  />
                  <span>Separate labor and material charges</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material_markup_percent">Material markup percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="material_markup_percent"
                  type="number"
                  placeholder="15"
                  value={setupData.material_markup_percent || ''}
                  onChange={(e) => updateField('material_markup_percent', parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  const isLastStep = currentStep === SETUP_SECTIONS.length - 1
  const progress = calculateProgress()

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {SETUP_SECTIONS[currentStep].icon}
              <div>
                <CardTitle>{SETUP_SECTIONS[currentStep].title}</CardTitle>
                <p className="text-sm text-gray-600">{SETUP_SECTIONS[currentStep].description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">{progress}% complete</Badge>
              {progress === 100 && (
                <Badge className="bg-green-500">
                  <Gift className="w-3 h-3 mr-1" />
                  Bonus eligible!
                </Badge>
              )}
            </div>
          </div>
          
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {renderCurrentSection()}
            
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                
                <Button variant="ghost" onClick={onSkip}>
                  <Skip className="w-4 h-4 mr-2" />
                  Skip Setup
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={saveProgress}
                  disabled={isLoading}
                >
                  Save Progress
                </Button>
                
                {isLastStep ? (
                  <Button 
                    onClick={completeSetup}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                    {progress === 100 && (
                      <Gift className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}