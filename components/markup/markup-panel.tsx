'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Calculator, Save, Eye, DollarSign } from 'lucide-react'
import { QuoteResult } from '@/lib/quote-calculator'
import { cn } from '@/lib/utils'
import { PriceDisplay } from './price-display'
import { QuickMarkupButtons } from './quick-markup-buttons'

interface MarkupPanelProps {
  quote: QuoteResult
  markupPercentage: number
  onMarkupChange: (value: number) => void
  onSave: () => void
  isSaving?: boolean
}

export function MarkupPanel({
  quote,
  markupPercentage,
  onMarkupChange,
  onSave,
  isSaving = false
}: MarkupPanelProps) {
  const baseCost = quote.totalCost
  const markupAmount = baseCost * (markupPercentage / 100)
  const finalPrice = baseCost + markupAmount

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-blue-600" />
          Quote Pricing
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 overflow-y-auto">
        {/* Live Price Display */}
        <PriceDisplay
          baseCost={baseCost}
          markupPercentage={markupPercentage}
          markupAmount={markupAmount}
          finalPrice={finalPrice}
        />

        <Separator />

        {/* Quick Markup Buttons */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Markup Options</Label>
          <QuickMarkupButtons
            currentMarkup={markupPercentage}
            onMarkupChange={onMarkupChange}
          />
        </div>

        {/* Custom Markup Input */}
        <div className="space-y-2">
          <Label htmlFor="custom-markup" className="text-sm font-medium">
            Custom Markup
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-markup"
              type="number"
              min="0"
              max="100"
              value={markupPercentage}
              onChange={(e) => onMarkupChange(Number(e.target.value))}
              className="flex-1"
            />
            <span className="flex items-center px-3 text-sm text-gray-600">%</span>
          </div>
        </div>

        <Separator />

        {/* Quote Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Cost Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Labor:</span>
              <span className="font-medium">${quote.breakdown.labor.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Materials:</span>
              <span className="font-medium">${quote.breakdown.materials.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prep Work:</span>
              <span className="font-medium">${quote.breakdown.prepWork.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Cost:</span>
                <span className="font-medium">${baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Markup ({markupPercentage}%):</span>
                <span className="font-medium">+${markupAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Details */}
        {quote.rooms && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Project Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Rooms: {quote.rooms.length}</p>
              <p>Total Sq Ft: {quote.totalSqFt}</p>
              <p>Timeline: {quote.timeEstimate}</p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      <div className="p-4 border-t space-y-3">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Quote'}
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Preview functionality would go here
            console.log('Preview quote')
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Customer View
        </Button>
      </div>
    </div>
  )
}