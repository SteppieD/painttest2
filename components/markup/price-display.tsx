'use client'

import { DollarSign, TrendingUp } from 'lucide-react'
interface PriceDisplayProps {
  baseCost: number
  markupPercentage: number
  markupAmount: number
  finalPrice: number
  className?: string
}

export function PriceDisplay({
  baseCost,
  markupPercentage,
  markupAmount,
  finalPrice,
  className
}: PriceDisplayProps) {
  return (
    <div>
      <div>
        <div>
          <span>Base Cost</span>
          <span>${baseCost.toLocaleString()}</span>
        </div>
        
        <div>
          <span>
            <TrendingUp />
            Markup ({markupPercentage}%)
          </span>
          <span>+${markupAmount.toLocaleString()}</span>
        </div>
        
        <div>
          <div>
            <span>
              <DollarSign />
              Final Price
            </span>
            <span>
              ${finalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Profit margin indicator */}
      <div>
        <div>
          <div />
          <span>
            {markupPercentage < 15 ? "Low margin" :
             markupPercentage < 25 ? "Standard margin" :
             "Healthy margin"}
          </span>
        </div>
      </div>
    </div>
  )
}