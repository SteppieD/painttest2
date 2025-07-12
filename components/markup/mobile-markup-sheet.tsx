'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Calculator, Save, Eye, X, Minus, Plus } from 'lucide-react'
import { QuoteResult } from '@/lib/quote-calculator'
import { PriceDisplay } from './price-display'
import { QuickMarkupButtons } from './quick-markup-buttons'

interface MobileMarkupSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  quote: QuoteResult
  markupPercentage: number
  onMarkupChange: (value: number) => void
  onSave: () => void
  isSaving?: boolean
}

export function MobileMarkupSheet({
  isOpen,
  onOpenChange,
  quote,
  markupPercentage,
  onMarkupChange,
  onSave,
  isSaving = false
}: MobileMarkupSheetProps) {
  const baseCost = quote.totalCost
  const markupAmount = baseCost * (markupPercentage / 100)
  const finalPrice = baseCost + markupAmount

  const incrementMarkup = () => {
    onMarkupChange(Math.min(100, markupPercentage + 1))
  }

  const decrementMarkup = () => {
    onMarkupChange(Math.max(0, markupPercentage - 1))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <div>
            <SheetTitle>
              <Calculator />
              <span>Quote Pricing</span>
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
             
            >
              <X />
            </Button>
          </div>
          
          {/* Mobile Price Display */}
          <PriceDisplay
            baseCost={baseCost}
            markupPercentage={markupPercentage}
            markupAmount={markupAmount}
            finalPrice={finalPrice}
          />
        </SheetHeader>

        <div>
          {/* Quick Markup Buttons */}
          <div>
            <Label>Quick Markup Options</Label>
            <QuickMarkupButtons
              currentMarkup={markupPercentage}
              onMarkupChange={onMarkupChange}
            />
          </div>

          {/* Custom Markup Input with +/- buttons */}
          <div>
            <Label>Custom Markup</Label>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={decrementMarkup}
                disabled={markupPercentage <= 0}
               
              >
                <Minus />
              </Button>
              
              <div>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={markupPercentage}
                  onChange={(e) => onMarkupChange(Number(e.target.value))}
                 
                />
                <span>
                  %
                </span>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={incrementMarkup}
                disabled={markupPercentage >= 100}
               
              >
                <Plus />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quote Breakdown */}
          <div>
            <h3>Cost Breakdown</h3>
            <div>
              <div>
                <span>Labor</span>
                <span>${(quote.breakdown.labor?.total || 0).toLocaleString()}</span>
              </div>
              <div>
                <span>Materials</span>
                <span>${(quote.breakdown.materials?.total || 0).toLocaleString()}</span>
              </div>
              <div>
                <div>
                  <span>Base Cost</span>
                  <span>${baseCost.toLocaleString()}</span>
                </div>
                <div>
                  <span>Markup ({markupPercentage}%)</span>
                  <span>+${markupAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          {quote.timeEstimate && (
            <div>
              <h3>Project Summary</h3>
              <div>
                <div>
                  <span>Timeline:</span>
                  <span>{quote.timeEstimate}</span>
                </div>
                {quote.details?.sqft && (
                  <div>
                    <span>Total Sq Ft:</span>
                    <span>{quote.details.sqft}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div>
          <Button
            onClick={() => {
              onSave()
              onOpenChange(false)
            }}
            disabled={isSaving}
           
            size="lg"
          >
            <Save />
            {isSaving ? 'Saving...' : 'Save Quote'}
          </Button>
          
          <Button
            variant="outline"
           
            onClick={() => {
              // Preview functionality
              console.log('Preview quote')
            }}
          >
            <Eye />
            Preview Customer View
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}