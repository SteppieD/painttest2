// Keyword page configurations for programmatic SEO
export interface KeywordPageConfig {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  keywords: string[];
  content: {
    intro: string;
    features?: string[];
    howItWorks?: string[];
    benefits?: string[];
    faqs?: Array<{ q: string; a: string }>;
  };
}

export const keywordPages: KeywordPageConfig[] = [
  // Paint Quote Keywords
  {
    slug: 'paint-quote-app',
    title: 'Paint Quote App - Professional Painting Estimates in Minutes',
    metaDescription: 'Create professional paint quotes in under 5 minutes. AI-powered paint quote app trusted by 500+ contractors. Start free trial.',
    h1: 'The #1 Paint Quote App for Professional Contractors',
    keywords: ['paint quote app', 'painting quote application', 'paint estimate app'],
    content: {
      intro: 'Transform your painting business with the most advanced paint quote app on the market. Create stunning, professional quotes in minutes, not hours.',
      features: [
        'AI-powered quote generation in under 5 minutes',
        'Professional templates that win more jobs',
        'Mobile-friendly for on-site estimates',
        'Integrated payment processing',
        'Smart pricing suggestions based on local rates'
      ],
      benefits: [
        'Win 30% more jobs with professional quotes',
        'Save 10+ hours per week on estimates',
        'Get paid faster with online payments',
        'Scale your business with automation'
      ]
    }
  },
  {
    slug: 'paint-quote-example',
    title: 'Paint Quote Example - Professional Templates & Samples',
    metaDescription: 'See real paint quote examples from successful contractors. Download free templates and learn what makes a winning quote.',
    h1: 'Professional Paint Quote Examples That Win Jobs',
    keywords: ['paint quote example', 'painting quote sample', 'paint estimate example'],
    content: {
      intro: 'Learn from real paint quote examples that have helped contractors win thousands of jobs. See what separates professional quotes from the competition.',
      howItWorks: [
        'Browse our gallery of successful quote examples',
        'Download customizable templates',
        'Adapt proven formats to your business',
        'Start winning more jobs immediately'
      ]
    }
  },
  {
    slug: 'how-to-quote-for-painting',
    title: 'How to Quote for Painting - Complete Guide for Contractors',
    metaDescription: 'Learn how to quote painting jobs professionally. Step-by-step guide covers pricing, measurements, and winning strategies.',
    h1: 'How to Quote for Painting: The Complete Guide',
    keywords: ['how to quote for painting', 'painting quote guide', 'how to estimate painting'],
    content: {
      intro: 'Master the art of painting quotes with our comprehensive guide. Learn professional techniques that top contractors use to win more jobs.',
      howItWorks: [
        'Accurate measurement techniques',
        'Material calculation formulas',
        'Labor hour estimation',
        'Profit margin strategies',
        'Professional presentation tips'
      ],
      faqs: [
        {
          q: 'How long should a painting quote take?',
          a: 'With traditional methods, 30-60 minutes. With Paint Quote App, under 5 minutes.'
        },
        {
          q: 'What should be included in a painting quote?',
          a: 'Detailed scope, materials list, labor breakdown, timeline, payment terms, and warranty information.'
        }
      ]
    }
  },
  {
    slug: 'painting-quote-template',
    title: 'Free Painting Quote Template - Professional & Customizable',
    metaDescription: 'Download free painting quote templates used by successful contractors. Customizable Word, Excel, and PDF formats available.',
    h1: 'Professional Painting Quote Templates - Free Download',
    keywords: ['painting quote template', 'paint estimate template', 'free painting quote form'],
    content: {
      intro: 'Get instant access to professional painting quote templates that have helped contractors close millions in projects. Customize for your brand and start winning more jobs.',
      features: [
        'Multiple format options (Word, Excel, PDF)',
        'Fully customizable with your branding',
        'Includes all essential quote elements',
        'Mobile-friendly digital versions',
        'Legal terms and conditions included'
      ]
    }
  },
  {
    slug: 'painting-quote-generator',
    title: 'AI Painting Quote Generator - Instant Professional Estimates',
    metaDescription: 'Generate professional painting quotes instantly with AI. Smart pricing, accurate calculations, and beautiful templates.',
    h1: 'AI-Powered Painting Quote Generator',
    keywords: ['painting quote generator', 'paint estimate generator', 'automated painting quotes'],
    content: {
      intro: 'Experience the future of painting estimates with our AI-powered quote generator. Create accurate, professional quotes in minutes with smart automation.',
      features: [
        'AI analyzes project details for accurate pricing',
        'Automatic material calculations',
        'Smart labor hour estimates',
        'Local market rate integration',
        'One-click professional PDF generation'
      ]
    }
  },
  {
    slug: 'interior-painting-quote',
    title: 'Interior Painting Quote Calculator - Fast & Accurate Estimates',
    metaDescription: 'Create professional interior painting quotes in minutes. Accurate room-by-room calculations with material lists.',
    h1: 'Interior Painting Quote Calculator & Generator',
    keywords: ['interior painting quote', 'interior paint estimate', 'indoor painting quote'],
    content: {
      intro: 'Specialized tools for interior painting contractors. Calculate accurate quotes for any interior project with room-by-room precision.',
      features: [
        'Room-by-room calculations',
        'Ceiling height adjustments',
        'Trim and detail work pricing',
        'Multiple coat calculations',
        'Prep work estimation'
      ]
    }
  },
  {
    slug: 'painting-quote-calculator',
    title: 'Painting Quote Calculator - Professional Estimating Tool',
    metaDescription: 'Free painting quote calculator for contractors. Calculate material costs, labor hours, and profit margins instantly.',
    h1: 'Professional Painting Quote Calculator',
    keywords: ['painting quote calculator', 'paint estimate calculator', 'painting cost calculator'],
    content: {
      intro: 'The most advanced painting quote calculator designed by contractors, for contractors. Get accurate estimates in seconds, not hours.',
      howItWorks: [
        'Enter project dimensions',
        'Select paint types and finishes',
        'Add surface conditions and prep work',
        'Get instant, accurate pricing',
        'Generate professional quote PDF'
      ]
    }
  },
  // Contractor Software Keywords
  {
    slug: 'paint-contractor-software',
    title: 'Paint Contractor Software - Complete Business Management',
    metaDescription: 'All-in-one paint contractor software for quotes, scheduling, and payments. Trusted by 500+ painting businesses.',
    h1: 'Complete Paint Contractor Software Solution',
    keywords: ['paint contractor software', 'painting contractor software', 'painter software'],
    content: {
      intro: 'Everything you need to run a successful painting business in one powerful platform. From quotes to payments, we\'ve got you covered.',
      features: [
        'Professional quote generation',
        'Job scheduling and tracking',
        'Customer relationship management',
        'Integrated payment processing',
        'Business analytics and reporting'
      ]
    }
  },
  {
    slug: 'paint-contractor-estimating-software',
    title: 'Paint Contractor Estimating Software - Win More Jobs',
    metaDescription: 'Professional estimating software built for paint contractors. Create accurate estimates 80% faster.',
    h1: 'Paint Contractor Estimating Software That Wins Jobs',
    keywords: ['paint contractor estimating software', 'painting estimating software', 'contractor estimate software'],
    content: {
      intro: 'Stop losing jobs to slow, unprofessional estimates. Our estimating software helps you create winning quotes in minutes.',
      benefits: [
        'Create estimates 80% faster',
        'Reduce errors with automated calculations',
        'Win more jobs with professional presentation',
        'Track win rates and optimize pricing',
        'Integrate with your existing tools'
      ]
    }
  },
  {
    slug: 'apps-for-painting-contractors',
    title: 'Best Apps for Painting Contractors - Top 10 Tools for 2025',
    metaDescription: 'Discover the best apps for painting contractors. Compare features, pricing, and reviews of top painting business apps.',
    h1: 'Top Apps for Painting Contractors in 2025',
    keywords: ['apps for painting contractors', 'painting contractor apps', 'painter apps'],
    content: {
      intro: 'Compare the best apps for painting contractors and find the perfect tools to grow your business. From estimating to project management.',
      features: [
        'Quote and estimate creation',
        'Project photo management',
        'Time tracking and scheduling',
        'Invoice and payment processing',
        'Customer communication tools'
      ]
    }
  },
  // Interior Paint Specific Keywords
  {
    slug: 'interior-paint-estimate-template',
    title: 'Interior Paint Estimate Template - Free Professional Download',
    metaDescription: 'Download free interior paint estimate templates. Professional formats with room-by-room breakdowns.',
    h1: 'Professional Interior Paint Estimate Templates',
    keywords: ['interior paint estimate template', 'interior painting template', 'indoor paint estimate form'],
    content: {
      intro: 'Get professional interior paint estimate templates designed specifically for residential and commercial indoor projects.',
      features: [
        'Room-by-room breakdown sections',
        'Surface preparation checklists',
        'Paint and material calculators',
        'Labor hour estimates by room type',
        'Professional terms and conditions'
      ]
    }
  },
  {
    slug: 'how-to-estimate-interior-paint-jobs',
    title: 'How to Estimate Interior Paint Jobs - Pro Contractor Guide',
    metaDescription: 'Learn how to estimate interior paint jobs like a pro. Step-by-step guide with formulas, tips, and common mistakes to avoid.',
    h1: 'How to Estimate Interior Paint Jobs: Complete Guide',
    keywords: ['how to estimate interior paint jobs', 'interior painting estimation', 'estimate interior painting'],
    content: {
      intro: 'Master interior paint estimation with proven techniques from successful contractors. Learn to price jobs profitably every time.',
      howItWorks: [
        'Measure rooms accurately (walls, ceilings, trim)',
        'Calculate paint coverage and gallons needed',
        'Factor in surface conditions and prep work',
        'Estimate labor hours by room complexity',
        'Add appropriate profit margins'
      ]
    }
  },
  {
    slug: 'wall-paint-area-calculator',
    title: 'Wall Paint Area Calculator - Accurate Paint Estimates',
    metaDescription: 'Free wall paint area calculator for contractors. Calculate exact paint needed with window and door deductions.',
    h1: 'Professional Wall Paint Area Calculator',
    keywords: ['wall paint area calculator', 'paint coverage calculator', 'wall paint calculator'],
    content: {
      intro: 'Calculate exact paint requirements with our professional wall paint area calculator. Account for windows, doors, and multiple coats.',
      features: [
        'Automatic window/door deductions',
        'Multiple coat calculations',
        'Different paint coverage rates',
        'Ceiling and trim additions',
        'Waste factor adjustments'
      ]
    }
  },
  {
    slug: 'interior-paint-cost-estimator',
    title: 'Interior Paint Cost Estimator - Quick & Accurate Pricing',
    metaDescription: 'Estimate interior painting costs instantly. Professional calculator includes labor, materials, and profit margins.',
    h1: 'Interior Paint Cost Estimator for Contractors',
    keywords: ['interior paint cost estimator', 'interior painting cost calculator', 'indoor paint pricing'],
    content: {
      intro: 'Get accurate interior painting cost estimates in seconds. Our calculator includes everything from prep work to final touches.',
      features: [
        'Labor cost calculations by region',
        'Material costs with current pricing',
        'Prep work and repair estimates',
        'Overhead and profit calculations',
        'Professional quote generation'
      ]
    }
  }
];

// Function to get page config by slug
export function getKeywordPageBySlug(slug: string): KeywordPageConfig | undefined {
  return keywordPages.find(page => page.slug === slug);
}

// Function to generate all keyword page slugs
export function getAllKeywordPageSlugs(): string[] {
  return keywordPages.map(page => page.slug);
}