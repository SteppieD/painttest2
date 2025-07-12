import { Metadata } from 'next'

const BASE_URL = 'https://www.paintquoteapp.com'

interface PageMetadataOptions {
  title: string
  description: string
  keywords?: string
  path: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  path,
  noIndex = false
}: PageMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`
  
  return {
    title: `${title} | ProPaint Quote`,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'ProPaint Quote',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  }
}

// Helper for dynamic routes
export function generateDynamicMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return generatePageMetadata({
    title,
    description,
    path,
    noIndex: true, // Dynamic pages usually shouldn't be indexed
  })
}