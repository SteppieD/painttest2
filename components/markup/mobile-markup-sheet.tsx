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
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto bg-white">
        <SheetHeader className="space-y-2 pb-4 border-b border-flat-gray-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Calculator className="icon-flat text-business-primary" />
              <span className="text-flat-heading">Quote Pricing</span>
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 interactive-flat"
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
            <Label className="text-flat-subheading">Quick Markup Options</Label>
            <QuickMarkupButtons
              currentMarkup={markupPercentage}
              onMarkupChange={onMarkupChange}
            />
          </div>

          {/* Custom Markup Input with +/- buttons */}
          <div className="space-y-3">
            <Label className="text-flat-subheading">Custom Markup</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementMarkup}
                disabled={markupPercentage <= 0}
                className="mobile-flat-button w-12 rounded-flat-full border-flat-gray-300 interactive-flat"
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
                  className="text-center text-flat-lg h-12 rounded-flat border-flat-gray-300 prevent-zoom"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-flat-gray-500">
                  %
                </span>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={incrementMarkup}
                disabled={markupPercentage >= 100}
                className="mobile-flat-button w-12 rounded-flat-full border-flat-gray-300 interactive-flat"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quote Breakdown */}
          <div className="space-y-4">
            <h3 className="text-flat-subheading">Cost Breakdown</h3>
            <div className="card-flat bg-flat-gray-50 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-flat-body">Labor</span>
                <span className="text-flat-body font-bold">${(quote.breakdown.labor?.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-flat-body">Materials</span>
                <span className="text-flat-body font-bold">${(quote.breakdown.materials?.total || 0).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-flat-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-flat-body">Base Cost</span>
                  <span className="text-flat-body font-bold">${baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-business-primary">
                  <span className="text-flat-body font-semibold">Markup ({markupPercentage}%)</span>
                  <span className="text-flat-body font-bold">+${markupAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          {quote.timeEstimate && (
            <div className="space-y-2">
              <h3 className="text-flat-subheading">Project Summary</h3>
              <div className="bg-business-primary/5 rounded-flat-lg p-4 space-y-2 border border-business-primary/20">
                <div className="flex justify-between">
                  <span className="text-flat-body">Timeline:</span>
                  <span className="text-flat-body font-bold">{quote.timeEstimate}</span>
                </div>
                {quote.details?.sqft && (
                  <div className="flex justify-between">
                    <span className="text-flat-body">Total Sq Ft:</span>
                    <span className="text-flat-body font-bold">{quote.details.sqft}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-flat-gray-200 pt-4 space-y-3 safe-area-inset-bottom">
          <Button
            onClick={() => {
              onSave()
              onOpenChange(false)
            }}
            disabled={isSaving}
            className="btn-flat-primary w-full mobile-flat-button"
            size="lg"
          >
            <Save className="icon-flat mr-2" />
            {isSaving ? 'Saving...' : 'Save Quote'}
          </Button>
          
          <Button
            variant="outline"
            className="btn-flat w-full mobile-flat-button border-flat-gray-300"
            onClick={() => {
              // Preview functionality
              console.log('Preview quote')
            }}
          >
            <Eye className="icon-flat mr-2" />
            Preview Customer View
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}