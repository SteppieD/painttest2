import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ConditionalNavbar } from '@/components/layout/conditional-navbar'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProPaint Quote - Professional Painting Quote Software for Contractors',
  description: 'Save 3 hours per quote. Win 40% more jobs. Professional painting quote software with 30-second quotes. Free 14-day trial. No credit card required.',
  keywords: 'painting quote software, painting estimate software, contractor quoting app, painting business tools, professional painting quotes, painting calculator, painting estimator, contractor software',
  manifest: '/manifest.json',
  metadataBase: new URL('https://www.paintquoteapp.com'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/paint-logo-transparent.png', color: '#FF6B35' },
      { rel: 'icon', url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  applicationName: 'ProPaint Quote',
  authors: [{ name: 'ProPaint Quote Team' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  verification: {
    google: 'your-google-site-verification-code',
  },
  openGraph: {
    title: 'ProPaint Quote - Win More Painting Jobs with Professional Software',
    description: 'Save 3 hours per quote. Win 40% more jobs. Professional painting software with 30-second quotes. Free trial - no credit card.',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B35' },
    { media: '(prefers-color-scheme: dark)', color: '#FF6B35' }
  ],
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
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-563BQKRH"
            
            
           
          />
        </noscript>
        
        {/* Schema Markup for SaaS Application */}
        <SchemaMarkup type="SoftwareApplication" data={{}} />
        
        <ConditionalNavbar />
        {children}
        <Toaster />
        
        {/* Remove green backgrounds from links */}
        <Script src="/js/remove-green-backgrounds.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}