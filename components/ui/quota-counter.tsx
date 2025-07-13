'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Crown, AlertTriangle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface QuotaCounterProps {
  companyId: string
  variant?: 'header' | 'badge' | 'full'
  showUpgrade?: boolean
  className?: string
}

interface QuotaData {
  is_trial: boolean
  quote_limit: number
  quotes_used: number
  quotes_remaining: number
  company_name: string
}

export function QuotaCounter({ 
  companyId, 
  variant = 'header', 
  showUpgrade = true,
  className 
}: QuotaCounterProps) {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasShownWarning, setHasShownWarning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch(`/api/company-quota?company_id=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          setQuotaData(data)
          
          // Check if we should show 80% warning
          if (data.quote_limit > 0) {
            const usagePercentage = (data.quotes_used / data.quote_limit) * 100
            const warningKey = `quota_warning_shown_${companyId}_${data.quotes_used}`
            const hasShownThisWarning = localStorage.getItem(warningKey)
            
            if (usagePercentage >= 80 && usagePercentage < 100 && !hasShownThisWarning && !hasShownWarning) {
              setHasShownWarning(true)
              localStorage.setItem(warningKey, 'true')
              
              toast({
                title: "⚠️ Approaching Quote Limit",
                description: `You've used ${data.quotes_used} of ${data.quote_limit} quotes (${Math.round(usagePercentage)}%). Consider upgrading to continue creating unlimited quotes.`,
                duration: 8000,
                action: showUpgrade ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade Now
                  </Button>
                ) : undefined,
              })
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch quota:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchQuota()
      // Refresh quota every 30 seconds
      const interval = setInterval(fetchQuota, 30000)
      return () => clearInterval(interval)
    }
  }, [companyId, toast, showUpgrade, hasShownWarning])

  if (isLoading || !quotaData) {
    return (
      <div className="flex items-center gap-2 h-8">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  const usagePercentage = quotaData.quote_limit > 0 ? (quotaData.quotes_used / quotaData.quote_limit) * 100 : 0
  const isNearLimit = usagePercentage >= 80
  const isOverLimit = quotaData.quotes_used >= quotaData.quote_limit

  // Header variant - compact for headers
  if (variant === 'header') {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FileText className="w-4 h-4" />
          <span className="font-medium">
            {quotaData.quotes_used}/{quotaData.quote_limit}
          </span>
        </div>
        {quotaData.is_trial && (
          <Badge 
            variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
            className="text-xs"
          >
            {isOverLimit ? "Limit Reached" : `${quotaData.quotes_remaining} left`}
          </Badge>
        )}
        {showUpgrade && (isOverLimit || isNearLimit) && (
          <Button 
            size="sm" 
            variant={isOverLimit ? "default" : "outline"}
            className="ml-2"
            onClick={() => {
              // Use router.push for better navigation experience
              window.location.href = '/pricing';
            }}
          >
            {isOverLimit ? "Upgrade" : "80% Used"}
          </Button>
        )}
      </div>
    )
  }

  // Badge variant - minimal for tight spaces
  if (variant === 'badge') {
    return (
      <Badge 
        variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
        className="flex items-center gap-1"
      >
        <FileText className="w-3 h-3" />
        {quotaData.quotes_used}/{quotaData.quote_limit}
        {isOverLimit && <AlertTriangle className="w-3 h-3 ml-1" />}
      </Badge>
    )
  }

  // Full variant - detailed display
  return (
    <div className={`p-6 ${className || ''}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-blue-100'}`}>
          <FileText className={`w-6 h-6 ${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'}`} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">
              {quotaData.quotes_used} of {quotaData.quote_limit} quotes used
            </span>
            {quotaData.is_trial && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Trial
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            {isOverLimit 
              ? "Quote limit reached. Upgrade to create more quotes."
              : isNearLimit 
              ? `⚠️ Only ${quotaData.quotes_remaining} quotes remaining! Consider upgrading soon.`
              : `${quotaData.quotes_remaining} quotes remaining.`
            }
          </p>
        </div>
      </div>
      {showUpgrade && (isOverLimit || isNearLimit) && (
        <Button 
          variant={isOverLimit ? "default" : "outline"}
          className="ml-auto"
          onClick={() => {
            // Navigate to pricing page for upgrade
            window.location.href = '/pricing';
          }}
        >
          {isOverLimit ? "Upgrade Now" : "View Plans"}
        </Button>
      )}
    </div>
  )
}

// Hook for quota data
export function useQuotaData(companyId: string) {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch(`/api/company-quota?company_id=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          setQuotaData(data)
        }
      } catch (error) {
        console.error('Failed to fetch quota:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchQuota()
      const interval = setInterval(fetchQuota, 30000)
      return () => clearInterval(interval)
    }
  }, [companyId])

  return { quotaData, isLoading }
}