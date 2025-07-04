/**
 * Professional Image Configuration
 * Maps professional photos to different use cases across the website
 * All images are optimized WebP format with appropriate sizes
 */

export const professionalImages = {
  // Hero/Homepage Images (1920px wide, high quality)
  hero: {
    main: '/images/professional/hero-main.webp',
    secondary: '/images/professional/hero-secondary.webp',
    tertiary: '/images/professional/hero-tertiary.webp'
  },

  // Feature Section Images (800px wide, optimized for cards)
  features: {
    quoteCreation: '/images/professional/feature-quote-creation.webp',
    customerMeeting: '/images/professional/feature-customer-meeting.webp',
    projectPlanning: '/images/professional/feature-project-planning.webp',
    teamWork: '/images/professional/feature-team-work.webp'
  },

  // Service Pages (1200px wide, high quality)
  services: {
    residential: '/images/professional/service-residential.webp',
    commercial: '/images/professional/service-commercial.webp',
    interior: '/images/professional/service-interior.webp',
    exterior: '/images/professional/service-exterior.webp'
  },

  // About/Team (600px wide, optimized for bio cards)
  team: {
    contractor: '/images/professional/team-contractor.webp',
    painter1: '/images/professional/team-painter1.webp',
    painter2: '/images/professional/team-painter2.webp',
    consultation: '/images/professional/team-consultation.webp'
  },

  // Case Studies / Success Stories (1200px wide, high quality)
  caseStudies: {
    planning: '/images/professional/case-study-planning.webp',
    execution: '/images/professional/case-study-execution.webp',
    completion: '/images/professional/case-study-completion.webp',
    satisfaction: '/images/professional/case-study-satisfaction.webp'
  },

  // Blog Post Images (1000px wide, balanced quality)
  blog: {
    colorSelection: '/images/professional/blog-color-selection.webp',
    diyVsPro: '/images/professional/blog-diy-vs-pro.webp',
    preparation: '/images/professional/blog-preparation.webp',
    techniques: '/images/professional/blog-techniques.webp',
    trends: '/images/professional/blog-trends.webp'
  },

  // SEO Landing Pages (1200px wide, high quality)
  seoPages: {
    calculator: '/images/professional/seo-calculator.webp',
    templates: '/images/professional/seo-templates.webp',
    guide: '/images/professional/seo-guide.webp',
    software: '/images/professional/seo-software.webp'
  }
};

