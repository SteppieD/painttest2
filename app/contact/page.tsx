import { Metadata } from 'next';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Contact ProPaint Quote - Expert Support for Painting Contractors | Get Help Today',
  description: 'Contact ProPaint Quote for expert support, personalized demos, and sales assistance. Trusted by 5,000+ painting contractors. Call 1-800-PROPAINT or chat with our team.',
  keywords: 'contact painting software, painting contractor support, quote software help, painting software demo, contractor customer service, painting business support',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact ProPaint Quote - Expert Support & Customer Success',
    description: 'Get personalized help from painting industry experts. Schedule a demo, get technical support, or speak with our sales team. 5,000+ contractors trust our support.',
    url: '/contact',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact ProPaint Quote - Expert Support for Contractors',
    description: 'Get help from painting industry experts. Free demos, technical support, and sales assistance available.',
  },
};

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Rated 4.9/5 by 5,000+ Professional Contractors</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Expert <span className="text-blue-600">Support</span> & Guidance
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Talk to painting industry experts who understand your business. Get personalized help with software, 
            business strategy, or technical support. We're here to help you succeed.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {supportStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Phone className="w-5 h-5 mr-2" />
              Call 1-800-PROPAINT
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/demo">
                Schedule Free Demo
                <Calendar className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            ⚡ Average 4-hour response time • Expert contractor support • Free demos available
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose How You'd Like to Connect
            </h2>
            <p className="text-xl text-gray-600">
              Multiple ways to get help from painting industry experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${method.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                    <p className={`font-semibold ${method.color} mb-2`}>{method.contact}</p>
                    <p className="text-xs text-gray-500 mb-4">{method.details}</p>
                    <Button variant="outline" size="sm" className="w-full">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Support Team
            </h2>
            <p className="text-xl text-gray-600">
              Real contractors and technical experts who understand your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  JD
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">John Davis</h3>
                <p className="text-blue-600 text-sm mb-3">Lead Support Specialist</p>
                <p className="text-gray-600 text-sm mb-4">15 years painting contractor, helps with business strategy and software setup</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  AM
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Anna Martinez</h3>
                <p className="text-green-600 text-sm mb-3">Technical Support Lead</p>
                <p className="text-gray-600 text-sm mb-4">Software engineer specializing in mobile quote creation and integrations</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  RC
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Robert Chen</h3>
                <p className="text-purple-600 text-sm mb-3">Customer Success Manager</p>
                <p className="text-gray-600 text-sm mb-4">Former commercial painter, specializes in large project quoting and team training</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Support Commitment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Response Guarantee</p>
                  <p className="text-sm text-gray-600">Under 4 hours, every time</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Industry Expertise</p>
                  <p className="text-sm text-gray-600">Real contractor experience</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Continuous Support</p>
                  <p className="text-sm text-gray-600">Ongoing success partnership</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <p className="text-gray-600">
                    Get personalized help from our expert team. Average response time: 4 hours.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Smith" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john@smithpainting.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Smith Painting Co." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">How can we help? *</Label>
                      <select 
                        id="subject" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us more *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Describe your painting business and how we can help you succeed..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                      Send Message
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      * Required fields. We'll respond within 4 hours during business hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Quick Actions */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help Right Now?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <Phone className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Call Us Immediately</p>
                        <p className="text-blue-600 font-bold">1-800-PROPAINT</p>
                        <p className="text-sm text-gray-600">Mon-Fri, 8AM-6PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                      <Video className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Book a Demo</p>
                        <p className="text-green-600 font-bold">15-minute walkthrough</p>
                        <p className="text-sm text-gray-600">Available today</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Live Chat</p>
                        <p className="text-purple-600 font-bold">Instant answers</p>
                        <p className="text-sm text-gray-600">Business hours only</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Headquarters: Austin, Texas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Serving all 50 states</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">support@propaintquote.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <LifeBuoy className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">24/7 system uptime monitoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Try ProPaint Quote Free</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Start creating professional quotes in 5 minutes. No credit card required.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/trial-signup">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Common Questions & Expert Answers
            </h2>
            <p className="text-xl text-gray-600">
              Get answers from painting industry professionals
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button size="lg" variant="outline">
              <Phone className="w-5 h-5 mr-2" />
              Call 1-800-PROPAINT for Instant Answers
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Testimonial */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 italic mb-6">
                "The ProPaint Quote support team helped me set up everything perfectly. Within an hour of my first call, 
                I was creating professional quotes that helped me win my biggest job yet - a $25,000 commercial project!"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  TM
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Tom Martinez</div>
                  <div className="text-sm text-gray-600">Elite Commercial Painting, Houston TX</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get the Support You Deserve?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors who trust ProPaint Quote for expert support and business growth
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                Start Free Trial Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/demo">
                Schedule Free Demo
                <Calendar className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-blue-200 text-sm">
            <span>✓ Expert contractor support</span>
            <span>✓ 4-hour response guarantee</span>
            <span>✓ Free onboarding & training</span>
          </div>
        </div>
      </section>

      <Footer />

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