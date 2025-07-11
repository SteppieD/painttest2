import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getKeywordPageBySlug, getAllKeywordPageSlugs } from '@/lib/seo/keyword-pages';
import SEOPageTemplate from '@/components/seo/seo-page-template';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

export async function generateMetadata({ params }: { params: { keyword: string } }): Promise<Metadata> {
  const page = getKeywordPageBySlug(params.keyword);
  
  if (!page) {
    return {
      title: 'Page Not Found | Paint Quote App',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.keywords.join(', '),
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: 'website',
      url: `https://www.paintquoteapp.com/${page.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.metaDescription,
    },
    alternates: {
      canonical: `https://www.paintquoteapp.com/${page.slug}`,
    },
  };
}

export default function KeywordPage({ params }: { params: { keyword: string } }) {
  const page = getKeywordPageBySlug(params.keyword);

  if (!page) {
    notFound();
  }

  // Build schema based on page type
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Paint Quote App",
    "description": page.metaDescription,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial available"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    }
  };

  // Build hero section
  const hero = {
    headline: page.h1,
    subheadline: page.content.intro,
    ctaText: "Start Free Trial",
    ctaLink: "/trial-signup",
    features: page.content.features || page.content.benefits || [],
  };

  // Build content sections
  const sections = [];

  // Features section
  if (page.content.features && page.content.features.length > 0) {
    sections.push({
      title: "Key Features",
      content: "",
      features: page.content.features.map(feature => ({
        icon: <CheckCircle />,
        title: feature,
        description: ""
      }))
    });
  }

  // How it works section
  if (page.content.howItWorks && page.content.howItWorks.length > 0) {
    sections.push({
      title: "How It Works",
      content: (
        <ol>
          {page.content.howItWorks.map((step, index) => (
            <li key={index}>
              <span>
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )
    });
  }

  // Benefits section
  if (page.content.benefits && page.content.benefits.length > 0) {
    sections.push({
      title: "Benefits for Your Business",
      content: "",
      features: page.content.benefits.map(benefit => ({
        icon: <TrendingUp />,
        title: benefit,
        description: ""
      }))
    });
  }

  // FAQs section
  if (page.content.faqs && page.content.faqs.length > 0) {
    sections.push({
      title: "Frequently Asked Questions",
      content: (
        <div>
          {page.content.faqs.map((faq, index) => (
            <div key={index}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      )
    });
  }

  // Results section
  sections.push({
    title: "Results That Speak for Themselves",
    content: "",
    features: [
      {
        icon: <Clock />,
        title: "80% Time Savings",
        description: "Create quotes in 5 minutes instead of 30-60 minutes"
      },
      {
        icon: <TrendingUp />,
        title: "30% More Jobs Won",
        description: "Professional quotes that convert better"
      },
      {
        icon: <DollarSign />,
        title: "25% Revenue Growth",
        description: "Average increase in first 6 months"
      }
    ]
  });

  const testimonials = [
    {
      name: "Mike Johnson",
      role: "Owner",
      company: "Johnson Painting Co",
      content: "This app transformed my business. I'm winning more jobs and saving hours every day.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Estimator",
      company: "Pro Paint Solutions",
      content: "The AI suggestions are incredibly accurate. It's like having an expert assistant.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Founder",
      company: "Chen & Associates Painting",
      content: "Professional quotes in minutes. My close rate increased by 35% in the first month.",
      rating: 5
    }
  ];

  const cta = {
    title: "Ready to Transform Your Painting Business?",
    description: "Join 500+ contractors creating professional quotes in minutes.",
    buttonText: "Start Your Free Trial",
    buttonLink: "/trial-signup"
  };

  return (
    <SEOPageTemplate
      metadata={{
        title: page.title,
        description: page.metaDescription,
        keywords: page.keywords.join(', '),
        canonical: `https://www.paintquoteapp.com/${page.slug}`
      }}
      hero={hero}
      content={{ sections }}
      testimonials={testimonials}
      cta={cta}
      schema={schema}
    />
  );
}

// Generate static params for all keyword pages
export function generateStaticParams() {
  return getAllKeywordPageSlugs().map((slug) => ({
    keyword: slug,
  }));
}