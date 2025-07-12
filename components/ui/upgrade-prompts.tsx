"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  TrendingUp, Clock, Zap, AlertTriangle, CheckCircle, 
  X, ChevronRight, Trophy, DollarSign, Users, BarChart3 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpgradePromptProps {
  type: 'quota-limit' | 'feature-lock' | 'success-moment' | 'time-saved' | 'trial-ending'
  data?: any
  onUpgrade: () => void
  onDismiss: () => void
}

export function UpgradePrompt({ type, data, onUpgrade, onDismiss }: UpgradePromptProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300)
  }

  const prompts = {
    'quota-limit': {
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      title: `You've used ${data?.used || 2} of ${data?.limit || 3} free quotes`,
      description: 'Upgrade to unlimited quotes and never worry about limits again.',
      cta: 'Unlock Unlimited Quotes',
      urgency: 'Only 1 quote left this month',
      benefits: ['Unlimited quotes forever', 'No monthly restrictions', 'Priority support']
    },
    'feature-lock': {
      icon: Zap,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      title: 'Custom branding is a Pro feature',
      description: 'Make your quotes stand out with your logo, colors, and brand.',
      cta: 'Unlock Pro Features',
      urgency: 'Used by 73% of top contractors',
      benefits: ['Custom logo & colors', 'Remove watermarks', 'Premium templates']
    },
    'success-moment': {
      icon: Trophy,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: '🎉 Your quote was accepted!',
      description: 'With Pro, track which quotes convert best and optimize your pricing.',
      cta: 'Unlock Analytics',
      urgency: `You've won ${data?.wonJobs || 3} jobs this month!`,
      benefits: ['Quote analytics', 'Win rate tracking', 'Revenue insights']
    },
    'time-saved': {
      icon: Clock,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: `You've saved ${data?.hours || 12} hours this week!`,
      description: 'That's time you can spend growing your business instead of doing paperwork.',
      cta: 'Keep Saving Time',
      urgency: `Worth $${(data?.hours || 12) * 50} at $50/hour`,
      benefits: ['Save 40+ hours/month', 'Focus on what matters', 'Grow your business']
    },
    'trial-ending': {
      icon: DollarSign,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: `Your trial ends in ${data?.daysLeft || 3} days`,
      description: 'Lock in your discounted rate before prices increase.',
      cta: 'Claim 20% Off Forever',
      urgency: 'This offer expires with your trial',
      benefits: ['20% lifetime discount', 'Grandfather pricing', 'All Pro features']
    }
  }

  const prompt = prompts[type]
  const Icon = prompt.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <Card className={cn(
            "p-6 shadow-2xl",
            prompt.bgColor,
            prompt.borderColor,
            "border-2"
          )}>
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Content */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg bg-white/70",
                  prompt.iconColor
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {prompt.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {prompt.description}
                  </p>
                </div>
              </div>

              {/* Urgency banner */}
              {prompt.urgency && (
                <div className="bg-white/60 rounded-lg px-3 py-2 text-center">
                  <p className="text-sm font-medium text-gray-800">
                    {prompt.urgency}
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-2">
                {prompt.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  onClick={onUpgrade}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg transition-shadow"
                >
                  {prompt.cta}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="text-gray-600"
                >
                  Not now
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface UsageStatsBarProps {
  quotesUsed: number
  quotesLimit: number
  daysLeftInTrial?: number
}

export function UsageStatsBar({ quotesUsed, quotesLimit, daysLeftInTrial }: UsageStatsBarProps) {
  const percentage = (quotesUsed / quotesLimit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Monthly Usage
          </span>
        </div>
        {daysLeftInTrial && (
          <span className="text-xs text-orange-600 font-medium">
            Trial ends in {daysLeftInTrial} days
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <motion.div
          className={cn(
            "h-full transition-colors",
            isAtLimit ? "bg-red-500" :
            isNearLimit ? "bg-orange-500" :
            "bg-green-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          "font-medium",
          isAtLimit ? "text-red-600" :
          isNearLimit ? "text-orange-600" :
          "text-gray-600"
        )}>
          {quotesUsed} of {quotesLimit} quotes used
        </span>
        {isNearLimit && (
          <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
            Upgrade for unlimited
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}

interface ValueReminderProps {
  timeSaved: number
  quotesCreated: number
  revenueGenerated: number
}

export function ValueReminder({ timeSaved, quotesCreated, revenueGenerated }: ValueReminderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Your ProPaint Quote Impact
        </h4>
        <span className="text-xs text-gray-600">This month</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{timeSaved}h</div>
          <div className="text-xs text-gray-600">Time saved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{quotesCreated}</div>
          <div className="text-xs text-gray-600">Quotes sent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">${revenueGenerated}k</div>
          <div className="text-xs text-gray-600">Revenue</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-green-200">
        <p className="text-sm text-green-700 font-medium text-center">
          You've already earned back {Math.round(revenueGenerated * 1000 / 79)}x your investment!
        </p>
      </div>
    </motion.div>
  )
}