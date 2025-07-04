/**
 * Professional Image Configuration
 * Maps professional photos to different use cases across the website
 */

export const professionalImages = {
  // Hero/Homepage Images
  hero: {
    main: '/images/professional/man-painting-wall-light-blue.jpg',
    secondary: '/images/professional/couple-picking-paint-color.jpg',
    tertiary: '/images/professional/contractor-customer-outdoor-handshake.jpg'
  },

  // Feature Section Images
  features: {
    quoteCreation: '/images/professional/construction-contractor-using-computer-smiling.jpg',
    customerMeeting: '/images/professional/construction-man-looking-at-paperwork-with-client-smiling.jpg',
    projectPlanning: '/images/professional/contractor-and-owner-with-blueprints-looking-at-wall.jpg',
    teamWork: '/images/professional/couple-in-house-with-construction-workers-looking-at-blueprints.jpg'
  },

  // Service Pages
  services: {
    residential: '/images/professional/man-painting-constructions-room-white-with-ladder.jpg',
    commercial: '/images/professional/man-painting-exterior-highrise-tropical.jpg',
    interior: '/images/professional/woman-painting-wall-grey-smiling.jpg',
    exterior: '/images/professional/painting-home-light-brown-professional.jpg'
  },

  // About/Team
  team: {
    contractor: '/images/professional/happy-contractor-working-on-blueprints-in-house.jpg',
    painter1: '/images/professional/man-painting-wall-on-ladder.jpg',
    painter2: '/images/professional/woman-painting-wall-orange.jpg',
    consultation: '/images/professional/contruction-company-and-clinet-reviewing-plans.jpg'
  },

  // Case Studies / Success Stories
  caseStudies: {
    planning: '/images/professional/couple-reviewing-blueprints-in-construction-home.jpg',
    execution: '/images/professional/man-spraying-paint-balcony-white-facemask.jpg',
    completion: '/images/professional/man-staring-half-painted-wall.jpg',
    satisfaction: '/images/professional/couple-in-framed-house-looking-at-blueprints-with-contractor.jpg'
  },

  // Blog Post Images
  blog: {
    colorSelection: '/images/professional/woman-picking-paint-clour-on-wall-older.jpg',
    diyVsPro: '/images/professional/girl-painting-wall-yellow-hat.jpg',
    preparation: '/images/professional/woman-painting-wall-empty-roller.jpg',
    techniques: '/images/professional/woman-painting-wall-grey-on-ladder.jpg',
    trends: '/images/professional/woman-painting-wall-grey-red-shirt.jpg'
  },

  // SEO Landing Pages
  seoPages: {
    calculator: '/images/professional/construction-contractor-using-computer-smiling.jpg',
    templates: '/images/professional/construction-couple-looking-at-blueprints-hardhelmets.jpg',
    guide: '/images/professional/happy-contractor-working-on-blueprints-in-house.jpg',
    software: '/images/professional/construction-man-looking-at-paperwork-with-client-smiling.jpg'
  }
};

// Image metadata for SEO
export const imageMetadata = {
  '/images/professional/construction-contractor-using-computer-smiling.jpg': {
    alt: 'Professional contractor using painting quote software on computer',
    title: 'Digital Quote Creation for Painting Contractors'
  },
  '/images/professional/couple-picking-paint-color.jpg': {
    alt: 'Couple selecting paint colors with professional guidance',
    title: 'Professional Paint Color Consultation'
  },
  '/images/professional/contractor-customer-outdoor-handshake.jpg': {
    alt: 'Contractor shaking hands with satisfied customer outdoors',
    title: 'Professional Painting Service Agreement'
  },
  '/images/professional/man-painting-wall-light-blue.jpg': {
    alt: 'Professional painter applying light blue paint to wall',
    title: 'Expert Interior Painting Services'
  },
  '/images/professional/woman-painting-wall-grey-smiling.jpg': {
    alt: 'Happy professional painter working on interior walls',
    title: 'Quality Painting Services with a Smile'
  },
  '/images/professional/man-painting-exterior-highrise-tropical.jpg': {
    alt: 'Commercial painter working on high-rise building exterior',
    title: 'Professional Commercial Painting Services'
  },
  '/images/professional/happy-contractor-working-on-blueprints-in-house.jpg': {
    alt: 'Contractor reviewing project blueprints on-site',
    title: 'Professional Project Planning and Estimation'
  }
};

// Helper function to get image with metadata
export function getImageWithMetadata(imagePath: string) {
  return {
    src: imagePath,
    ...(imageMetadata[imagePath] || {
      alt: 'Professional painting service',
      title: 'Quality Painting Solutions'
    })
  };
}