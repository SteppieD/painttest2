"use client"

import { useEffect } from 'react'
import Script from 'next/script'

export function PWAProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('ServiceWorker registration successful:', registration.scope)
          },
          err => {
            console.log('ServiceWorker registration failed:', err)
          }
        )
      })
    }
  }, [])

  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#3B82F6" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ProPaint Quote" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
    </>
  )
}