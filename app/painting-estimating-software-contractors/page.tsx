import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  FileText,
  BarChart3
} from 'lucide-react';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Best Painting Estimating Software for Contractors (2025) | ProPaint Quote',
  description: 'Compare the top painting estimating software for contractors. AI-powered quotes, mobile apps, and professional tools. Start your free trial today.',
  keywords: 'painting estimating software, best painting estimating software, estimating software for painting contractors, painting contractor software, painting business software',
  openGraph: {
    title: 'Best Painting Estimating Software for Contractors',
    description: 'Compare the top painting estimating software for contractors. AI-powered quotes, mobile apps, and professional tools.',
    type: 'website',
  },
};

export default function PaintingEstimatingSoftwarePage() {
  return (
    <div>

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Best <span>Painting Estimating Software</span> for Contractors
          </h1>
          <p>
            Compare top-rated estimating software solutions. Create accurate quotes in minutes, win more jobs, and grow your painting business with professional tools.
          </p>
          <div>
            <Link href="/trial-signup">
              Try ProPaint Quote Free
              <ArrowRight />
            </Link>
            <p>Free trial • No credit card required • Setup in 5 minutes</p>
          </div>
          
          <div>
            <div>
              <div>95%</div>
              <div>More Accurate Quotes</div>
            </div>
            <div>
              <div>5x</div>
              <div>Faster Than Manual</div>
            </div>
            <div>
              <div>40%</div>
              <div>Higher Win Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Comparison */}
      <section>
        <div>
          <div>
            <h2>Why Contractors Choose ProPaint Quote</h2>
            <p>Industry-leading features that save time and increase profits</p>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>ProPaint Quote</th>
                  <th>Other Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AI-Powered Quote Generation</td>
                  <td><CheckCircle /></td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td>Mobile App for Field Work</td>
                  <td><CheckCircle /></td>
                  <td>Limited</td>
                </tr>
                <tr>
                  <td>Professional Quote Templates</td>
                  <td><CheckCircle /></td>
                  <td><CheckCircle /></td>
                </tr>
                <tr>
                  <td>Customer Management System</td>
                  <td><CheckCircle /></td>
                  <td>Basic</td>
                </tr>
                <tr>
                  <td>Real-time Analytics</td>
                  <td><CheckCircle /></td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td>Setup Time</td>
                  <td>5 Minutes</td>
                  <td>2-4 Hours</td>
                </tr>
                <tr>
                  <td>Free Trial</td>
                  <td><CheckCircle /></td>
                  <td>Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <div>
          <div>
            <h2>Everything You Need in One Platform</h2>
            <p>Professional tools designed specifically for painting contractors</p>
          </div>

          <div>
            <div>
              <Calculator />
              <h3>Smart Quote Calculator</h3>
              <p>Industry-standard formulas calculate materials, labor, and markup automatically. Never underestimate a job again.</p>
              <ul>
                <li>• Paint coverage calculations</li>
                <li>• Labor time estimates</li>
                <li>• Material cost tracking</li>
              </ul>
            </div>

            <div>
              <Smartphone />
              <h3>Mobile-First Design</h3>
              <p>Create quotes on-site with your phone or tablet. Perfect for walk-through estimates and immediate responses.</p>
              <ul>
                <li>• Works on any device</li>
                <li>• Offline capability</li>
                <li>• Customer signatures</li>
              </ul>
            </div>

            <div>
              <Users />
              <h3>Customer Management</h3>
              <p>Track all your quotes and customers in one place. Follow up on pending estimates and convert more leads.</p>
              <ul>
                <li>• Quote history tracking</li>
                <li>• Follow-up reminders</li>
                <li>• Customer communication</li>
              </ul>
            </div>

            <div>
              <BarChart3 />
              <h3>Business Analytics</h3>
              <p>Track your win rates, average job size, and profit margins. Make data-driven decisions to grow your business.</p>
              <ul>
                <li>• Win rate analysis</li>
                <li>• Revenue tracking</li>
                <li>• Profit margin reports</li>
              </ul>
            </div>

            <div>
              <Clock />
              <h3>5-Minute Quotes</h3>
              <p>Generate detailed, professional quotes in minutes instead of hours. Respond to leads faster than your competition.</p>
              <ul>
                <li>• Template automation</li>
                <li>• Quick calculations</li>
                <li>• Instant delivery</li>
              </ul>
            </div>

            <div>
              <Shield />
              <h3>Professional Branding</h3>
              <p>Send professional, branded quotes that build trust with customers and help you stand out from competitors.</p>
              <ul>
                <li>• Custom branding</li>
                <li>• Professional templates</li>
                <li>• Digital signatures</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <h2>Trusted by Professional Painters</h2>
          
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "ProPaint Quote has transformed how we estimate jobs. We're closing 40% more deals and our quotes are always accurate. The mobile app is a game-changer for site visits."
              </p>
              <div>Mike Johnson</div>
              <div>Elite Painting Co.</div>
            </div>

            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "The AI-powered quotes are incredibly accurate. What used to take me an hour now takes 5 minutes. My customers love the professional presentation and quick turnaround."
              </p>
              <div>Sarah Martinez</div>
              <div>Precision Painters LLC</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Ready to Win More Painting Jobs?</h2>
          <p>Join thousands of contractors using professional estimating software</p>
          
          <div>
            <Link href="/trial-signup">
              Start Free Trial
              <ArrowRight />
            </Link>
            <Link href="/painting-estimate-calculator">
              Try Calculator
            </Link>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>Free trial included</span>
            </div>
            <div>
              <CheckCircle />
              <span>No credit card required</span>
            </div>
            <div>
              <CheckCircle />
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}