// Image metadata for SEO
export const imageMetadata = {
  // Hero Images
  '/images/professional/hero-main.webp': {
    alt: 'Professional painter applying light blue paint to wall',
    title: 'Expert Interior Painting Services',
    width: 1920,
    height: 1280
  },
  '/images/professional/hero-secondary.webp': {
    alt: 'Couple selecting paint colors with professional guidance',
    title: 'Professional Paint Color Consultation',
    width: 1920,
    height: 1280
  },
  '/images/professional/hero-tertiary.webp': {
    alt: 'Contractor shaking hands with satisfied customer outdoors',
    title: 'Professional Painting Service Agreement',
    width: 1920,
    height: 1082
  },

  // Feature Images
  '/images/professional/feature-quote-creation.webp': {
    alt: 'Professional contractor using painting quote software on computer',
    title: 'Digital Quote Creation for Painting Contractors',
    width: 800,
    height: 534
  },
  '/images/professional/feature-customer-meeting.webp': {
    alt: 'Contractor reviewing paperwork with client',
    title: 'Professional Customer Consultation',
    width: 800,
    height: 534
  },
  '/images/professional/feature-project-planning.webp': {
    alt: 'Contractor and owner reviewing blueprints',
    title: 'Professional Project Planning',
    width: 800,
    height: 534
  },
  '/images/professional/feature-team-work.webp': {
    alt: 'Construction team reviewing blueprints together',
    title: 'Collaborative Project Management',
    width: 800,
    height: 534
  },

  // Service Images
  '/images/professional/service-residential.webp': {
    alt: 'Professional painting residential room with ladder',
    title: 'Residential Painting Services',
    width: 1200,
    height: 800
  },
  '/images/professional/service-commercial.webp': {
    alt: 'Commercial painter working on high-rise building exterior',
    title: 'Professional Commercial Painting Services',
    width: 1200,
    height: 690
  },
  '/images/professional/service-interior.webp': {
    alt: 'Happy professional painter working on interior walls',
    title: 'Quality Interior Painting Services',
    width: 1200,
    height: 801
  },
  '/images/professional/service-exterior.webp': {
    alt: 'Professional exterior home painting in progress',
    title: 'Expert Exterior Painting Services',
    width: 1200,
    height: 800
  },

  // Team Images
  '/images/professional/team-contractor.webp': {
    alt: 'Contractor reviewing project blueprints on-site',
    title: 'Professional Project Planning and Estimation',
    width: 600,
    height: 400
  },
  '/images/professional/team-painter1.webp': {
    alt: 'Professional painter working on ladder',
    title: 'Skilled Painting Professional',
    width: 600,
    height: 373
  },
  '/images/professional/team-painter2.webp': {
    alt: 'Professional painter applying orange paint',
    title: 'Expert Paint Application',
    width: 600,
    height: 400
  },
  '/images/professional/team-consultation.webp': {
    alt: 'Construction company consulting with client',
    title: 'Professional Client Consultation',
    width: 600,
    height: 400
  },

  // Case Study Images
  '/images/professional/case-study-planning.webp': {
    alt: 'Team planning painting project with color samples',
    title: 'Professional Project Planning Process',
    width: 1200,
    height: 800
  },
  '/images/professional/case-study-execution.webp': {
    alt: 'Professional painter executing detailed wall painting',
    title: 'Expert Paint Application Techniques',
    width: 1200,
    height: 800
  },
  '/images/professional/case-study-completion.webp': {
    alt: 'Completed professional painting project showcase',
    title: 'Quality Painting Project Results',
    width: 1200,
    height: 800
  },
  '/images/professional/case-study-satisfaction.webp': {
    alt: 'Satisfied customer reviewing completed painting work',
    title: 'Customer Satisfaction with Professional Painting',
    width: 1200,
    height: 800
  },

  // Blog Images
  '/images/professional/blog-color-selection.webp': {
    alt: 'Professional color consultation with paint swatches',
    title: 'Expert Paint Color Selection Guide',
    width: 1000,
    height: 667
  },
  '/images/professional/blog-diy-vs-pro.webp': {
    alt: 'Comparison of DIY vs professional painting results',
    title: 'DIY vs Professional Painting Comparison',
    width: 1000,
    height: 667
  },
  '/images/professional/blog-preparation.webp': {
    alt: 'Professional painter preparing wall surface',
    title: 'Proper Wall Preparation Techniques',
    width: 1000,
    height: 1497
  },
  '/images/professional/blog-techniques.webp': {
    alt: 'Professional demonstrating painting techniques',
    title: 'Advanced Painting Techniques Tutorial',
    width: 1000,
    height: 1497
  },
  '/images/professional/blog-trends.webp': {
    alt: 'Modern interior painting color trends showcase',
    title: 'Latest Interior Painting Trends 2025',
    width: 1000,
    height: 1497
  },

  // SEO Pages Images
  '/images/professional/seo-calculator.webp': {
    alt: 'Digital painting estimate calculator interface',
    title: 'Free Painting Estimate Calculator Tool',
    width: 1200,
    height: 800
  },
  '/images/professional/seo-templates.webp': {
    alt: 'Professional painting quote templates collection',
    title: 'Painting Quote Templates for Contractors',
    width: 1200,
    height: 800
  },
  '/images/professional/seo-guide.webp': {
    alt: 'Comprehensive painting contractor guide materials',
    title: 'Complete Painting Contractor Business Guide',
    width: 1200,
    height: 800
  },
  '/images/professional/seo-software.webp': {
    alt: 'Professional painting business software dashboard',
    title: 'Painting Contractor Management Software',
    width: 1200,
    height: 800
  }
};

// Helper function to get image with metadata
export function getImageWithMetadata(imagePath: string) {
  const metadata = imageMetadata[imagePath] || {
    alt: 'Professional painting service',
    title: 'Quality Painting Solutions',
    width: 1200,
    height: 800
  };
  
  return {
    src: imagePath,
    ...metadata
  };
}

// Responsive image sizes for Next.js Image component
export const imageSizes = {
  hero: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px',
    quality: 85
  },
  feature: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
    quality: 80
  },
  service: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px',
    quality: 80
  },
  team: {
    sizes: '(max-width: 640px) 100vw, 300px',
    quality: 80
  },
  caseStudy: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
    quality: 85
  },
  blog: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1000px',
    quality: 80
  }
};