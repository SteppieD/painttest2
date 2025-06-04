'use client'

import { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Mic, MicOff, Image, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  onVoiceInput?: () => void
  onImageUpload?: () => void
  isLoading: boolean
  isRecording?: boolean
  isMobile: boolean
  inputRef?: RefObject<HTMLInputElement>
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  onVoiceInput,
  onImageUpload,
  isLoading,
  isRecording = false,
  isMobile,
  inputRef
}: ChatInputProps) {
  return (
    <div className="p-4 space-y-3">
      {/* Input row */}
      <div className="flex gap-2 items-end">
        {/* Optional image upload button */}
        {onImageUpload && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onImageUpload}
            disabled={isLoading}
            className="h-10 w-10 flex-shrink-0 hover:bg-gray-100"
            aria-label="Upload image"
          >
            <Image className="h-5 w-5 text-gray-600" />
          </Button>
        )}

        {/* Text input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Describe your painting project..."
            disabled={isLoading}
            className={cn(
              "pr-10 h-12 text-base",
              isMobile && "text-16" // Prevent zoom on iOS
            )}
            style={isMobile ? { fontSize: '16px' } : {}}
          />
          
          {/* Voice input button (inside input on mobile) */}
          {isMobile && onVoiceInput && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onVoiceInput}
              disabled={isLoading}
              className="absolute right-1 top-1 h-10 w-10 hover:bg-gray-100"
            >
              {isRecording ? (
                <MicOff className="h-5 w-5 text-red-600 animate-pulse" />
              ) : (
                <Mic className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          )}
        </div>

        {/* Voice input button (outside input on desktop) */}
        {!isMobile && onVoiceInput && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onVoiceInput}
            disabled={isLoading}
            className="h-12 w-12 flex-shrink-0 hover:bg-gray-100"
          >
            {isRecording ? (
              <MicOff className="h-5 w-5 text-red-600 animate-pulse" />
            ) : (
              <Mic className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        )}

        {/* Send button */}
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          size={isMobile ? "lg" : "default"}
          className={cn(
            "flex-shrink-0",
            isMobile ? "h-12 w-12 rounded-full" : "h-12 px-4"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Send className={cn("h-5 w-5", !isMobile && "mr-2")} />
              {!isMobile && "Send"}
            </>
          )}
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center">
        {isRecording ? (
          "Recording... Tap to stop"
        ) : (
          "Type your message or use voice input"
        )}
      </p>
    </div>
  )
}