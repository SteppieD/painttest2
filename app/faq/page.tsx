import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronDown,
  ChevronRight,
  Search,
  MessageCircle,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Smartphone,
  Calculator,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ProPaint Quote FAQ & Support',
  description: 'Get answers to common questions about ProPaint Quote painting contractor software. Learn about pricing, features, setup, and how to create professional painting quotes.',
  keywords: 'painting software FAQ, quote software questions, ProPaint Quote help, painting contractor software support, painting estimate software answers',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'ProPaint Quote FAQ - Common Questions & Answers',
    description: 'Find answers to frequently asked questions about ProPaint Quote painting contractor software. Setup, pricing, features, and support.',
    url: '/faq',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          q: "How quickly can I start creating quotes?",
          a: "You can create your first professional quote in under 5 minutes. Our setup wizard guides you through selecting your favorite paint products and markup preferences in just 2 minutes, then you're ready to quote any job."
        },
        {
          q: "Do I need to download any software?",
          a: "No downloads required! ProPaint Quote works directly in your web browser on any device. We also have mobile apps for iOS and Android if you prefer the native app experience."
        },
        {
          q: "What information do I need to create a quote?",
          a: "Just the basics: customer name, project address, room dimensions, and surfaces to be painted (walls, ceilings, trim). Our AI calculator handles the rest, including material calculations and labor estimates."
        },
        {
          q: "Can I import my existing customer list?",
          a: "Yes! You can upload a CSV file with your existing customers, or add them manually as you create quotes. We also integrate with popular CRM systems."
        }
      ]
    },
    {
      title: "Pricing & Plans",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      questions: [
        {
          q: "How much does ProPaint Quote cost?",
          a: "We offer flexible pricing starting with 1 free quote to try our service. Our Standard plan is $29/month for unlimited quotes, and our Pro plan is $49/month with advanced features. No setup fees or contracts required."
        },
        {
          q: "Is there a free trial?",
          a: "Yes! You get 1 completely free quote to test our service - no credit card required. You can see exactly how the software works with your real projects before deciding to upgrade."
        },
        {
          q: "Can I cancel anytime?",
          a: "Absolutely. There are no contracts or cancellation fees. You can cancel your subscription anytime from your account settings, and you'll retain access until the end of your billing period."
        },
        {
          q: "Do you offer discounts for annual billing?",
          a: "Yes! Save 20% when you pay annually. Our Standard plan becomes $23/month and Pro plan becomes $39/month when paid yearly."
        }
      ]
    },
    {
      title: "Features & Functionality",
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      questions: [
        {
          q: "How accurate are the quote calculations?",
          a: "Our calculations are 95%+ accurate thanks to industry-standard formulas and real-time paint pricing data. You can customize material costs, labor rates, and markup percentages to match your local market."
        },
        {
          q: "Can I create quotes on my phone?",
          a: "Yes! Our mobile-responsive design works perfectly on phones and tablets. You can measure rooms, create quotes, and email them to customers right from the job site."
        },
        {
          q: "What paint brands do you support?",
          a: "We support all major paint brands including Sherwin-Williams, Benjamin Moore, Behr, PPG, and more. You can also add custom paint products with your preferred pricing."
        },
        {
          q: "Can I customize the quote appearance?",
          a: "Absolutely! Add your company logo, colors, contact information, and terms. Choose from multiple professional templates to match your brand."
        },
        {
          q: "Do you integrate with other software?",
          a: "Yes, we integrate with QuickBooks, Xero, and popular CRM systems. We also offer API access for custom integrations."
        }
      ]
    },
    {
      title: "Mobile & Field Use",
      icon: Smartphone,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      questions: [
        {
          q: "Does the app work offline?",
          a: "Yes! You can measure rooms and create quotes offline. The app syncs your data when you're back online, so you never lose work."
        },
        {
          q: "Can I take photos for quotes?",
          a: "Yes, you can attach photos to quotes for reference. This helps with accurate estimating and provides visual context for both you and your customers."
        },
        {
          q: "How do I measure rooms efficiently?",
          a: "Our mobile app includes measurement tools and room templates for common layouts. Many contractors can quote standard rooms in under 2 minutes on-site."
        },
        {
          q: "Can customers sign quotes electronically?",
          a: "Yes! Customers can review and digitally sign quotes on any device. You'll get instant notifications when quotes are viewed, signed, or have questions."
        }
      ]
    },
    {
      title: "Business Growth",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      questions: [
        {
          q: "How does ProPaint Quote increase win rates?",
          a: "Professional presentation, faster response times, and accurate pricing typically increase win rates by 40%. Customers appreciate detailed breakdowns and quick turnaround on quotes."
        },
        {
          q: "Can multiple team members use the same account?",
          a: "Yes! Our Pro plan includes multiple user access with role-based permissions. Perfect for growing painting businesses with multiple estimators."
        },
        {
          q: "Do you provide business analytics?",
          a: "Yes, we track your win rates, average quote values, most profitable job types, and business growth metrics. This data helps you optimize your pricing and target the right customers."
        },
        {
          q: "How do I scale my quoting process?",
          a: "Use our templates for common room types, set up favorite paint combinations, and train team members on the mobile app. Many contractors go from 3 hours per quote to 5 minutes."
        }
      ]
    },
    {
      title: "Support & Security",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      questions: [
        {
          q: "What kind of support do you provide?",
          a: "We offer email support, live chat, video tutorials, and one-on-one setup calls. Our support team consists of painting industry experts who understand your business."
        },
        {
          q: "Is my data secure?",
          a: "Yes! We use enterprise-grade security with SSL encryption, regular backups, and SOC 2 compliance. Your customer data and quotes are protected and never shared."
        },
        {
          q: "What if I need help getting started?",
          a: "We offer free setup assistance including importing your paint products, configuring your pricing, and training on mobile quote creation. Most contractors are fully set up within 30 minutes."
        },
        {
          q: "Do you have video tutorials?",
          a: "Yes! Our help center includes step-by-step video tutorials covering everything from basic quote creation to advanced features like project management and analytics."
        }
      ]
    }
  ];

  const quickStats = [
    { number: "5,000+", label: "Active Contractors", icon: Users },
    { number: "2.3M+", label: "Quotes Created", icon: Calculator },
    { number: "4.9/5", label: "Customer Rating", icon: CheckCircle },
    { number: "24/7", label: "Support Available", icon: MessageCircle }
  ];

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <HelpCircle />
            <span>Frequently Asked Questions</span>
          </div>
          
          <h1>
            Get Answers to Your <span>Questions</span>
          </h1>
          <p>
            Everything you need to know about ProPaint Quote painting contractor software. 
            Can't find what you're looking for? Contact our support team.
          </p>
          
          {/* Search Bar */}
          <div>
            <div>
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
             
            />
          </div>
          
          {/* Quick Stats */}
          <div>
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <Icon />
                  <div>{stat.number}</div>
                  <div>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section>
        <div>
          <div>
            <h2>
              Common Questions by Category
            </h2>
            <p>
              Find answers organized by topic to help you get the most out of ProPaint Quote
            </p>
          </div>
          
          <div>
            {faqCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={categoryIndex}>
                  {/* Category Header */}
                  <div>
                    <div>
                      <CategoryIcon />
                    </div>
                    <h3>{category.title}</h3>
                  </div>
                  
                  {/* Questions Grid */}
                  <div>
                    {category.questions.map((faq, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>
                            <ChevronRight />
                            {faq.q}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{faq.a}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section>
        <div>
          <div>
            <h2>
              Most Popular Questions
            </h2>
            <p>
              These are the questions we hear most from new contractors
            </p>
          </div>
          
          <div>
            {[
              {
                q: "How long does it take to create a professional quote?",
                a: "Most contractors create quotes in 3-5 minutes after the 2-minute setup. The mobile app makes it even faster when you're on-site with the customer."
              },
              {
                q: "Will my quotes look professional enough to compete with larger companies?",
                a: "Absolutely! Our quotes are designed to look as professional as those from the biggest painting companies. Many contractors report that customers comment on how impressed they are with the presentation."
              },
              {
                q: "Can I really increase my win rate by 40%?",
                a: "Yes, this is the average improvement we see. Faster response times, professional presentation, and accurate pricing all contribute to higher win rates. Some contractors see even better results."
              },
              {
                q: "What if I'm not tech-savvy?",
                a: "No problem! We designed ProPaint Quote to be simple enough for anyone to use. We also provide free setup assistance and one-on-one training to get you started."
              }
            ].map((faq, index) => (
              <details key={index}>
                <summary>
                  <h3>{faq.q}</h3>
                  <ChevronDown />
                </summary>
                <div>
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section>
        <div>
          <h2>
            Still Have Questions?
          </h2>
          <p>
            Our support team is here to help you succeed with ProPaint Quote
          </p>
          
          <div>
            <div>
              <MessageCircle />
              <h3>Live Chat</h3>
              <p>Get instant answers during business hours</p>
              <Button variant="outline">
                Start Chat
              </Button>
            </div>
            
            <div>
              <Clock />
              <h3>Schedule Call</h3>
              <p>Get personalized help with setup</p>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Schedule Call
                </Link>
              </Button>
            </div>
            
            <div>
              <HelpCircle />
              <h3>Help Center</h3>
              <p>Browse tutorials and guides</p>
              <Button variant="outline" asChild>
                <Link href="/help">
                  Visit Help Center
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Try ProPaint Quote Free
                <ArrowRight />
              </Link>
            </Button>
            <p>
              Start with 1 free quote • No credit card required
            </p>
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqCategories.flatMap(category => 
              category.questions.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            )
          })
        }}
      />
    </div>
  );
}