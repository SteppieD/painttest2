'use client'

interface QuoteWatermarkProps {
  className?: string
  variant?: 'subtle' | 'visible' | 'footer'
}

export function QuoteWatermark({ className, variant = 'footer' }: QuoteWatermarkProps) {
  if (variant === 'subtle') {
    return (
      <div>
        ProPaintQuote.com
      </div>
    )
  }

  if (variant === 'visible') {
    return (
      <div>
        <div>
          <span>Powered by</span>
          <span>ProPaintQuote</span>
        </div>
      </div>
    )
  }

  // Footer variant (default)
  return (
    <div>
      <div>
        <span>Created with</span>
        <span>ProPaintQuote</span>
      </div>
      <div>
        Professional quotes for painting contractors • www.propaintquote.com
      </div>
    </div>
  )
}

// Hook to determine if watermark should be shown
export function useWatermarkVisibility(companyId: string, isFreeTier: boolean = true) {
  // For now, always show watermark for free tier
  // Later this can check subscription status
  return {
    shouldShowWatermark: isFreeTier,
    watermarkVariant: isFreeTier ? 'footer' as const : null
  }
}