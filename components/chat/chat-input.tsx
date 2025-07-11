'use client'

import { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Mic, MicOff, Image, Loader2 } from 'lucide-react'
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
    <div>
      {/* Input row */}
      <div>
        {/* Optional image upload button */}
        {onImageUpload && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onImageUpload}
            disabled={isLoading}
           
            aria-label="Upload image"
          >
            <Image />
          </Button>
        )}

        {/* Text input */}
        <div>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Describe your painting project..."
            disabled={isLoading}
           
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
             
            >
              {isRecording ? (
                <MicOff />
              ) : (
                <Mic />
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
           
          >
            {isRecording ? (
              <MicOff />
            ) : (
              <Mic />
            )}
          </Button>
        )}

        {/* Send button */}
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          size={isMobile ? "lg" : "default"}
         
        >
          {isLoading ? (
            <Loader2 />
          ) : (
            <>
              <Send />
              {!isMobile && "Send"}
            </>
          )}
        </Button>
      </div>

      {/* Helper text */}
      <p>
        {isRecording ? (
          "Recording... Tap to stop"
        ) : (
          "Type your message or use voice input"
        )}
      </p>
    </div>
  )
}