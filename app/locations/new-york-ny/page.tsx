import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in New York, NY | Professional Quote Software',
  description: 'New York painting contractors trust ProPaint Quote for fast, accurate estimates. Join 680+ NYC painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors New York, NYC painters, New York painting quotes, painting estimate software NYC, Manhattan painting contractors, Brooklyn painters',
  alternates: {
    canonical: '/locations/new-york-ny',
  },
  openGraph: {
    title: 'New York City Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 680+ contractors in New York City.',
    url: '/locations/new-york-ny',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const nycTestimonials = [
  {
    name: "Anthony Russo",
    company: "Empire State Painting",
    text: "In NYC's fast-paced market, speed matters. ProPaint Quote lets me send quotes before leaving the building. My close rate went from 25% to 65%!",
    rating: 5,
    projects: "800+ apartments",
    location: "Manhattan"
  },
  {
    name: "David Cohen",
    company: "Brooklyn's Best Painters",
    text: "Managing quotes for brownstones and high-rises was a nightmare. Now I handle 3x more estimates with less effort. Essential for NYC contractors.",
    rating: 5,
    projects: "600+ projects",
    location: "Brooklyn"
  },
  {
    name: "Maria Santos",
    company: "Santos Professional Painting",
    text: "The software handles NYC's complex pricing perfectly. Different rates for Manhattan vs Queens? No problem. It's like having an expert estimator 24/7.",
    rating: 5,
    projects: "400+ homes",
    location: "Queens"
  }
]

export default function NewYorkPage() {
  return (
    <>
      
      <CityPageTemplate
        city="New York"
        state="New York"
        stateAbbr="NY"
        population="8.3 million"
        avgHomePrice="$750,000"
        avgProjectSize="$3,000-$15,000"
        localTestimonials={nycTestimonials}
      />
      
      <Footer />
    </>
  )
}