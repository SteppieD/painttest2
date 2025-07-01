import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in Dallas, TX | Professional Quote Software',
  description: 'Dallas painting contractors trust ProPaint Quote for fast, accurate estimates. Join 420+ Dallas painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors Dallas, Dallas painters, Dallas painting quotes, painting estimate software Dallas, Texas painting contractors, Fort Worth painters',
  alternates: {
    canonical: '/locations/dallas-tx',
  },
  openGraph: {
    title: 'Dallas Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 420+ contractors in Dallas-Fort Worth.',
    url: '/locations/dallas-tx',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const dallasTestimonials = [
  {
    name: "John Mitchell",
    company: "Big D Painting Co.",
    text: "Dallas market is huge and competitive. ProPaint Quote gives me the speed I need. I'm booking jobs while competitors are still writing estimates!",
    rating: 5,
    projects: "800+ homes",
    location: "Highland Park"
  },
  {
    name: "Amanda Thompson",
    company: "Metroplex Premier Painting",
    text: "From Uptown high-rises to Plano suburbs, we paint it all. This software scales with our growth. Doubled our revenue in 8 months!",
    rating: 5,
    projects: "650+ projects",
    location: "Uptown Dallas"
  },
  {
    name: "Carlos Mendez",
    company: "DFW Professional Painters",
    text: "Texas-sized homes need Texas-sized efficiency. ProPaint Quote handles our complex projects perfectly. My crews stay busy year-round now.",
    rating: 5,
    projects: "900+ homes",
    location: "Frisco"
  }
]

export default function DallasPage() {
  return (
    <>
      <Header />
      
      <CityPageTemplate
        city="Dallas"
        state="Texas"
        stateAbbr="TX"
        population="1.3 million"
        avgHomePrice="$380,000"
        avgProjectSize="$3,500-$9,500"
        localTestimonials={dallasTestimonials}
      />
      
      <Footer />
    </>
  )
}