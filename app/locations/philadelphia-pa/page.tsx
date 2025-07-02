import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in Philadelphia, PA | Professional Quote Software',
  description: 'Philadelphia painting contractors trust ProPaint Quote for fast, accurate estimates. Join 280+ Philly painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors Philadelphia, Philadelphia painters, Philadelphia painting quotes, painting estimate software Philadelphia, Pennsylvania painting contractors',
  alternates: {
    canonical: '/locations/philadelphia-pa',
  },
  openGraph: {
    title: 'Philadelphia Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 280+ contractors in Philadelphia.',
    url: '/locations/philadelphia-pa',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const phillyTestimonials = [
  {
    name: "Frank DiMaggio",
    company: "Liberty Bell Painting",
    text: "From row homes to Main Line estates, ProPaint Quote handles Philly's diverse market perfectly. My business grew 50% in one year!",
    rating: 5,
    projects: "700+ homes",
    location: "Center City"
  },
  {
    name: "Sarah Walsh",
    company: "Walsh & Associates Painting",
    text: "Historic homes need detailed quotes. This software lets me itemize everything professionally. Winning more Society Hill projects than ever.",
    rating: 5,
    projects: "400+ projects",
    location: "Society Hill"
  },
  {
    name: "Kevin Murphy",
    company: "Murphy's Pro Painters",
    text: "Been painting in Philly for 15 years. ProPaint Quote modernized our whole operation. Now my kids want to join the business!",
    rating: 5,
    projects: "900+ homes",
    location: "Northeast Philadelphia"
  }
]

export default function PhiladelphiaPage() {
  return (
    <>
      <Header />
      
      <CityPageTemplate
        city="Philadelphia"
        state="Pennsylvania"
        stateAbbr="PA"
        population="1.6 million"
        avgHomePrice="$250,000"
        avgProjectSize="$2,500-$7,000"
        localTestimonials={phillyTestimonials}
      />
      
      <Footer />
    </>
  )
}