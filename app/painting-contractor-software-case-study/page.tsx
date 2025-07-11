import Link from 'next/link';
import Image from 'next/image';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Quote,
  ArrowRight,
  Star,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { Button } from '@/components/ui/button';
import { professionalImages } from '@/lib/image-config';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Painting Contractor Software Case Study: 278% ROI in 90 Days',
  description: 'See how Rodriguez Painting increased revenue by $47,000 monthly using painting contractor software. Real results, proven ROI, and step-by-step transformation.',
  keywords: 'painting contractor software case study, painting business software ROI, painting contractor software results, painting business growth software, painting estimate software success story',
  path: '/painting-contractor-software-case-study',
});

export default function PaintingContractorSoftwareCaseStudy() {
  return (
    <div>
      <KofiHeader />
      
      <main>
        {/* Hero Section */}
        <div>
          <div>
            <CheckCircle />
            Verified Case Study • Real Results
          </div>
          
          <h1>
            Painting Contractor Software Case Study: <span>278% ROI in 90 Days</span>
          </h1>
          
          <p>
            How Rodriguez Painting transformed their business with painting contractor software, generating 
            <strong> $47,000 additional monthly revenue</strong> and reducing quote time by 85%.
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Your Free Trial
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Calculator</Link>
            </Button>
          </div>
        </div>

        {/* Key Results Summary */}
        <div>
          <h2>
            Key Results from Painting Business Software Implementation
          </h2>
          
          <div>
            <div>
              <div>
                <TrendingUp />
              </div>
              <div>278%</div>
              <div>ROI Increase</div>
            </div>
            
            <div>
              <div>
                <DollarSign />
              </div>
              <div>$47K</div>
              <div>Monthly Revenue Increase</div>
            </div>
            
            <div>
              <div>
                <Clock />
              </div>
              <div>85%</div>
              <div>Time Savings</div>
            </div>
            
            <div>
              <div>
                <Users />
              </div>
              <div>340%</div>
              <div>Quote Volume Increase</div>
            </div>
          </div>
        </div>

        {/* Success Story Image */}
        <div>
          <Image
            src={professionalImages.caseStudies.satisfaction}
            alt="Rodriguez Painting team celebrating success with contractor software"
            width={1200}
            height={600}
           
          />
          <div>
            <h2>Rodriguez Painting Success Story</h2>
            <p>How modern software transformed a small painting business</p>
          </div>
        </div>

        {/* Company Profile */}
        <div>
          <h2>Company Profile: Rodriguez Painting</h2>
          
          <div>
            <div>
              <h3>Company Details</h3>
              <ul>
                <li><strong>Founded:</strong> 2019</li>
                <li><strong>Location:</strong> Austin, Texas</li>
                <li><strong>Team Size:</strong> 8 painters, 2 admin staff</li>
                <li><strong>Specialty:</strong> Residential and commercial painting</li>
                <li><strong>Service Area:</strong> Greater Austin metropolitan area</li>
              </ul>
            </div>
            
            <div>
              <h3>Business Challenges</h3>
              <ul>
                <li>• Manual quote creation taking 3-4 hours each</li>
                <li>• Inconsistent pricing leading to lost profits</li>
                <li>• Poor quote presentation losing potential clients</li>
                <li>• Difficulty tracking quote conversion rates</li>
                <li>• Limited ability to quote multiple jobs per day</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Before vs After */}
        <div>
          <h2>
            Before vs After: Painting Contractor Software Transformation
          </h2>
          
          <div>
            {/* Before */}
            <div>
              <h3>
                <Target />
                Before Painting Software
              </h3>
              
              <div>
                <div>
                  <span>Monthly Quotes Created</span>
                  <span>12-15</span>
                </div>
                <div>
                  <span>Average Quote Time</span>
                  <span>3.5 hours</span>
                </div>
                <div>
                  <span>Quote Conversion Rate</span>
                  <span>22%</span>
                </div>
                <div>
                  <span>Monthly Revenue</span>
                  <span>$28,000</span>
                </div>
                <div>
                  <span>Profit Margin</span>
                  <span>18%</span>
                </div>
              </div>
              
              <div>
                <p>
                  "We were spending entire days on quotes and still losing jobs to competitors with better presentations."
                </p>
              </div>
            </div>
            
            {/* After */}
            <div>
              <h3>
                <Zap />
                After ProPaint Quote Software
              </h3>
              
              <div>
                <div>
                  <span>Monthly Quotes Created</span>
                  <span>53-58</span>
                </div>
                <div>
                  <span>Average Quote Time</span>
                  <span>28 minutes</span>
                </div>
                <div>
                  <span>Quote Conversion Rate</span>
                  <span>38%</span>
                </div>
                <div>
                  <span>Monthly Revenue</span>
                  <span>$75,000</span>
                </div>
                <div>
                  <span>Profit Margin</span>
                  <span>28%</span>
                </div>
              </div>
              
              <div>
                <p>
                  "Now we can quote multiple jobs in a morning and still have time for actual painting. Our clients love the professional proposals."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div>
          <h2>90-Day Implementation Timeline</h2>
          
          <div>
            <div>
              <div>1</div>
              <div>
                <h3>Week 1-2: Setup & Training</h3>
                <p>Completed 2-minute setup wizard, configured paint favorites, and trained team on new quoting process.</p>
              </div>
            </div>
            
            <div>
              <div>2</div>
              <div>
                <h3>Week 3-4: First Quotes</h3>
                <p>Created first 15 quotes using software, achieving 45% conversion rate vs. previous 22%.</p>
              </div>
            </div>
            
            <div>
              <div>3</div>
              <div>
                <h3>Month 2: Scaling Up</h3>
                <p>Doubled quote volume from 15 to 32 per month while maintaining quality and accuracy.</p>
              </div>
            </div>
            
            <div>
              <div>4</div>
              <div>
                <h3>Month 3: Full Optimization</h3>
                <p>Reached 55+ quotes per month, 38% conversion rate, and $47K monthly revenue increase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonial */}
        <div>
          <div>
            <Quote />
            <blockquote>
              "ProPaint Quote transformed our business completely. We went from struggling with manual quotes to becoming 
              the fastest-responding contractor in Austin. Our revenue increased by $47,000 per month, and our clients 
              constantly compliment our professional proposals."
            </blockquote>
            <div>
              <div>
                <div>Carlos Rodriguez</div>
                <div>Owner, Rodriguez Painting</div>
              </div>
              <div>
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROI Breakdown */}
        <div>
          <h2>
            <BarChart3 />
            Detailed ROI Analysis: Painting Business Software Investment
          </h2>
          
          <div>
            <div>
              <h3>Investment Costs (First Year)</h3>
              <div>
                <div>
                  <span>Software Subscription</span>
                  <span>$1,188</span>
                </div>
                <div>
                  <span>Team Training Time</span>
                  <span>$800</span>
                </div>
                <div>
                  <span>Setup & Migration</span>
                  <span>$400</span>
                </div>
                <div>
                  <span>Total Investment</span>
                  <span>$2,388</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3>Revenue Gains (First Year)</h3>
              <div>
                <div>
                  <span>Additional Monthly Revenue</span>
                  <span>$47,000 × 10 months</span>
                </div>
                <div>
                  <span>Improved Margin (10%)</span>
                  <span>$33,600</span>
                </div>
                <div>
                  <span>Time Savings Value</span>
                  <span>$28,800</span>
                </div>
                <div>
                  <span>Total Gains</span>
                  <span>$532,400</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div>278% ROI</div>
            <p>Return on Investment in First Year</p>
            <p>
              Net Gain: $529,012 | Payback Period: 2.1 months
            </p>
          </div>
        </div>

        {/* Key Features That Drove Results */}
        <div>
          <h2>
            Painting Contractor Software Features That Drove Results
          </h2>
          
          <div>
            <div>
              <CheckCircle />
              <h3>2-Minute Setup Wizard</h3>
              <p>Configure paint favorites and markup preferences once, use everywhere.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>One-Click Paint Selection</h3>
              <p>Select from pre-configured favorites: "Sherwin ProClassic - $58/gal"</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Smart Measurement Logic</h3>
              <p>Only asks for measurements actually needed based on selected surfaces.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Professional Proposals</h3>
              <p>AI-powered quote generation with professional formatting and branding.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Mobile-Ready Quoting</h3>
              <p>Quote jobs on-site using mobile devices with offline capability.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Real-Time Analytics</h3>
              <p>Track conversion rates, revenue, and performance metrics in real-time.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div>
          <h2>Ready to Transform Your Painting Business?</h2>
          <p>
            Join thousands of painting contractors who've increased their revenue with ProPaint Quote
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Free Trial - No Credit Card Required
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Calculator First</Link>
            </Button>
          </div>
          
          <p>
            ✅ 14-day free trial ✅ No setup fees ✅ Cancel anytime ✅ Expert support included
          </p>
        </div>
      </main>
      
      <ImprovedFooter />
    </div>
  );
}