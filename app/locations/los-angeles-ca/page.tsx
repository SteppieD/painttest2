import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in Los Angeles, CA | Professional Quote Software',
  description: 'Los Angeles painting contractors trust ProPaint Quote for fast, accurate estimates. Join 450+ LA painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors Los Angeles, LA painters, Los Angeles painting quotes, painting estimate software LA, California painting contractors',
  alternates: {
    canonical: '/locations/los-angeles-ca',
  },
  openGraph: {
    title: 'Los Angeles Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 450+ contractors in Los Angeles.',
    url: '/locations/los-angeles-ca',
    siteName: 'ProPaint Quote',
    type: 'website',
    images: [{
      url: '/images/los-angeles-painting-contractors.jpg',
      width: 1200,
      height: 630,
      alt: 'Los Angeles Painting Contractors',
    }],
  },
}

const laTestimonials = [
  {
    name: "Carlos Rodriguez",
    company: "Rodriguez Painting Co.",
    text: "ProPaint Quote transformed our business in LA. We're closing 60% more jobs with same-day quotes. The software paid for itself in the first month!",
    rating: 5,
    projects: "500+ homes",
    location: "West Los Angeles"
  },
  {
    name: "Jennifer Park",
    company: "Premium Painters LA",
    text: "As a woman-owned business in competitive LA market, professional quotes help us stand out. We've doubled our revenue in 6 months.",
    rating: 5,
    projects: "300+ projects",
    location: "Beverly Hills"
  },
  {
    name: "Mike Thompson",
    company: "Thompson & Sons Painting",
    text: "Been painting in LA for 20 years. This software is a game changer. No more late nights doing estimates - I quote on-site now.",
    rating: 5,
    projects: "1000+ homes",
    location: "San Fernando Valley"
  }
]

export default function LosAngelesPage() {
  return (
    <>
      
      <CityPageTemplate
        city="Los Angeles"
        state="California"
        stateAbbr="CA"
        population="3.9 million"
        avgHomePrice="$950,000"
        avgProjectSize="$4,500-$12,000"
        localTestimonials={laTestimonials}
      />
      
      <Footer />
    </>
  )
}