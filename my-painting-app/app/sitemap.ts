import { MetadataRoute } from 'next'
import { PAINTING_SERVICES, SERVICE_AREAS } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propaintsolutions.com'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/calculator',
    '/get-quote',
    '/blog',
    '/contact',
    '/testimonials',
    '/careers',
    '/privacy',
    '/terms'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8
  }))

  // Service pages
  const servicePages = PAINTING_SERVICES.map(service => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }))

  // Location pages
  const locationPages = SERVICE_AREAS.map(area => ({
    url: `${baseUrl}/locations/${area.city.toLowerCase().replace(' ', '-')}-${area.state.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))

  // SEO landing pages
  const seoPages = [
    '/painting-estimate-calculator-free',
    '/house-painting-cost-calculator',
    '/commercial-painting-estimating-software',
    '/painting-quote-templates-free',
    '/how-to-quote-painting-jobs-professionally'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9
  }))

  return [
    ...staticPages,
    ...servicePages,
    ...locationPages,
    ...seoPages
  ]
}