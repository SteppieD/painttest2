'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    <div className="grid grid-cols-3 gap-2">
      {markupOptions.map((markup) => (
        <Button
          key={markup}
          variant={currentMarkup === markup ? "default" : "outline"}
          size="sm"
          onClick={() => onMarkupChange(markup)}
          className={cn(
            "h-10 text-sm font-medium transition-all",
            currentMarkup === markup && "shadow-md"
          )}
        >
          {markup}%
        </Button>
      ))}
    </div>
  )
}