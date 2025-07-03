import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProPaint Quote - Professional Painting Quote Software for Contractors',
  description: 'Win 40-60% more painting jobs with professional quotes in 6 minutes vs 6 hours. Trusted by 5,000+ contractors. Start free with 10 quotes included.',
  keywords: 'painting quote software, painting estimate software, contractor quoting app, painting business tools, professional painting quotes, painting calculator',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-192x192.svg',
  },
  openGraph: {
    title: 'ProPaint Quote - Win More Painting Jobs with Professional Software',
    description: 'Stop losing jobs to timing. Create professional painting quotes in 6 minutes, not 6 hours. 40-60% higher win rates guaranteed.',
    url: 'https://www.paintquoteapp.com',
    siteName: 'ProPaint Quote',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProPaint Quote - Professional Painting Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProPaint Quote - Win More Painting Jobs',
    description: 'Professional painting quote software. 6 minutes vs 6 hours. 40-60% higher win rates.',
    images: ['/og-image.png'],
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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ProPaint Quote" />
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://www.paintquoteapp.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider gtmId="GTM-563BQKRH" ga4Id="G-984BZ3LDZE">
          {children}
          <Toaster />
        </AnalyticsProvider>
      </body>
    </html>
  )
}