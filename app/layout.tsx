import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProPaint Quote - Professional Painting Quote Software for Contractors',
  description: 'Win 40-60% more painting jobs with professional quotes in 6 minutes vs 6 hours. Trusted by 5,000+ contractors. Start free with 10 quotes included.',
  keywords: 'painting quote software, painting estimate software, contractor quoting app, painting business tools, professional painting quotes, painting calculator',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  openGraph: {
    title: 'ProPaint Quote - Win More Painting Jobs with Professional Software',
    description: 'Stop losing jobs to timing. Create professional painting quotes in 6 minutes, not 6 hours. 40-60% higher win rates guaranteed.',
    url: 'https://propaintquote.com',
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
        <link rel="manifest" href="/manifest.json" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-563BQKRH');`,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-563BQKRH"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
        <Toaster />
      </body>
    </html>
  )
}