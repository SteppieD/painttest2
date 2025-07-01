import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { CityPageTemplate } from '@/components/locations/city-page-template'

// This could be moved to a database or CMS in the future
const cityData: Record<string, {
  city: string
  state: string
  stateAbbr: string
  population: string
  avgHomePrice: string
  avgProjectSize: string
  testimonials?: Array<{
    name: string
    company: string
    text: string
    rating: number
    projects: string
    location: string
  }>
}> = {
  // Additional cities beyond the top 10
  'boston-ma': {
    city: 'Boston',
    state: 'Massachusetts',
    stateAbbr: 'MA',
    population: '690,000',
    avgHomePrice: '$720,000',
    avgProjectSize: '$3,500-$9,000',
  },
  'seattle-wa': {
    city: 'Seattle',
    state: 'Washington',
    stateAbbr: 'WA',
    population: '750,000',
    avgHomePrice: '$850,000',
    avgProjectSize: '$4,000-$10,000',
  },
  'miami-fl': {
    city: 'Miami',
    state: 'Florida',
    stateAbbr: 'FL',
    population: '450,000',
    avgHomePrice: '$580,000',
    avgProjectSize: '$3,000-$8,000',
  },
  'atlanta-ga': {
    city: 'Atlanta',
    state: 'Georgia',
    stateAbbr: 'GA',
    population: '500,000',
    avgHomePrice: '$410,000',
    avgProjectSize: '$3,000-$7,500',
  },
  'denver-co': {
    city: 'Denver',
    state: 'Colorado',
    stateAbbr: 'CO',
    population: '720,000',
    avgHomePrice: '$620,000',
    avgProjectSize: '$3,500-$8,500',
  },
}

export async function generateStaticParams() {
  return Object.keys(cityData).map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const data = cityData[params.slug]
  
  if (!data) {
    return {
      title: 'City Not Found',
    }
  }

  return {
    title: `Painting Contractors in ${data.city}, ${data.stateAbbr} | Professional Quote Software`,
    description: `${data.city} painting contractors trust ProPaint Quote for fast, accurate estimates. Join local painters winning more jobs with professional quotes in 6 minutes.`,
    keywords: `painting contractors ${data.city}, ${data.city} painters, ${data.city} painting quotes, painting estimate software ${data.city}, ${data.state} painting contractors`,
    alternates: {
      canonical: `/locations/${params.slug}`,
    },
    openGraph: {
      title: `${data.city} Painting Contractors - Professional Quote Software`,
      description: `Generate accurate painting quotes in 6 minutes. Trusted by contractors in ${data.city}.`,
      url: `/locations/${params.slug}`,
      siteName: 'ProPaint Quote',
      type: 'website',
    },
  }
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const data = cityData[params.slug]

  if (!data) {
    notFound()
  }

  return (
    <>
      <Header />
      
      <CityPageTemplate
        city={data.city}
        state={data.state}
        stateAbbr={data.stateAbbr}
        population={data.population}
        avgHomePrice={data.avgHomePrice}
        avgProjectSize={data.avgProjectSize}
        localTestimonials={data.testimonials}
      />
      
      <Footer />
    </>
  )
}