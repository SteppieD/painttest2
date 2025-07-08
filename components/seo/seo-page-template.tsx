import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

interface SEOPageTemplateProps {
  metadata: {
    title: string;
    description: string;
    keywords: string;
    canonical?: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    image?: string;
    features?: string[];
  };
  content: {
    sections: Array<{
      title: string;
      content: string | React.ReactNode;
      image?: string;
      imageAlt?: string;
      features?: Array<{
        icon?: React.ReactNode;
        title: string;
        description: string;
      }>;
    }>;
  };
  testimonials?: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    rating?: number;
  }>;
  cta?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  schema?: any;
}

export function generateMetadata(props: SEOPageTemplateProps): Metadata {
  return {
    title: props.metadata.title,
    description: props.metadata.description,
    keywords: props.metadata.keywords,
    openGraph: {
      title: props.metadata.title,
      description: props.metadata.description,
      type: 'website',
      url: props.metadata.canonical || 'https://www.paintquoteapp.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: props.metadata.title,
      description: props.metadata.description,
    },
    alternates: {
      canonical: props.metadata.canonical,
    },
  };
}

export default function SEOPageTemplate({
  hero,
  content,
  testimonials,
  cta,
  schema,
}: SEOPageTemplateProps) {
  return (
    <>
      <Header />
      
      {/* Schema Markup */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {hero.headline}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {hero.subheadline}
              </p>
              
              {hero.features && (
                <div className="space-y-3 mb-8">
                  {hero.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={hero.ctaLink}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {hero.ctaText}
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9/5 (500+ reviews)</span>
                </div>
              </div>
            </div>
            
            {hero.image && (
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src={hero.image}
                  alt={hero.headline}
                  fill
                  className="object-cover rounded-lg shadow-xl"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {content.sections.map((section, index) => (
        <section key={index} className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
              
              {section.image && (
                <div className="relative h-[300px] mb-8">
                  <Image
                    src={section.image}
                    alt={section.imageAlt || section.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              
              {typeof section.content === 'string' ? (
                <div className="prose prose-lg max-w-none text-gray-600">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              ) : (
                section.content
              )}
              
              {section.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {section.features.map((feature, fIndex) => (
                    <Card key={fIndex}>
                      <CardHeader>
                        {feature.icon && <div className="mb-2">{feature.icon}</div>}
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Contractors Say About Us
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of successful painting contractors
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {testimonial.rating && [...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {cta && (
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {cta.title}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {cta.description}
            </p>
            <Link href={cta.buttonLink}>
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                {cta.buttonText}
              </Button>
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}