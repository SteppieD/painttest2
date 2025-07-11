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
    <div>
      <Card>
        <CardHeader>
          <div>
            <div>
              <CardTitle>
                <Lightbulb />
                Get Instant Quotes in One Message
              </CardTitle>
              <p>
                Pro tip: Include all details in your first message for the fastest quote
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Benefits */}
          <div>
            <div>
              <Clock />
              <div>Instant Results</div>
              <div>Get quotes in seconds</div>
            </div>
            <div>
              <MessageSquare />
              <div>One Message</div>
              <div>No back-and-forth needed</div>
            </div>
            <div>
              <DollarSign />
              <div>Cost Efficient</div>
              <div>Optimized pricing</div>
            </div>
          </div>

          {/* What to Include */}
          <div>
            <h3>Essential Information to Include:</h3>
            <div>
              <div>
                <div></div>
                Customer name
              </div>
              <div>
                <div></div>
                Project type (interior/exterior)
              </div>
              <div>
                <div></div>
                Square footage or room size
              </div>
              <div>
                <div></div>
                Paint preferences (optional)
              </div>
              <div>
                <div></div>
                Address (optional)
              </div>
              <div>
                <div></div>
                Timeline (optional)
              </div>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3>Examples You Can Try:</h3>
            
            <div>
              {EXAMPLE_QUOTES.map((quote, index) => (
                <div 
                  key={index}
                 `}
                  onClick={() => setCurrentExample(index)}
                >
                  <div>
                    <div>
                      <h4>{quote.title}</h4>
                      <p>{quote.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUseExample(quote.example)
                        onClose()
                      }}
                     
                    >
                      Use This
                    </Button>
                  </div>
                  
                  <div>
                    "{quote.example}"
                  </div>
                  
                  <div>
                    {quote.highlights.map((highlight, i) => (
                      <Badge key={i} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <Button 
              onClick={() => {
                onUseExample(EXAMPLE_QUOTES[currentExample].example)
                onClose()
              }}
             
            >
              Try Selected Example
            </Button>
            <Button variant="outline" onClick={onClose}>
              Start Fresh
            </Button>
          </div>

          <div>
            💡 Don't worry if you forget something - you can always add details in follow-up messages
          </div>
        </CardContent>
      </Card>
    </div>
  )
}