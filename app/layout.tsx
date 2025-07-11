import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { PWAProvider } from '@/components/pwa-provider'

export const metadata: Metadata = {
  title: {
    default: 'ProPaint Solutions - Professional Painting Services & Instant Quotes',
    template: '%s | ProPaint Solutions'
  },
  description: 'Get instant, accurate painting quotes powered by AI. Professional painting services for residential and commercial properties with transparent pricing and expert craftsmanship.',
  keywords: ['painting services', 'painting quotes', 'house painting', 'commercial painting', 'painting contractor', 'paint estimate calculator'],
  authors: [{ name: 'ProPaint Solutions' }],
  creator: 'ProPaint Solutions',
  publisher: 'ProPaint Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://propaintsolutions.com'),
  openGraph: {
    title: 'ProPaint Solutions - Professional Painting Services',
    description: 'Get instant painting quotes and professional services',
    url: 'https://propaintsolutions.com',
    siteName: 'ProPaint Solutions',
    images: [
      {
        url: '/images/paint-logo-transparent.png',
        width: 1200,
        height: 630,
        alt: 'ProPaint Solutions Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProPaint Solutions - Professional Painting Services',
    description: 'Get instant painting quotes and professional services',
    images: ['/images/paint-logo-transparent.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <PWAProvider />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}