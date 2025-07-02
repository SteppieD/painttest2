import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in Phoenix, AZ | Professional Quote Software',
  description: 'Phoenix painting contractors trust ProPaint Quote for fast, accurate estimates. Join 290+ Phoenix painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors Phoenix, Phoenix painters, Phoenix painting quotes, painting estimate software Phoenix, Arizona painting contractors',
  alternates: {
    canonical: '/locations/phoenix-az',
  },
  openGraph: {
    title: 'Phoenix Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 290+ contractors in Phoenix.',
    url: '/locations/phoenix-az',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const phoenixTestimonials = [
  {
    name: "Steve Martinez",
    company: "Desert Sun Painting",
    text: "Phoenix heat means early starts. I quote jobs the night before on my tablet. By sunrise, customers have professional estimates in their inbox!",
    rating: 5,
    projects: "800+ homes",
    location: "Scottsdale"
  },
  {
    name: "Linda Chen",
    company: "Valley Professional Painters",
    text: "Stucco, interior, exterior - Phoenix homes need it all. ProPaint Quote handles our complex pricing perfectly. Best investment for our business.",
    rating: 5,
    projects: "550+ projects",
    location: "Tempe"
  },
  {
    name: "Tom Anderson",
    company: "Anderson Painting Services",
    text: "Growing Phoenix market demands efficiency. We went from 20 to 50 quotes per week without adding staff. The software is that good!",
    rating: 5,
    projects: "600+ homes",
    location: "Chandler"
  }
]

export default function PhoenixPage() {
  return (
    <>
      <Header />
      
      <CityPageTemplate
        city="Phoenix"
        state="Arizona"
        stateAbbr="AZ"
        population="1.7 million"
        avgHomePrice="$435,000"
        avgProjectSize="$3,000-$8,500"
        localTestimonials={phoenixTestimonials}
      />
      
      <Footer />
    </>
  )
}