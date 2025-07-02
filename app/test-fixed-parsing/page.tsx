'use client'

import { FixedChatInterface } from '@/components/chat/fixed-chat-interface'

export default function TestFixedParsingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FixedChatInterface
        companyId="demo-company-123"
        onQuoteGenerated={(quote) => {
          console.log('Quote generated:', quote)
        }}
        onBack={() => {
          window.location.href = '/dashboard'
        }}
      />
    </div>
  )
}