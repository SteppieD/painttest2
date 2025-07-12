import { Metadata } from 'next'
import { Footer } from '@/components/shared/footer'
import { Search, MessageCircle, Book, Video, Settings, Users, Calculator, FileText, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help Center | ProPaint Quote - Support & Documentation',
  description: 'Get help with ProPaint Quote painting contractor software. Find answers, tutorials, and support for creating professional painting quotes.',
  robots: 'index, follow',
}

export default function HelpPage() {
  return (
    <div>
      
      {/* Hero Section */}
      <section>
        <div>
          <h1>How can we help you?</h1>
          <p>
            Find answers, tutorials, and support for getting the most out of ProPaint Quote
          </p>
          
          {/* Search Bar */}
          <div>
            <div>
              <Search />
            </div>
            <input
              type="text"
             
              placeholder="Search for help articles, tutorials, or features..."
            />
          </div>
          
          <p>
            Popular searches: "How to create a quote", "Setting up paint products", "Customer management"
          </p>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section>
        <div>
          <h2>Popular Help Topics</h2>
          
          <div>
            <div>
              <div>
                <Calculator />
              </div>
              <h3>Creating Quotes</h3>
              <p>
                Learn how to create accurate, professional painting quotes quickly
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Quote creation walkthrough
                </li>
                <li>
                  <CheckCircle />
                  Pricing calculations explained
                </li>
                <li>
                  <CheckCircle />
                  Adding custom line items
                </li>
              </ul>
              <button>
                View Articles <ArrowRight />
              </button>
            </div>

            <div>
              <div>
                <Settings />
              </div>
              <h3>Setup & Configuration</h3>
              <p>
                Get your account configured and customize settings for your business
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Initial account setup
                </li>
                <li>
                  <CheckCircle />
                  Paint products configuration
                </li>
                <li>
                  <CheckCircle />
                  Labor rates and pricing
                </li>
              </ul>
              <button>
                View Articles <ArrowRight />
              </button>
            </div>

            <div>
              <div>
                <Users />
              </div>
              <h3>Customer Management</h3>
              <p>
                Manage customers, track quotes, and follow up on opportunities
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Adding customer information
                </li>
                <li>
                  <CheckCircle />
                  Quote status tracking
                </li>
                <li>
                  <CheckCircle />
                  Follow-up reminders
                </li>
              </ul>
              <button>
                View Articles <ArrowRight />
              </button>
            </div>

            <div>
              <div>
                <FileText />
              </div>
              <h3>Proposals & Documents</h3>
              <p>
                Create professional proposals and customize document templates
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Customizing proposals
                </li>
                <li>
                  <CheckCircle />
                  Adding your branding
                </li>
                <li>
                  <CheckCircle />
                  Terms and conditions
                </li>
              </ul>
              <button>
                View Articles <ArrowRight />
              </button>
            </div>

            <div>
              <div>
                <Video />
              </div>
              <h3>Video Tutorials</h3>
              <p>
                Watch step-by-step video guides for all major features
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  Getting started series
                </li>
                <li>
                  <CheckCircle />
                  Advanced features
                </li>
                <li>
                  <CheckCircle />
                  Best practices
                </li>
              </ul>
              <button>
                View Tutorials <ArrowRight />
              </button>
            </div>

            <div>
              <div>
                <Book />
              </div>
              <h3>API & Integrations</h3>
              <p>
                Connect ProPaint Quote with your existing tools and workflows
              </p>
              <ul>
                <li>
                  <CheckCircle />
                  API documentation
                </li>
                <li>
                  <CheckCircle />
                  Available integrations
                </li>
                <li>
                  <CheckCircle />
                  Webhook setup
                </li>
              </ul>
              <button>
                View Documentation <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div>
          <h2>Frequently Asked Questions</h2>
          
          <div>
            <div>
              <h3>How do I create my first quote?</h3>
              <p>
                Creating your first quote is simple! Start by clicking "Create Quote" in your dashboard, 
                then follow our guided process to enter project details. Our AI assistant will help 
                calculate accurate pricing based on your configured rates and materials.
              </p>
              <button>Read full guide →</button>
            </div>

            <div>
              <h3>How accurate are the pricing calculations?</h3>
              <p>
                Our pricing calculations are based on industry-standard formulas and your specific 
                business settings. The accuracy depends on how well you've configured your labor 
                rates, material costs, and overhead percentages during setup.
              </p>
              <button>Learn about pricing →</button>
            </div>

            <div>
              <h3>Can I customize the quote templates?</h3>
              <p>
                Yes! You can customize quote templates with your company branding, logo, terms and 
                conditions, and specific formatting preferences. Go to Settings → Templates to 
                get started.
              </p>
              <button>Customize templates →</button>
            </div>

            <div>
              <h3>What if I need help beyond these articles?</h3>
              <p>
                We're here to help! You can contact our support team via email at hello@paintquoteapp.com 
                or use the live chat feature. We typically respond within 2-4 hours during business hours.
              </p>
              <button>Contact support →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section>
        <div>
          <h2>Still need help?</h2>
          <p>
            Our support team is here to help you succeed with ProPaint Quote
          </p>
          
          <div>
            <div>
              <MessageCircle />
              <h3>Live Chat Support</h3>
              <p>
                Get instant help from our support team
              </p>
              <button>
                Start Chat
              </button>
            </div>
            
            <div>
              <Book />
              <h3>Email Support</h3>
              <p>
                Send us a detailed message and we'll respond within 4 hours
              </p>
              <button>
                Send Email
              </button>
            </div>
          </div>
          
          <p>
            Support hours: Monday-Friday 8am-6pm EST • Average response time: 2 hours
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}