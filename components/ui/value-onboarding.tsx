"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Zap, CheckCircle, TrendingUp, Clock, FileText, 
  ChevronRight, Trophy, Target, Sparkles, X 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValueOnboardingProps {
  onComplete: () => void
  onSkip?: () => void
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  action: string
  icon: React.ElementType
  value: string
  timeToComplete: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'quick-win',
    title: 'See Your First Quote in 30 Seconds',
    description: 'Watch how fast you can create a professional quote',
    action: 'Create Demo Quote',
    icon: Zap,
    value: 'Instant "aha" moment',
    timeToComplete: '30 seconds'
  },
  {
    id: 'personalize',
    title: 'Add Your Business Info',
    description: 'Make quotes yours with your company name and pricing',
    action: 'Personalize',
    icon: Target,
    value: 'Professional branded quotes',
    timeToComplete: '2 minutes'
  },
  {
    id: 'first-real',
    title: 'Create Your First Real Quote',
    description: 'Try it with an actual customer or practice scenario',
    action: 'Start Quoting',
    icon: FileText,
    value: 'Ready to win jobs',
    timeToComplete: '3 minutes'
  }
]

export function ValueOnboarding({ onComplete, onSkip }: ValueOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showValue, setShowValue] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [demoQuoteCreated, setDemoQuoteCreated] = useState(false)
  const [timeSaved, setTimeSaved] = useState(0)

  const step = ONBOARDING_STEPS[currentStep]

  useEffect(() => {
    // Show value message after each step
    if (completedSteps.length > 0) {
      setShowValue(true)
      const timer = setTimeout(() => setShowValue(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [completedSteps])

  const handleStepComplete = () => {
    setCompletedSteps([...completedSteps, step.id])
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleQuickWin = () => {
    // Simulate creating a demo quote
    setDemoQuoteCreated(true)
    setTimeSaved(180) // 3 hours in minutes
    setTimeout(() => {
      handleStepComplete()
    }, 2000)
  }

  const progress = ((completedSteps.length) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Welcome to ProPaint Quote! 🎉</h2>
            {onSkip && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {ONBOARDING_STEPS.map((s, index) => (
                <div
                  key={s.id}
                  className={cn(
                    "text-xs",
                    index <= currentStep ? "text-primary-600 font-medium" : "text-gray-400"
                  )}
                >
                  {index + 1}. {s.title.split(' ').slice(0, 3).join(' ')}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Step Icon and Title */}
              <div className="text-center">
                <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    {step.timeToComplete}
                  </span>
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <Sparkles className="w-4 h-4" />
                    {step.value}
                  </span>
                </div>
              </div>

              {/* Step-specific content */}
              {step.id === 'quick-win' && (
                <div className="space-y-4">
                  {!demoQuoteCreated ? (
                    <Card className="p-6 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-4">
                        We'll create a sample quote for a 3-bedroom house. 
                        Watch how fast this happens...
                      </p>
                      <Button 
                        onClick={handleQuickWin}
                        className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                        size="lg"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        {step.action}
                      </Button>
                    </Card>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center space-y-4"
                    >
                      <div className="text-6xl">🎉</div>
                      <Card className="p-6 bg-green-50 border-green-200">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <h4 className="text-xl font-bold text-green-800 mb-2">
                          Quote Created in 28 Seconds!
                        </h4>
                        <p className="text-green-700">
                          That usually takes 3 hours manually. You just saved {timeSaved} minutes!
                        </p>
                      </Card>
                      <Button 
                        onClick={handleStepComplete}
                        variant="outline"
                        className="gap-2"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}

              {step.id === 'personalize' && (
                <div className="space-y-4">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company">Your Company Name</Label>
                        <Input
                          id="company"
                          placeholder="ABC Painting Co."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Your Hourly Rate</Label>
                          <Input
                            type="number"
                            placeholder="$50"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Typical Markup %</Label>
                          <Input
                            type="number"
                            placeholder="35"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Button 
                    onClick={handleStepComplete}
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                    size="lg"
                    disabled={!companyName}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    {step.action}
                  </Button>
                </div>
              )}

              {step.id === 'first-real' && (
                <div className="space-y-4">
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-center mb-2">You're Ready!</h4>
                    <p className="text-center text-gray-700 mb-4">
                      {companyName || 'Your company'} is all set up. Let's create your first real quote 
                      and start winning more jobs.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-lg text-primary-600">30 sec</div>
                        <div className="text-gray-600">Per quote</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-green-600">+47%</div>
                        <div className="text-gray-600">Win rate</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-purple-600">$2.8k</div>
                        <div className="text-gray-600">Avg job</div>
                      </div>
                    </div>
                  </Card>
                  <Button 
                    onClick={handleStepComplete}
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                    size="lg"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    {step.action}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Value reminder */}
        <AnimatePresence>
          {showValue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Great job! You're already saving time.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}