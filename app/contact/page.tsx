import Link from 'next/link';
import { 
  Palette, 
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Calendar,
  MapPin,
  Globe,
  Shield,
  HeadphonesIcon,
  Video,
  FileText,
  Award,
  Users,
  TrendingUp,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TouchFriendlyInput } from '@/components/ui/touch-friendly-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Contact ProPaint Quote - Expert Support for Painting Contractors | Get Help Today',
  description: 'Contact ProPaint Quote for expert support, personalized demos, and sales assistance. Trusted by 5,000+ painting contractors. Call 1-800-PROPAINT or chat with our team.',
  keywords: 'contact painting software, painting contractor support, quote software help, painting software demo, contractor customer service, painting business support',
  path: '/contact',
});

export default function ContactPage() {
  // Support statistics
  const supportStats = [
    { icon: Clock, number: "< 4 Hours", label: "Average Response Time", color: "text-blue-600" },
    { icon: Users, number: "5,000+", label: "Happy Contractors", color: "text-green-600" },
    { icon: Star, number: "4.9/5", label: "Support Rating", color: "text-yellow-500" },
    { icon: Award, number: "99.9%", label: "Uptime Guarantee", color: "text-purple-600" }
  ];

  // Contact methods with detailed info
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Our Experts",
      description: "Speak directly with painting industry professionals",
      contact: "1-800-PROPAINT",
      details: "Mon-Fri, 8AM-6PM EST",
      buttonText: "Call Now",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Video,
      title: "Schedule a Demo",
      description: "15-minute personalized walkthrough with your data",
      contact: "Book instantly online",
      details: "Available today",
      buttonText: "Schedule Demo",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      description: "Instant help from our technical support team",
      contact: "Chat now",
      details: "Business hours only",
      buttonText: "Start Chat",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed help with screenshots and examples",
      contact: "support@propaintquote.com",
      details: "24-hour response guarantee",
      buttonText: "Send Email",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // FAQ data with more comprehensive answers
  const faqs = [
    {
      question: "How quickly can I start creating quotes?",
      answer: "Most contractors are creating their first professional quote within 5 minutes of signing up. Our 2-minute setup wizard guides you through selecting your favorite paint products and markup preferences, then you're ready to quote any job."
    },
    {
      question: "Do you provide training and onboarding?",
      answer: "Yes! Every new contractor gets a free 15-minute onboarding call where we'll customize the software for your business, import your paint preferences, and walk you through creating your first quote. We also provide video tutorials and ongoing support."
    },
    {
      question: "Can I customize quotes with my company branding?",
      answer: "Absolutely! Add your logo, company colors, contact information, and custom terms. Your quotes will look professionally branded and help you stand out from competitors using generic estimate forms."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer phone, email, live chat, and video call support. Our team includes former painting contractors who understand your business. Average response time is under 4 hours, with 99.9% uptime guaranteed."
    },
    {
      question: "Do you integrate with QuickBooks or other accounting software?",
      answer: "Yes! We integrate with QuickBooks, Xero, and other popular accounting platforms. You can sync customer information, export invoices, and track job profitability without double data entry."
    },
    {
      question: "Can I use this on my phone while at job sites?",
      answer: "ProPaint Quote is fully mobile-optimized and works perfectly on phones and tablets. Many contractors create quotes on-site with customers, which often leads to immediate job acceptance and deposits."
    }
  ];

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          {/* Trust Badge */}
          <div>
            <Star />
            <span>Rated 4.9/5 by 5,000+ Professional Contractors</span>
          </div>
          
          <h1>
            Get Expert <span>Support</span> & Guidance
          </h1>
          <p>
            Talk to painting industry experts who understand your business. Get personalized help with software, 
            business strategy, or technical support. We're here to help you succeed.
          </p>
          
          {/* Quick Stats */}
          <div>
            {supportStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <Icon className={`${stat.color} mx-auto mb-2`} />
                  <div>{stat.number}</div>
                  <div>{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          <div>
            <Button size="lg">
              <Phone />
              Call 1-800-PROPAINT
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Schedule Free Demo
                <Calendar />
              </Link>
            </Button>
          </div>
          
          <p>
            ⚡ Average 4-hour response time • Expert contractor support • Free demos available
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section>
        <div>
          <div>
            <h2>
              Choose How You'd Like to Connect
            </h2>
            <p>
              Multiple ways to get help from painting industry experts
            </p>
          </div>
          
          <div>
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index}>
                  <CardContent>
                    <div className={`${method.bgColor} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`${method.color} w-6 h-6`} />
                    </div>
                    <h3>{method.title}</h3>
                    <p>{method.description}</p>
                    <p className={`${method.color} font-semibold mb-2`}>{method.contact}</p>
                    <p>{method.details}</p>
                    <Button variant="outline" size="sm">
                      {method.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Team Section */}
      <section>
        <div>
          <div>
            <h2>
              Meet Our Support Team
            </h2>
            <p>
              Real contractors and technical experts who understand your business
            </p>
          </div>
          
          <div>
            <Card>
              <CardContent>
                <div>
                  JD
                </div>
                <h3>John Davis</h3>
                <p>Lead Support Specialist</p>
                <p>15 years painting contractor, helps with business strategy and software setup</p>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div>
                  AM
                </div>
                <h3>Anna Martinez</h3>
                <p>Technical Support Lead</p>
                <p>Software engineer specializing in mobile quote creation and integrations</p>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div>
                  RC
                </div>
                <h3>Robert Chen</h3>
                <p>Customer Success Manager</p>
                <p>Former commercial painter, specializes in large project quoting and team training</p>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div>
              <Shield />
              <h3>Our Support Commitment</h3>
              <div>
                <div>
                  <CheckCircle />
                  <p>Response Guarantee</p>
                  <p>Under 4 hours, every time</p>
                </div>
                <div>
                  <CheckCircle />
                  <p>Industry Expertise</p>
                  <p>Real contractor experience</p>
                </div>
                <div>
                  <CheckCircle />
                  <p>Continuous Support</p>
                  <p>Ongoing success partnership</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section>
        <div>
          <div>
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <p>
                    Get personalized help from our expert team. Average response time: 4 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form>
                    <div>
                      <TouchFriendlyInput
                        label="First Name *"
                        placeholder="John"
                        required
                      />
                      <TouchFriendlyInput
                        label="Last Name *"
                        placeholder="Smith"
                        required
                      />
                    </div>

                    <TouchFriendlyInput
                      label="Email Address *"
                      type="email"
                      placeholder="john@smithpainting.com"
                      required
                    />

                    <TouchFriendlyInput
                      label="Company Name"
                      placeholder="Smith Painting Co."
                    />

                    <TouchFriendlyInput
                      label="Phone Number"
                      type="tel"
                      placeholder="(555) 123-4567"
                    />

                    <div>
                      <Label htmlFor="subject">How can we help? *</Label>
                      <select 
                        id="subject" 
                        required
                       
                      >
                        <option value="">Select your need</option>
                        <option value="demo">Schedule a Demo</option>
                        <option value="trial">Start Free Trial</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales Question</option>
                        <option value="billing">Billing Question</option>
                        <option value="integration">Integration Help</option>
                        <option value="training">Training Request</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message">Tell us more *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Describe your painting business and how we can help you succeed..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg">
                      Send Message
                      <ArrowRight />
                    </Button>
                    
                    <p>
                      * Required fields. We'll respond within 4 hours during business hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Quick Actions */}
            <div>
              <Card>
                <CardContent>
                  <h3>Need Help Right Now?</h3>
                  
                  <div>
                    <div>
                      <Phone />
                      <div>
                        <p>Call Us Immediately</p>
                        <p>1-800-PROPAINT</p>
                        <p>Mon-Fri, 8AM-6PM EST</p>
                      </div>
                    </div>
                    
                    <div>
                      <Video />
                      <div>
                        <p>Book a Demo</p>
                        <p>15-minute walkthrough</p>
                        <p>Available today</p>
                      </div>
                    </div>
                    
                    <div>
                      <MessageSquare />
                      <div>
                        <p>Live Chat</p>
                        <p>Instant answers</p>
                        <p>Business hours only</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3>Company Information</h3>
                  
                  <div>
                    <div>
                      <MapPin />
                      <span>Headquarters: Austin, Texas</span>
                    </div>
                    <div>
                      <Globe />
                      <span>Serving all 50 states</span>
                    </div>
                    <div>
                      <Mail />
                      <span>support@propaintquote.com</span>
                    </div>
                    <div>
                      <LifeBuoy />
                      <span>24/7 system uptime monitoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Zap />
                  <h3>Try ProPaint Quote Free</h3>
                  <p>
                    Start creating professional quotes in 5 minutes. No credit card required.
                  </p>
                  <Button asChild>
                    <Link href="/trial-signup">
                      Start Free Trial
                      <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div>
          <div>
            <h2>
              Common Questions & Expert Answers
            </h2>
            <p>
              Get answers from painting industry professionals
            </p>
          </div>

          <div>
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <p>Still have questions?</p>
            <Button size="lg" variant="outline">
              <Phone />
              Call 1-800-PROPAINT for Instant Answers
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Testimonial */}
      <section>
        <div>
          <Card>
            <CardContent>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <blockquote>
                "The ProPaint Quote support team helped me set up everything perfectly. Within an hour of my first call, 
                I was creating professional quotes that helped me win my biggest job yet - a $25,000 commercial project!"
              </blockquote>
              <div>
                <div>
                  TM
                </div>
                <div>
                  <div>Tom Martinez</div>
                  <div>Elite Commercial Painting, Houston TX</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <h2>
            Ready to Get the Support You Deserve?
          </h2>
          <p>
            Join 5,000+ contractors who trust ProPaint Quote for expert support and business growth
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial Today
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Schedule Free Demo
                <Calendar />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>✓ Expert contractor support</span>
            <span>✓ 4-hour response guarantee</span>
            <span>✓ Free onboarding & training</span>
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data for Organization Contact */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ProPaint Quote",
            "description": "Professional painting contractor software with expert support",
            "url": "https://propaintquote.com",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "1-800-PROPAINT",
                "contactType": "customer service",
                "email": "support@propaintquote.com",
                "availableLanguage": "English",
                "hoursAvailable": "Mo-Fr 08:00-18:00",
                "contactOption": "TollFree"
              },
              {
                "@type": "ContactPoint",
                "contactType": "sales",
                "email": "sales@propaintquote.com",
                "availableLanguage": "English"
              },
              {
                "@type": "ContactPoint",
                "contactType": "technical support",
                "email": "support@propaintquote.com",
                "availableLanguage": "English",
                "hoursAvailable": "Mo-Fr 08:00-18:00"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Austin",
              "addressRegion": "TX",
              "addressCountry": "US"
            },
            "areaServed": "US",
            "serviceType": "SaaS Software Support"
          })
        }}
      />
    </div>
  );
}