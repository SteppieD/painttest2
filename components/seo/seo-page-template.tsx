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
      <section>
        <div>
          <div>
            <div>
              <h1>
                {hero.headline}
              </h1>
              <p>
                {hero.subheadline}
              </p>
              
              {hero.features && (
                <div>
                  {hero.features.map((feature, index) => (
                    <div key={index}>
                      <CheckCircle />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <Link href={hero.ctaLink}>
                  <Button size="lg">
                    {hero.ctaText}
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div>
                <div>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} />
                    ))}
                  </div>
                  <span>4.9/5 (500+ reviews)</span>
                </div>
              </div>
            </div>
            
            {hero.image && (
              <div>
                <Image
                  src={hero.image}
                  alt={hero.headline}
                  fill
                 
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {content.sections.map((section, index) => (
        <section key={index}`}>
          <div>
            <div>
              <h2>{section.title}</h2>
              
              {section.image && (
                <div>
                  <Image
                    src={section.image}
                    alt={section.imageAlt || section.title}
                    fill
                   
                  />
                </div>
              )}
              
              {typeof section.content === 'string' ? (
                <div>
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                section.content
              )}
              
              {section.features && (
                <div>
                  {section.features.map((feature, fIndex) => (
                    <Card key={fIndex}>
                      <CardHeader>
                        {feature.icon && <div>{feature.icon}</div>}
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{feature.description}</p>
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
        <section>
          <div>
            <div>
              <h2>
                What Contractors Say About Us
              </h2>
              <p>
                Join thousands of successful painting contractors
              </p>
            </div>
            
            <div>
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent>
                    <div>
                      {testimonial.rating && [...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} />
                      ))}
                    </div>
                    <p>"{testimonial.content}"</p>
                    <div>
                      <p>{testimonial.name}</p>
                      <p>
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
        <section>
          <div>
            <h2>
              {cta.title}
            </h2>
            <p>
              {cta.description}
            </p>
            <Link href={cta.buttonLink}>
              <Button size="lg" variant="secondary">
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