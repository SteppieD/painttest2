export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.paintquoteapp.com/#website",
        "url": "https://www.paintquoteapp.com/",
        "name": "ProPaint Quote",
        "description": "Professional painting quote software for contractors",
        "publisher": {
          "@id": "https://www.paintquoteapp.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.paintquoteapp.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://www.paintquoteapp.com/#organization",
        "name": "ProPaint Quote",
        "alternateName": "Professional Painting Quote Software",
        "url": "https://www.paintquoteapp.com/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "https://www.paintquoteapp.com/#/schema/logo/image/",
          "url": "https://www.paintquoteapp.com/logo.png",
          "contentUrl": "https://www.paintquoteapp.com/logo.png",
          "width": 512,
          "height": 512,
          "caption": "ProPaint Quote"
        },
        "image": {
          "@id": "https://www.paintquoteapp.com/#/schema/logo/image/"
        },
        "sameAs": [
          "https://www.facebook.com/propaintquote",
          "https://twitter.com/propaintquote",
          "https://www.linkedin.com/company/propaintquote"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "ProPaint Quote",
        "description": "Professional painting quote and estimate software for contractors. Create accurate painting quotes in 30 seconds.",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Painting Contractor Software",
        "operatingSystem": "Web, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free trial with 10 quotes included"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "5247",
          "bestRating": "5",
          "worstRating": "1"
        },
        "featureList": [
          "Instant painting quotes in 30 seconds",
          "AI-powered cost calculations",
          "Professional quote templates",
          "Customer management system",
          "Mobile-friendly interface",
          "Offline functionality",
          "Email quote delivery",
          "Payment processing integration"
        ],
        "screenshot": [
          "https://www.paintquoteapp.com/screenshot-dashboard.png",
          "https://www.paintquoteapp.com/screenshot-quote.png"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}