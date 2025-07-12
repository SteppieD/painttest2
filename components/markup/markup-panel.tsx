'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Calculator, Save, Eye, DollarSign } from 'lucide-react'
import { QuoteResult } from '@/lib/quote-calculator'
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
  const baseCost = quote.totalCost || 0
  const markupAmount = baseCost * (markupPercentage / 100)
  const finalPrice = baseCost + markupAmount

  return (
    <div>
      <CardHeader>
        <CardTitle>
          <Calculator />
          Quote Pricing
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Live Price Display */}
        <PriceDisplay
          baseCost={baseCost}
          markupPercentage={markupPercentage}
          markupAmount={markupAmount}
          finalPrice={finalPrice}
        />

        <Separator />

        {/* Quick Markup Buttons */}
        <div>
          <Label>Quick Markup Options</Label>
          <QuickMarkupButtons
            currentMarkup={markupPercentage}
            onMarkupChange={onMarkupChange}
          />
        </div>

        {/* Custom Markup Input */}
        <div>
          <Label htmlFor="custom-markup">
            Custom Markup
          </Label>
          <div>
            <Input
              id="custom-markup"
              type="number"
              min="0"
              max="100"
              value={markupPercentage}
              onChange={(e) => onMarkupChange(Number(e.target.value))}
             
            />
            <span>%</span>
          </div>
        </div>

        <Separator />

        {/* Quote Breakdown */}
        <div>
          <h3>Cost Breakdown</h3>
          <div>
            <div>
              <span>Labor:</span>
              <span>${(quote.breakdown?.labor?.total || 0).toLocaleString()}</span>
            </div>
            <div>
              <span>Materials:</span>
              <span>${(quote.breakdown?.materials?.total || 0).toLocaleString()}</span>
            </div>
            <div>
              <div>
                <span>Base Cost:</span>
                <span>${baseCost.toLocaleString()}</span>
              </div>
              <div>
                <span>Markup ({markupPercentage}%):</span>
                <span>+${markupAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Details */}
        {quote.details && (
          <div>
            <h3>Project Details</h3>
            <div>
              <p>Rooms: {quote.details.roomCount || 0}</p>
              <p>Total Sq Ft: {quote.details.sqft || 0}</p>
              <p>Timeline: {quote.timeEstimate || 'TBD'}</p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      <div>
        <Button
          onClick={onSave}
          disabled={isSaving}
         
          size="lg"
        >
          <Save />
          {isSaving ? 'Saving...' : 'Save Quote'}
        </Button>
        
        <Button
          variant="outline"
         
          onClick={() => {
            // Preview functionality would go here
            console.log('Preview quote')
          }}
        >
          <Eye />
          Preview Customer View
        </Button>
      </div>
    </div>
  )
}