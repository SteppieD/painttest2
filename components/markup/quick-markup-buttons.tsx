'use client'

import { Button } from '@/components/ui/button'
interface QuickMarkupButtonsProps {
  currentMarkup: number
  onMarkupChange: (value: number) => void
}

export function QuickMarkupButtons({
  currentMarkup,
  onMarkupChange
}: QuickMarkupButtonsProps) {
  const markupOptions = [15, 20, 25, 30, 35, 40]

  return (
    <div>
      {markupOptions.map((markup) => (
        <Button
          key={markup}
          variant={currentMarkup === markup ? "default" : "outline"}
          size="sm"
          onClick={() => onMarkupChange(markup)}
         
        >
          {markup}%
        </Button>
      ))}
    </div>
  )
}