export interface SchemaMarkupProps {
  type: 'SoftwareApplication' | 'BreadcrumbList' | 'LocalBusiness' | 'Article' | 'FAQPage';
  data: any;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const generateSchema = () => {
    switch (type) {
      case 'SoftwareApplication':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ProPaint Quote",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "description": "Professional painting quote software for contractors. Create accurate quotes in minutes, not hours. Trusted by 5,247+ painting contractors.",
          "offers": {
            "@type": "Offer",
            "price": "79.00",
            "priceCurrency": "USD",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "79.00",
              "priceCurrency": "USD",
              "referenceQuantity": {
                "@type": "QuantitativeValue",
                "value": "1",
                "unitCode": "MON"
              }
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "247",
            "bestRating": "5",
            "worstRating": "1"
          },
          "creator": {
            "@type": "Organization",
            "name": "ProPaint Quote",
            "url": "https://www.paintquoteapp.com"
          },
          "screenshot": "https://www.paintquoteapp.com/images/screenshot.png",
          "featureList": [
            "AI-powered quote generation",
            "30-second quotes with templates",
            "Professional PDF exports",
            "Customer management",
            "Mobile-optimized",
            "Favorite products system"
          ],
          "softwareVersion": "2.0",
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString()
        };

      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url ? `https://www.paintquoteapp.com${item.url}` : undefined
          }))
        };

      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data.name,
          "description": data.description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": data.city,
            "addressRegion": data.state,
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude,
            "longitude": data.longitude
          },
          "url": data.url,
          "telephone": data.phone,
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "reviewCount": data.reviewCount || "89"
          }
        };

      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": data.author || "ProPaint Quote Team"
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified || data.datePublished,
          "publisher": {
            "@type": "Organization",
            "name": "ProPaint Quote",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.paintquoteapp.com/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          },
          "image": data.image
        };

      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.questions.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}