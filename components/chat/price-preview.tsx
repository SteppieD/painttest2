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
    <Card>
      <CardHeader>
        <CardTitle>
          <Calculator />
          Estimate Preview
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div>
          <div>
            <div>
              <Palette />
              Project Details
            </div>
            <div>
              <div>{quote.details?.sqft || 0} sq ft</div>
              <div>{quote.details?.roomCount || 0} rooms</div>
              {quote.details?.paintGallons && (
                <div>{quote.details.paintGallons} gallons paint</div>
              )}
            </div>
          </div>
          
          <div>
            <div>
              <Clock />
              Timeline
            </div>
            <div>
              <div>{quote.timeEstimate || 'TBD'}</div>
              <div>{quote.details?.totalLaborHours || 0} labor hours</div>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <span>Labor</span>
              <span>{formatCurrency(quote.breakdown?.labor?.total || 0)}</span>
            </div>
            <div>
              <span>Materials</span>
              <span>{formatCurrency(quote.breakdown?.materials?.total || 0)}</span>
            </div>
            <div>
              <span>Markup</span>
              <span>{formatCurrency(quote.breakdown?.markup || 0)}</span>
            </div>
            <div>
              <div>
                <span>Total Estimate</span>
                <span>
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
           
            size="sm"
          >
            {isGenerating ? (
              "Generating Quote..."
            ) : (
              <>
                <FileText />
                Generate Final Quote
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}