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
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader className="space-y-2 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Quote Pricing
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
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

        <div className="py-6 space-y-6">
          {/* Quick Markup Buttons */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Markup Options</Label>
            <QuickMarkupButtons
              currentMarkup={markupPercentage}
              onMarkupChange={onMarkupChange}
            />
          </div>

          {/* Custom Markup Input with +/- buttons */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Custom Markup</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementMarkup}
                disabled={markupPercentage <= 0}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={markupPercentage}
                  onChange={(e) => onMarkupChange(Number(e.target.value))}
                  className="text-center text-lg h-12 text-base"
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={incrementMarkup}
                disabled={markupPercentage >= 100}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quote Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Cost Breakdown</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Labor</span>
                <span className="font-medium">${(quote.breakdown.labor?.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Materials</span>
                <span className="font-medium">${(quote.breakdown.materials?.total || 0).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Cost</span>
                  <span className="font-medium">${baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-blue-600">
                  <span>Markup ({markupPercentage}%)</span>
                  <span className="font-medium">+${markupAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          {quote.timeEstimate && (
            <div className="space-y-2">
              <h3 className="text-base font-medium">Project Summary</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{quote.timeEstimate}</span>
                </div>
                {quote.details?.sqft && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sq Ft:</span>
                    <span className="font-medium">{quote.details.sqft}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t pt-4 space-y-3">
          <Button
            onClick={() => {
              onSave()
              onOpenChange(false)
            }}
            disabled={isSaving}
            className="w-full h-12 text-base"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Quote'}
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={() => {
              // Preview functionality
              console.log('Preview quote')
            }}
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview Customer View
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}