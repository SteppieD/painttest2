import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

export const metadata: Metadata = {
  title: 'Painting Contractors in San Antonio, TX | Professional Quote Software',
  description: 'San Antonio painting contractors trust ProPaint Quote for fast, accurate estimates. Join 240+ San Antonio painters winning more jobs with professional quotes in 6 minutes.',
  keywords: 'painting contractors San Antonio, San Antonio painters, San Antonio painting quotes, painting estimate software San Antonio, Texas painting contractors',
  alternates: {
    canonical: '/locations/san-antonio-tx',
  },
  openGraph: {
    title: 'San Antonio Painting Contractors - Professional Quote Software',
    description: 'Generate accurate painting quotes in 6 minutes. Trusted by 240+ contractors in San Antonio.',
    url: '/locations/san-antonio-tx',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

const sanAntonioTestimonials = [
  {
    name: "Roberto Hernandez",
    company: "Alamo City Painters",
    text: "San Antonio's growing fast and so is my business! ProPaint Quote helps me keep up with demand. Quoting is 10x faster now.",
    rating: 5,
    projects: "600+ homes",
    location: "Stone Oak"
  },
  {
    name: "Jessica Miller",
    company: "Hill Country Painting Co.",
    text: "From downtown lofts to Hill Country homes, this software adapts to every job. My team focuses on painting while I handle quotes efficiently.",
    rating: 5,
    projects: "450+ projects",
    location: "Alamo Heights"
  },
  {
    name: "David Ramirez",
    company: "Ramirez Professional Painting",
    text: "Military families move often in SA. Fast, professional quotes help me book jobs quickly. This software is perfect for our market.",
    rating: 5,
    projects: "500+ homes",
    location: "Medical Center"
  }
]

export default function SanAntonioPage() {
  return (
    <>
      <Header />
      
      <CityPageTemplate
        city="San Antonio"
        state="Texas"
        stateAbbr="TX"
        population="1.5 million"
        avgHomePrice="$285,000"
        avgProjectSize="$3,000-$7,500"
        localTestimonials={sanAntonioTestimonials}
      />
      
      <Footer />
    </>
  )
}