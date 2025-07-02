import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://paintquoteapp.com'
  
  // Main pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/features',
    '/demo',
    '/trial-signup',
    '/help',
    '/tutorials',
    '/api-docs',
    '/testimonials',
    '/careers',
    '/privacy',
    '/terms',
    '/security',
  ]

  // Pillar pages
  const pillarPages = [
    '/professional-painting-software',
    '/how-to-scale-painting-business',
    '/painting-business-profit-guide',
    '/digital-transformation-painting-contractors',
  ]

  // Tool pages
  const toolPages = [
    '/painting-estimate-calculator',
    '/painting-quote-templates',
    '/how-to-quote-painting-jobs-professionally',
    '/painting-business-tips',
    '/painting-estimate-software',
    '/painting-contractor-software-case-study',
  ]

  // Combine all pages
  const allPages = [...staticPages, ...pillarPages, ...toolPages]

  return allPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 
                    pillarPages.includes(page) ? 'weekly' :
                    toolPages.includes(page) ? 'monthly' : 'yearly',
    priority: page === '' ? 1 :
              pillarPages.includes(page) ? 0.8 :
              toolPages.includes(page) ? 0.6 : 0.5,
  }))
}