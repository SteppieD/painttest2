'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, MessageSquare, Clock, DollarSign, Lightbulb } from 'lucide-react'

interface QuoteTrainingModalProps {
  isOpen: boolean
  onClose: () => void
  onUseExample: (example: string) => void
}

const EXAMPLE_QUOTES = [
  {
    title: "Complete Interior Quote",
    description: "All details in one message",
    example: "Quote for Sarah Johnson at 123 Oak Street. Interior painting: 800 sq ft walls, 300 sq ft ceilings, 200 linear feet trim. Use Sherwin Williams ProClassic semi-gloss at $65/gallon. Need it done in 2 weeks.",
    highlights: ["Customer name", "Address", "Measurements", "Paint specifications", "Timeline"]
  },
  {
    title: "Simple Exterior Quote", 
    description: "Minimal but complete info",
    example: "Exterior quote for Mike at 456 Pine Ave. 1200 sq ft walls, Benjamin Moore Regal Select $70/gallon, eggshell finish. No trim work needed.",
    highlights: ["Customer name", "Project type", "Square footage", "Paint choice", "Finish"]
  },
  {
    title: "Quick Room Quote",
    description: "Single room with specifics",
    example: "Living room for Jennifer Chen - 15x12 room, 9ft ceilings, walls and ceiling only. Premium paint, looking for quote by Friday.",
    highlights: ["Customer name", "Room dimensions", "Surfaces to paint", "Quality level", "Deadline"]
  }
]

export function QuoteTrainingModal({ isOpen, onClose, onUseExample }: QuoteTrainingModalProps) {
  const [currentExample, setCurrentExample] = useState(0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Get Instant Quotes in One Message
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Pro tip: Include all details in your first message for the fastest quote
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-medium">Instant Results</div>
              <div className="text-xs text-gray-600">Get quotes in seconds</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium">One Message</div>
              <div className="text-xs text-gray-600">No back-and-forth needed</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-sm font-medium">Cost Efficient</div>
              <div className="text-xs text-gray-600">Optimized pricing</div>
            </div>
          </div>

          {/* What to Include */}
          <div>
            <h3 className="font-semibold mb-3">Essential Information to Include:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Customer name
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Project type (interior/exterior)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Square footage or room size
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Paint preferences (optional)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Address (optional)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Timeline (optional)
              </div>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold mb-3">Examples You Can Try:</h3>
            
            <div className="space-y-3">
              {EXAMPLE_QUOTES.map((quote, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    currentExample === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentExample(index)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{quote.title}</h4>
                      <p className="text-xs text-gray-600">{quote.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUseExample(quote.example)
                        onClose()
                      }}
                      className="text-xs"
                    >
                      Use This
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded text-sm italic mb-3">
                    "{quote.example}"
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {quote.highlights.map((highlight, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => {
                onUseExample(EXAMPLE_QUOTES[currentExample].example)
                onClose()
              }}
              className="flex-1"
            >
              Try Selected Example
            </Button>
            <Button variant="outline" onClick={onClose}>
              Start Fresh
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            💡 Don't worry if you forget something - you can always add details in follow-up messages
          </div>
        </CardContent>
      </Card>
    </div>
  )
}