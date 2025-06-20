import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Palette, 
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Contact ProPaint Quote - Get Help & Support for Painting Contractors',
  description: 'Contact ProPaint Quote for support, sales questions, or demo requests. We\'re here to help painting contractors succeed with our quote software.',
  keywords: 'contact painting software, customer support, painting contractor help, quote software demo',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact ProPaint Quote - Customer Support',
    description: 'Get in touch with our team for support, sales questions, or to schedule a demo of our painting quote software.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help you succeed. Whether you need support, have questions about features, or want to see a demo, our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Speak directly with our team for immediate assistance
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  (555) 123-PAINT
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Mon-Fri, 8am-6pm EST
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Send us your questions and we'll respond within 24 hours
                </p>
                <p className="text-lg font-semibold text-green-600">
                  support@propaintquote.com
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Average response: 4 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Chat with our team for quick answers and support
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Chat
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Available during business hours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Send Us a Message</CardTitle>
                <p className="text-gray-600 text-center">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Smith" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Smith Painting Co." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <select 
                      id="subject" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a topic</option>
                      <option value="demo">Request Demo</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales Question</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about ProPaint Quote
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How quickly can I get started?</h3>
                <p className="text-gray-600">
                  You can start creating professional quotes in under 5 minutes. Simply sign up for your free trial, enter your company information, and you're ready to go.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer training or setup assistance?</h3>
                <p className="text-gray-600">
                  Yes! We provide free onboarding calls for all new users. Our team will walk you through the software and help you customize it for your business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can I customize quotes with my company branding?</h3>
                <p className="text-gray-600">
                  Absolutely! You can add your company logo, colors, and contact information to create professional, branded quotes that represent your business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What kind of support do you provide?</h3>
                <p className="text-gray-600">
                  We offer multiple support channels including phone, email, and live chat. Our average response time is under 4 hours, and we're available Monday through Friday.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't wait – start creating professional quotes today with your free trial
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/access-code">
              Start Free Trial Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            Free 14-day trial • No credit card required • Full customer support
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}