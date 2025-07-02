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
  // All supported cities
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
  'portland-or': {
    city: 'Portland',
    state: 'Oregon',
    stateAbbr: 'OR',
    population: '650,000',
    avgHomePrice: '$590,000',
    avgProjectSize: '$3,200-$8,000',
  },
  'las-vegas-nv': {
    city: 'Las Vegas',
    state: 'Nevada',
    stateAbbr: 'NV',
    population: '650,000',
    avgHomePrice: '$420,000',
    avgProjectSize: '$2,800-$7,000',
  },
  'washington-dc': {
    city: 'Washington',
    state: 'District of Columbia',
    stateAbbr: 'DC',
    population: '700,000',
    avgHomePrice: '$680,000',
    avgProjectSize: '$3,800-$9,500',
  },
  'charlotte-nc': {
    city: 'Charlotte',
    state: 'North Carolina',
    stateAbbr: 'NC',
    population: '875,000',
    avgHomePrice: '$380,000',
    avgProjectSize: '$2,900-$7,200',
  },
  'detroit-mi': {
    city: 'Detroit',
    state: 'Michigan',
    stateAbbr: 'MI',
    population: '670,000',
    avgHomePrice: '$280,000',
    avgProjectSize: '$2,500-$6,500',
  },
  'minneapolis-mn': {
    city: 'Minneapolis',
    state: 'Minnesota',
    stateAbbr: 'MN',
    population: '430,000',
    avgHomePrice: '$450,000',
    avgProjectSize: '$3,000-$7,500',
  },
  'st-louis-mo': {
    city: 'St. Louis',
    state: 'Missouri',
    stateAbbr: 'MO',
    population: '300,000',
    avgHomePrice: '$320,000',
    avgProjectSize: '$2,600-$6,800',
  },
  'kansas-city-mo': {
    city: 'Kansas City',
    state: 'Missouri',
    stateAbbr: 'MO',
    population: '490,000',
    avgHomePrice: '$310,000',
    avgProjectSize: '$2,700-$6,900',
  },
  'indianapolis-in': {
    city: 'Indianapolis',
    state: 'Indiana',
    stateAbbr: 'IN',
    population: '880,000',
    avgHomePrice: '$290,000',
    avgProjectSize: '$2,600-$6,700',
  },
  'columbus-oh': {
    city: 'Columbus',
    state: 'Ohio',
    stateAbbr: 'OH',
    population: '900,000',
    avgHomePrice: '$340,000',
    avgProjectSize: '$2,800-$7,000',
  },
  'milwaukee-wi': {
    city: 'Milwaukee',
    state: 'Wisconsin',
    stateAbbr: 'WI',
    population: '590,000',
    avgHomePrice: '$320,000',
    avgProjectSize: '$2,700-$6,800',
  },
  'austin-tx': {
    city: 'Austin',
    state: 'Texas',
    stateAbbr: 'TX',
    population: '980,000',
    avgHomePrice: '$550,000',
    avgProjectSize: '$3,200-$8,200',
  },
  'nashville-tn': {
    city: 'Nashville',
    state: 'Tennessee',
    stateAbbr: 'TN',
    population: '690,000',
    avgHomePrice: '$420,000',
    avgProjectSize: '$2,900-$7,400',
  },
  'new-orleans-la': {
    city: 'New Orleans',
    state: 'Louisiana',
    stateAbbr: 'LA',
    population: '390,000',
    avgHomePrice: '$380,000',
    avgProjectSize: '$2,800-$7,200',
  },
  'orlando-fl': {
    city: 'Orlando',
    state: 'Florida',
    stateAbbr: 'FL',
    population: '310,000',
    avgHomePrice: '$420,000',
    avgProjectSize: '$3,000-$7,800',
  },
  'tampa-fl': {
    city: 'Tampa',
    state: 'Florida',
    stateAbbr: 'FL',
    population: '390,000',
    avgHomePrice: '$450,000',
    avgProjectSize: '$3,100-$8,000',
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