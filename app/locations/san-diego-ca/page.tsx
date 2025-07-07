import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in San Diego, CA | Professional Quote Software',
  description: 'San Diego painting contractors trust ProPaint Quote for fast, accurate estimates. Join 220+ San Diego painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors San Diego, San Diego painters, San Diego painting quotes, painting estimate software San Diego, California painting contractors',
  alternates: {
    canonical: '/locations/san-diego-ca',
  },
  openGraph: {
    title: 'San Diego Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 220+ contractors in San Diego.',
    url: '/locations/san-diego-ca',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const sanDiegoTestimonials = [
  {
    name: "Mark Johnson",
    company: "Coastal Painting Pros",
    text: "Perfect weather means year-round painting in SD. ProPaint Quote keeps me organized with 30+ active quotes. Beach house to downtown condos!",
    rating: 5,
    projects: "550+ homes",
    location: "La Jolla"
  },
  {
    name: "Elena Rodriguez",
    company: "Pacific Coast Painters",
    text: "San Diego's upscale market demands professionalism. My branded quotes from ProPaint help me win Coronado and Del Mar projects consistently.",
    rating: 5,
    projects: "400+ projects",
    location: "Coronado"
  },
  {
    name: "Brian Lee",
    company: "Sunshine Painting Services",
    text: "Military housing to luxury homes - San Diego has it all. This software adapts to every job type. Best decision for my business growth!",
    rating: 5,
    projects: "700+ homes",
    location: "North County"
  }
]

export default function SanDiegoPage() {
  return (
    <>
      
      <CityPageTemplate
        city="San Diego"
        state="California"
        stateAbbr="CA"
        population="1.4 million"
        avgHomePrice="$850,000"
        avgProjectSize="$4,000-$10,000"
        localTestimonials={sanDiegoTestimonials}
      />
      
      <Footer />
    </>
  )
}