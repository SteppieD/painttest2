import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Calculator, 
  BarChart3, 
  FileText, 
  CreditCard,
  Calendar,
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Complete Painting Business Software | Customer Management & Quotes | ProPaint Quote',
  description: 'All-in-one painting business software. Manage quotes, customers, invoicing, and analytics in one platform. Grow your painting business with professional tools.',
  keywords: 'painting business software, painting contractor software, painting company management software, painting business management, contractor software',
  openGraph: {
    title: 'Complete Painting Business Software | Customer Management & Quotes',
    description: 'All-in-one painting business software for quotes, customers, invoicing, and analytics.',
    type: 'website',
  },
};

export default function PaintingBusinessSoftwarePage() {
  return (
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Complete <span>Painting Business</span> Software
          </h1>
          <p>
            Manage your entire painting business in one platform. From quotes and customers to invoicing and analytics – everything you need to grow your contracting business.
          </p>
          <div>
            <Link href="/trial-signup">
              Start Free Business Trial
              <ArrowRight />
            </Link>
            <p>Complete business management • Free trial • No credit card required</p>
          </div>
          
          <div>
            <div>
              <div>All-in-One</div>
              <div>Business Management</div>
            </div>
            <div>
              <div>50%</div>
              <div>Less Admin Time</div>
            </div>
            <div>
              <div>30%</div>
              <div>Revenue Growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Solution */}
      <section>
        <div>
          <div>
            <h2>Everything Your Painting Business Needs</h2>
            <p>Stop juggling multiple tools. Manage your entire business from one professional platform.</p>
          </div>

          <div>
            <div>
              <Calculator />
              <h3>Professional Quoting</h3>
              <p>Generate accurate painting quotes in minutes with AI-powered calculations and professional templates.</p>
              <ul>
                <li>• AI-powered quote generation</li>
                <li>• Professional templates</li>
                <li>• Mobile quote creation</li>
                <li>• Digital signatures</li>
              </ul>
            </div>

            <div>
              <Users />
              <h3>Customer Management</h3>
              <p>Track all your customers, projects, and communications in one organized system.</p>
              <ul>
                <li>• Customer database</li>
                <li>• Project history tracking</li>
                <li>• Communication logs</li>
                <li>• Follow-up reminders</li>
              </ul>
            </div>

            <div>
              <FileText />
              <h3>Project Management</h3>
              <p>Organize and track all your painting projects from estimate to completion.</p>
              <ul>
                <li>• Project timelines</li>
                <li>• Progress tracking</li>
                <li>• Material lists</li>
                <li>• Photo documentation</li>
              </ul>
            </div>

            <div>
              <CreditCard />
              <h3>Invoicing & Payments</h3>
              <p>Create professional invoices and track payments to improve cash flow.</p>
              <ul>
                <li>• Professional invoicing</li>
                <li>• Payment tracking</li>
                <li>• Payment reminders</li>
                <li>• Revenue reporting</li>
              </ul>
            </div>

            <div>
              <BarChart3 />
              <h3>Business Analytics</h3>
              <p>Track performance with detailed analytics and insights to grow your business.</p>
              <ul>
                <li>• Revenue analytics</li>
                <li>• Win rate tracking</li>
                <li>• Profit margin analysis</li>
                <li>• Growth forecasting</li>
              </ul>
            </div>

            <div>
              <Calendar />
              <h3>Scheduling & Tasks</h3>
              <p>Organize your schedule and never miss important tasks or follow-ups.</p>
              <ul>
                <li>• Project scheduling</li>
                <li>• Task management</li>
                <li>• Automated reminders</li>
                <li>• Calendar integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Workflow */}
      <section>
        <div>
          <div>
            <h2>Streamlined Business Workflow</h2>
            <p>See how our software optimizes every step of your painting business</p>
          </div>

          <div>
            <div>
              <div>
                <span>1</span>
              </div>
              <h3>Lead Capture</h3>
              <p>Capture leads from website forms, phone calls, and referrals directly into your system.</p>
            </div>

            <div>
              <div>
                <Calculator />
              </div>
              <h3>Quick Quotes</h3>
              <p>Generate professional quotes in minutes and send them instantly to prospects.</p>
            </div>

            <div>
              <div>
                <FileText />
              </div>
              <h3>Project Management</h3>
              <p>Convert accepted quotes to projects and track progress from start to finish.</p>
            </div>

            <div>
              <div>
                <CreditCard />
              </div>
              <h3>Get Paid</h3>
              <p>Send professional invoices and track payments to maintain healthy cash flow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Business */}
      <section>
        <div>
          <div>
            <div>
              <h2>Grow Your Painting Business</h2>
              <p>
                Stop losing time on admin work and focus on what you do best – painting. Our software handles the business side so you can grow.
              </p>
              
              <div>
                <div>
                  <CheckCircle />
                  <div>
                    <h3>Save 10+ Hours Per Week</h3>
                    <p>Automate quotes, invoices, and follow-ups to focus on actual painting work.</p>
                  </div>
                </div>
                
                <div>
                  <CheckCircle />
                  <div>
                    <h3>Increase Win Rate by 40%</h3>
                    <p>Professional quotes and faster response times win more jobs.</p>
                  </div>
                </div>
                
                <div>
                  <CheckCircle />
                  <div>
                    <h3>Improve Cash Flow</h3>
                    <p>Track payments and send automatic reminders to get paid faster.</p>
                  </div>
                </div>
                
                <div>
                  <CheckCircle />
                  <div>
                    <h3>Scale Your Business</h3>
                    <p>Handle more customers and projects without hiring more office staff.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3>Business Growth Results</h3>
              <div>
                <div>
                  <span>Administrative Time</span>
                  <div>
                    <div>-50%</div>
                    <TrendingUp />
                  </div>
                </div>
                <div>
                  <span>Quote Response Time</span>
                  <div>
                    <div>5x Faster</div>
                    <TrendingUp />
                  </div>
                </div>
                <div>
                  <span>Customer Satisfaction</span>
                  <div>
                    <div>+35%</div>
                    <TrendingUp />
                  </div>
                </div>
                <div>
                  <span>Revenue Growth</span>
                  <div>
                    <div>+30%</div>
                    <TrendingUp />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section>
        <div>
          <div>
            <h2>Run Your Business from Anywhere</h2>
            <p>Full mobile functionality means you can manage your business from the field</p>
          </div>

          <div>
            <div>
              <Smartphone />
              <h3>Mobile Quoting</h3>
              <p>Create and send quotes during customer consultations for instant approval.</p>
            </div>

            <div>
              <Clock />
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about quote approvals, payments, and customer messages.</p>
            </div>

            <div>
              <Shield />
              <h3>Secure & Reliable</h3>
              <p>Your business data is protected with bank-level security and automatic backups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <h2>Painting Contractors Love Our Software</h2>
          
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "This software has completely transformed my painting business. I've cut my admin time in half and increased my revenue by 30%. The mobile app lets me quote jobs on-site, which customers love."
              </p>
              <div>Tom Wilson</div>
              <div>Wilson Painting Contractors</div>
            </div>

            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "Finally, everything I need in one place. Quotes, customers, projects, invoices – it's all connected. The analytics help me make better business decisions. Highly recommended!"
              </p>
              <div>Jennifer Davis</div>
              <div>Davis Professional Painting</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Ready to Transform Your Painting Business?</h2>
          <p>Join hundreds of painting contractors who've streamlined their business with our software</p>
          
          <div>
            <Link href="/trial-signup">
              Start Free Business Trial
              <ArrowRight />
            </Link>
            <Link href="/painting-estimate-calculator">
              See Demo
            </Link>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>Complete business suite</span>
            </div>
            <div>
              <CheckCircle />
              <span>Free trial included</span>
            </div>
            <div>
              <CheckCircle />
              <span>Setup in 10 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}