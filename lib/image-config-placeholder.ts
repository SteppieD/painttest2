/**
 * Placeholder Image Configuration
 * Use this configuration if professional images are not available
 * Replace with actual CDN URLs when images are hosted
 */

const placeholderBase = 'https://placehold.co';

export const professionalImages = {
  // Hero/Homepage Images
  hero: {
    main: `${placeholderBase}/800x600/e3f2fd/1e3a8a?text=Professional+Painting`,
    secondary: `${placeholderBase}/800x600/fef3c7/92400e?text=Color+Selection`,
    tertiary: `${placeholderBase}/800x600/dbeafe/1e40af?text=Happy+Customers`
  },

  // Feature Section Images
  features: {
    quoteCreation: `${placeholderBase}/600x400/f3f4f6/374151?text=Digital+Quotes`,
    customerMeeting: `${placeholderBase}/600x400/fef3c7/92400e?text=Customer+Meeting`,
    projectPlanning: `${placeholderBase}/600x400/dbeafe/1e40af?text=Project+Planning`,
    teamWork: `${placeholderBase}/600x400/dcfce7/3f6212?text=Team+Work`
  },

  // Service Pages
  services: {
    residential: `${placeholderBase}/800x600/f3f4f6/374151?text=Residential+Painting`,
    commercial: `${placeholderBase}/800x600/dbeafe/1e40af?text=Commercial+Painting`,
    interior: `${placeholderBase}/800x600/fef3c7/92400e?text=Interior+Painting`,
    exterior: `${placeholderBase}/800x600/dcfce7/3f6212?text=Exterior+Painting`
  },

  // About/Team
  team: {
    contractor: `${placeholderBase}/600x400/e3f2fd/1e3a8a?text=Contractor`,
    painter1: `${placeholderBase}/600x400/fef3c7/92400e?text=Painter`,
    painter2: `${placeholderBase}/600x400/dcfce7/3f6212?text=Team+Member`,
    consultation: `${placeholderBase}/600x400/dbeafe/1e40af?text=Consultation`
  },

  // Case Studies / Success Stories
  caseStudies: {
    planning: `${placeholderBase}/800x600/f3f4f6/374151?text=Project+Planning`,
    execution: `${placeholderBase}/800x600/fef3c7/92400e?text=Execution`,
    completion: `${placeholderBase}/800x600/dcfce7/3f6212?text=Completion`,
    satisfaction: `${placeholderBase}/800x600/dbeafe/1e40af?text=Customer+Satisfaction`
  },

  // Blog Post Images
  blog: {
    colorSelection: `${placeholderBase}/800x600/e3f2fd/1e3a8a?text=Color+Trends`,
    diyVsPro: `${placeholderBase}/800x600/fef3c7/92400e?text=DIY+vs+Pro`,
    preparation: `${placeholderBase}/800x600/f3f4f6/374151?text=Preparation`,
    techniques: `${placeholderBase}/800x600/dcfce7/3f6212?text=Techniques`,
    trends: `${placeholderBase}/800x600/dbeafe/1e40af?text=Trends+2025`
  },

  // SEO Landing Pages
  seoPages: {
    calculator: `${placeholderBase}/800x600/f3f4f6/374151?text=Quote+Calculator`,
    templates: `${placeholderBase}/800x600/e3f2fd/1e3a8a?text=Templates`,
    guide: `${placeholderBase}/800x600/fef3c7/92400e?text=Pro+Guide`,
    software: `${placeholderBase}/800x600/dcfce7/3f6212?text=Software+Demo`
  }
};

// Image metadata for SEO
export const imageMetadata = {
  // Use generic metadata for placeholders
  default: {
    alt: 'Professional painting service placeholder',
    title: 'Professional Painting Solutions'
  }
};

// Helper function to get image with metadata
export function getImageWithMetadata(imagePath: string) {
  return {
    src: imagePath,
    alt: imageMetadata.default.alt,
    title: imageMetadata.default.title
  };
}