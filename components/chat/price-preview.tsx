'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, FileText, Clock, Palette } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { QuoteResult } from '@/lib/quote-calculator'

interface PricePreviewProps {
  quote: QuoteResult
  onGenerateQuote?: () => void
  isGenerating?: boolean
}

export function PricePreview({ quote, onGenerateQuote, isGenerating }: PricePreviewProps) {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-blue-600" />
          Estimate Preview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Palette className="w-4 h-4" />
              Project Details
            </div>
            <div className="text-xs space-y-1">
              <div>{quote.details?.sqft || 0} sq ft</div>
              <div>{quote.details?.roomCount || 0} rooms</div>
              {quote.details?.paintGallons && (
                <div>{quote.details.paintGallons} gallons paint</div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Timeline
            </div>
            <div className="text-xs space-y-1">
              <div>{quote.timeEstimate || 'TBD'}</div>
              <div>{quote.details?.totalLaborHours || 0} labor hours</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Labor</span>
              <span>{formatCurrency(quote.breakdown?.labor || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Materials</span>
              <span>{formatCurrency(quote.breakdown?.materials || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Prep Work</span>
              <span>{formatCurrency(quote.breakdown?.prepWork || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Markup</span>
              <span>{formatCurrency(quote.breakdown?.markup || 0)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Estimate</span>
                <span className="text-blue-600">
                  {formatCurrency(quote.totalCost || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {onGenerateQuote && (
          <Button 
            onClick={onGenerateQuote}
            disabled={isGenerating}
            className="w-full"
            size="sm"
          >
            {isGenerating ? (
              "Generating Quote..."
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Final Quote
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}