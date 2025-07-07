import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in Chicago, IL | Professional Quote Software',
  description: 'Chicago painting contractors trust ProPaint Quote for fast, accurate estimates. Join 420+ Chicago painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors Chicago, Chicago painters, Chicago painting quotes, painting estimate software Chicago, Illinois painting contractors',
  alternates: {
    canonical: '/locations/chicago-il',
  },
  openGraph: {
    title: 'Chicago Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 420+ contractors in Chicago.',
    url: '/locations/chicago-il',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const chicagoTestimonials = [
  {
    name: "Patrick O'Brien",
    company: "Windy City Painters",
    text: "Chicago's weather means tight painting seasons. ProPaint Quote helps me quote faster and book more jobs during our busy months. Revenue up 45%!",
    rating: 5,
    projects: "700+ homes",
    location: "North Side Chicago"
  },
  {
    name: "Robert Kowalski",
    company: "Kowalski & Sons Painting",
    text: "Three generations of painters in Chicago. This software brought us into the modern age. My son quotes jobs on his phone - amazing!",
    rating: 5,
    projects: "1200+ projects",
    location: "South Side Chicago"
  },
  {
    name: "Lisa Johnson",
    company: "LJ Professional Painting",
    text: "Competing in Chicago requires professionalism. ProPaint Quote's branded estimates help us win high-end Lincoln Park and Gold Coast projects.",
    rating: 5,
    projects: "350+ homes",
    location: "Lincoln Park"
  }
]

export default function ChicagoPage() {
  return (
    <>
      
      <CityPageTemplate
        city="Chicago"
        state="Illinois"
        stateAbbr="IL"
        population="2.7 million"
        avgHomePrice="$320,000"
        avgProjectSize="$3,000-$8,000"
        localTestimonials={chicagoTestimonials}
      />
      
      <Footer />
    </>
  )
}