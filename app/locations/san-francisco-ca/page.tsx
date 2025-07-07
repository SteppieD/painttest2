import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in San Francisco, CA | Professional Quote Software',
  description: 'San Francisco painting contractors trust ProPaint Quote for fast, accurate estimates. Join 280+ SF Bay Area painters winning more jobs with professional quotes.',
  keywords: 'painting contractors San Francisco, SF painters, San Francisco painting quotes, painting estimate software SF, Bay Area painting contractors',
  alternates: {
    canonical: '/locations/san-francisco-ca',
  },
  openGraph: {
    title: 'San Francisco Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 280+ contractors in San Francisco Bay Area.',
    url: '/locations/san-francisco-ca',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const sfTestimonials = [
  {
    name: "William Chen",
    company: "Golden Gate Painting",
    text: "SF's Victorian homes require detailed estimates. ProPaint Quote handles complex trim work perfectly. My Marina District clients love the professionalism!",
    rating: 5,
    projects: "500+ homes",
    location: "Marina District"
  },
  {
    name: "Sophie Laurent",
    company: "Bay Area Elite Painting",
    text: "Tech executives expect digital solutions. ProPaint Quote positions us perfectly in SF market. Closing rates up 70% with instant quotes!",
    rating: 5,
    projects: "400+ projects",
    location: "Pacific Heights"
  },
  {
    name: "Miguel Torres",
    company: "Torres Painting Professionals",
    text: "From Nob Hill mansions to Mission apartments, we paint it all. This software adapts to SF's diverse market. Game changer for our business!",
    rating: 5,
    projects: "600+ homes",
    location: "Mission District"
  }
]

export default function SanFranciscoPage() {
  return (
    <>
      
      <CityPageTemplate
        city="San Francisco"
        state="California"
        stateAbbr="CA"
        population="875,000"
        avgHomePrice="$1.4 million"
        avgProjectSize="$5,000-$15,000"
        localTestimonials={sfTestimonials}
      />
      
      <Footer />
    </>
  )
}