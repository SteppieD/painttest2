import React from 'react';
import { Metadata } from 'next';
import SEOPageTemplate from './seo-page-template';
import { MapPin, Phone, Clock, DollarSign } from 'lucide-react';

interface LocationData {
  city: string;
  state: string;
  stateCode: string;
  population?: string;
  avgProjectSize?: string;
  avgHomeValue?: string;
  topContractors?: number;
  localInsights?: string[];
}

export function generateLocationMetadata(location: LocationData): Metadata {
  const title = `Paint Quote App for ${location.city}, ${location.stateCode} | Local Painting Contractors`;
  const description = `Professional painting quotes in ${location.city}, ${location.state}. Get instant estimates, manage projects, and grow your painting business with our AI-powered platform.`;
  
  return {
    title,
    description,
    keywords: `painting contractor ${location.city}, paint estimate ${location.city}, painting quote ${location.city} ${location.stateCode}, painting software ${location.city}`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.paintquoteapp.com/locations/${location.city.toLowerCase().replace(/\s+/g, '-')}-${location.stateCode.toLowerCase()}`,
    },
  };
}

export function LocationPageTemplate({ location }: { location: LocationData }) {
  const citySlug = location.city.toLowerCase().replace(/\s+/g, '-');
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Paint Quote App - ${location.city}`,
    "description": `Professional painting quote software for contractors in ${location.city}, ${location.state}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.stateCode,
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": location.city,
      "containedIn": {
        "@type": "State",
        "name": location.state
      }
    }
  };

  const hero = {
    headline: `Professional Painting Quotes in ${location.city}, ${location.stateCode}`,
    subheadline: `Join ${location.topContractors || 50}+ painting contractors in ${location.city} using Paint Quote App to win more jobs and grow their business.`,
    ctaText: "Start Free Trial",
    ctaLink: "/trial-signup",
    features: [
      `Trusted by ${location.topContractors || 50}+ contractors in ${location.city}`,
      "Create professional quotes in under 5 minutes",
      "Win 30% more jobs with instant estimates",
      "No credit card required to start"
    ]
  };

  const content = {
    sections: [
      {
        title: `Why ${location.city} Painting Contractors Choose Paint Quote App`,
        content: `In a competitive market like ${location.city}, professional painting contractors need every advantage to win more jobs and grow their business. With ${location.population || "a growing population"} and an average home value of ${location.avgHomeValue || "$400,000"}, homeowners expect professional, detailed quotes that inspire confidence.

Paint Quote App helps you create stunning, professional quotes that win more jobs. Our AI-powered platform understands the unique aspects of the ${location.city} market, from local paint preferences to typical project sizes, helping you quote accurately and competitively.`,
        features: [
          {
            icon: <MapPin className="h-8 w-8 text-blue-600" />,
            title: `Local ${location.city} Market Data`,
            description: "Pricing insights based on local market rates and competition"
          },
          {
            icon: <Clock className="h-8 w-8 text-blue-600" />,
            title: "5-Minute Quotes",
            description: "Create professional quotes 80% faster than traditional methods"
          },
          {
            icon: <DollarSign className="h-8 w-8 text-blue-600" />,
            title: "Win More Jobs",
            description: `Join contractors winning 30% more jobs in ${location.city}`
          }
        ]
      },
      {
        title: `Painting Industry Insights for ${location.city}`,
        content: (
          <div className="space-y-4">
            <p className="text-gray-600">
              The painting industry in {location.city} is thriving, with unique opportunities and challenges:
            </p>
            <ul className="space-y-2">
              {(location.localInsights || [
                `Average painting project size: ${location.avgProjectSize || "$3,500-5,000"}`,
                `Peak season: April through October`,
                `Most requested: Interior repaints and exterior trim work`,
                `Growing demand for eco-friendly paint options`,
                `Competitive market with ${location.topContractors || 50}+ active contractors`
              ]).map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-600">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      },
      {
        title: `Get Started in ${location.city} Today`,
        content: `Whether you're an established painting contractor in ${location.city} or just starting your business, Paint Quote App gives you the professional tools you need to compete and win. Our platform is designed specifically for painters, by painters, with features that address the real challenges you face every day.

Start your free trial today and join the growing community of successful painting contractors in ${location.city} who are winning more jobs, saving time, and growing their businesses with Paint Quote App.`
      }
    ]
  };

  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "Owner",
      company: `${location.city} Pro Painters`,
      content: "Paint Quote App transformed how we do business. We're winning 40% more jobs and saving hours every week.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Estimator",
      company: "Premium Painting Co",
      content: `As a busy contractor in ${location.city}, I needed something fast and professional. This delivers both perfectly.`,
      rating: 5
    },
    {
      name: "James Thompson",
      role: "Founder",
      company: "Thompson Painting LLC",
      content: "The AI suggestions are incredibly accurate for our local market. It's like having an expert estimator on staff.",
      rating: 5
    }
  ];

  const cta = {
    title: `Ready to Grow Your Painting Business in ${location.city}?`,
    description: "Join hundreds of successful contractors using Paint Quote App. Start your free trial today.",
    buttonText: "Start Free Trial - No Credit Card Required",
    buttonLink: "/trial-signup"
  };

  return (
    <SEOPageTemplate
      metadata={{
        title: `Paint Quote App for ${location.city}, ${location.stateCode} | Local Painting Contractors`,
        description: `Professional painting quotes in ${location.city}, ${location.state}. Get instant estimates, manage projects, and grow your painting business.`,
        keywords: `painting contractor ${location.city}, paint estimate ${location.city}, painting quote ${location.city}`,
        canonical: `https://www.paintquoteapp.com/locations/${citySlug}-${location.stateCode.toLowerCase()}`
      }}
      hero={hero}
      content={content}
      testimonials={testimonials}
      cta={cta}
      schema={schema}
    />
  );
}