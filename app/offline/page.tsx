"use client"

import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-gray-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You're Offline
        </h1>
        
        <p className="text-gray-600 mb-6">
          ProPaint Quote needs an internet connection to create quotes. 
          Please check your connection and try again.
        </p>
        
        <Button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-primary-500 to-accent-500 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Once you're back online, all your work will be saved automatically.
          </p>
        </div>
      </div>
    </div>
  )
}