import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in Houston, TX | Professional Quote Software',
  description: 'Houston painting contractors trust ProPaint Quote for fast, accurate estimates. Join 460+ Houston painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors Houston, Houston painters, Houston painting quotes, painting estimate software Houston, Texas painting contractors',
  alternates: {
    canonical: '/locations/houston-tx',
  },
  openGraph: {
    title: 'Houston Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 460+ contractors in Houston.',
    url: '/locations/houston-tx',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const houstonTestimonials = [
  {
    name: "James Williams",
    company: "Texas Star Painting",
    text: "Houston's booming market means lots of competition. ProPaint Quote gives me the edge - I'm usually first to respond with professional quotes.",
    rating: 5,
    projects: "900+ homes",
    location: "West Houston"
  },
  {
    name: "Maria Gonzalez",
    company: "Gonzalez Premier Painting",
    text: "From River Oaks mansions to suburban homes, this software handles it all. My crew stays busy painting while I quote new jobs on my phone.",
    rating: 5,
    projects: "600+ projects",
    location: "River Oaks"
  },
  {
    name: "Ahmed Hassan",
    company: "Houston Pro Painters",
    text: "The heat in Houston means working smart, not hard. ProPaint Quote cut my office time by 80%. More time painting, less time at the desk!",
    rating: 5,
    projects: "500+ homes",
    location: "Sugar Land"
  }
]

export default function HoustonPage() {
  return (
    <>
      
      <CityPageTemplate
        city="Houston"
        state="Texas"
        stateAbbr="TX"
        population="2.3 million"
        avgHomePrice="$340,000"
        avgProjectSize="$3,500-$9,000"
        localTestimonials={houstonTestimonials}
      />
      
      <Footer />
    </>
  )
}