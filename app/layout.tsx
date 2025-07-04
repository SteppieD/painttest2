import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider'
import { ACNavbar } from '@/components/adcreative/ACNavbar'
import { StructuredData } from '@/components/seo/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProPaint Quote - Professional Painting Quote Software for Contractors',
  description: 'Win 40-60% more painting jobs with professional quotes in 30 seconds. Trusted by 5,247+ painting contractors. Start free trial today.',
  keywords: 'painting quote software, painting estimate software, contractor quoting app, painting business tools, professional painting quotes, painting calculator, painting estimator, contractor software',
  manifest: '/manifest.json',
  metadataBase: new URL('https://www.paintquoteapp.com'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#FF6B35' }
    ]
  },
  applicationName: 'ProPaint Quote',
  authors: [{ name: 'ProPaint Quote Team' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B35' },
    { media: '(prefers-color-scheme: dark)', color: '#FF6B35' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-site-verification-code',
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ProPaint Quote" />
        <meta name="msapplication-TileColor" content="#FF6B35" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="canonical" href="https://www.paintquoteapp.com" />
        <StructuredData />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider gtmId="GTM-563BQKRH" ga4Id="G-984BZ3LDZE">
          <ACNavbar />
          <main style={{ paddingTop: '60px' }}>
            {children}
          </main>
          <Toaster />
        </AnalyticsProvider>
      </body>
    </html>
  )
}