'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Clock,
  Shield,
  TrendingUp,
  Users,
  Award,
  Zap,
  BarChart3,
  Calculator,
  Smartphone,
  FileText,
  DollarSign
} from 'lucide-react';
import { professionalImages, getImageWithMetadata } from '@/lib/image-config';

export function OptimizedSaaSLayoutWithImages() {
  const featureImages = {
    quoteCreation: getImageWithMetadata(professionalImages.features.quoteCreation),
    customerMeeting: getImageWithMetadata(professionalImages.features.customerMeeting),
    projectPlanning: getImageWithMetadata(professionalImages.features.projectPlanning),
    teamWork: getImageWithMetadata(professionalImages.features.teamWork)
  };

  return (
    <div>
      {/* Section 1: Above the Fold - Hero with Clear Value Proposition */}
      <section>
        <div>
          <div>
            {/* Left: Messaging */}
            <div>
              {/* Trust Badge */}
              <div>
                <Award size={16} />
                <span>Trusted by 5,247+ Painting Contractors</span>
              </div>

              {/* Main Headline - Problem/Solution Fit */}
              <h1>
                Stop Losing Jobs to
                <span>Faster Competitors</span>
              </h1>

              {/* Sub-headline - Clear Value Prop */}
              <p>
                Create professional painting quotes in <strong>30 seconds</strong> instead of 3 days. 
                Win more jobs with instant, accurate estimates that impress customers.
              </p>

              {/* Social Proof Bar */}
              <div>
                <div>
                  <div>
                    {[1,2,3,4,5].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/32?img=${i}`} 
                        alt="User" 
                       
                      />
                    ))}
                  </div>
                  <div>
                    <div>5,247+ Active</div>
                  </div>
                </div>
                <div>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} />
                  ))}
                  <span>4.9/5</span>
                </div>
              </div>

              {/* CTAs */}
              <div>
                <Link 
                  href="/trial-signup" 
                 
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  href="/demo" 
                 
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <div>
                <span>
                  <Check size={14} />
                  <span>No credit card</span>
                </span>
                <span>
                  <Shield size={14} />
                  <span>30-day guarantee</span>
                </span>
                <span>
                  <Clock size={14} />
                  <span>2-min setup</span>
                </span>
              </div>
            </div>

            {/* Right: Stats Dashboard Mockup */}
            <div>
              {/* Main Product Screenshot - Larger and more prominent */}
              <div>
                <div>
                  <h3>Instant Quote Generator</h3>
                  <span>LIVE</span>
                </div>
                
                {/* Mock Quote Interface - Condensed */}
                <div>
                  <div>
                    <div>Customer</div>
                    <div>Johnson Residence</div>
                  </div>
                  
                  <div>
                    <div>
                      <div>Time</div>
                      <div>28 sec</div>
                    </div>
                    <div>
                      <div>Total</div>
                      <div>$4,850</div>
                    </div>
                  </div>

                  <button>
                    Send to Customer
                  </button>
                </div>
              </div>

              {/* Floating Stats - Hidden on mobile, positioned better on desktop */}
              <div>
                <div>
                  <div>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div>+47%</div>
                    <div>More Jobs</div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div>32hrs</div>
                    <div>Saved/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Feature Grid with Images */}
      <section>
        <div>
          <div>
            <h2>
              Everything You Need to <span>Win More Jobs</span>
            </h2>
            <p>
              From instant quotes to customer management, we've got you covered
            </p>
          </div>

          <div>
            {/* Feature 1: Quote Creation */}
            <div>
              <div>
                <Image
                  src={featureImages.quoteCreation.src}
                  alt={featureImages.quoteCreation.alt}
                  title={featureImages.quoteCreation.title}
                  fill
                 
                />
              </div>
              <div>
                <div>
                  <Calculator size={20} />
                </div>
                <h3>Instant Quotes</h3>
              </div>
              <p>
                Create professional quotes in seconds with AI-powered calculations
              </p>
            </div>

            {/* Feature 2: Customer Meeting */}
            <div>
              <div>
                <Image
                  src={featureImages.customerMeeting.src}
                  alt={featureImages.customerMeeting.alt}
                  title={featureImages.customerMeeting.title}
                  fill
                 
                />
              </div>
              <div>
                <div>
                  <Users size={20} />
                </div>
                <h3>Customer Portal</h3>
              </div>
              <p>
                Let customers view, accept, and pay for quotes online
              </p>
            </div>

            {/* Feature 3: Project Planning */}
            <div>
              <div>
                <Image
                  src={featureImages.projectPlanning.src}
                  alt={featureImages.projectPlanning.alt}
                  title={featureImages.projectPlanning.title}
                  fill
                 
                />
              </div>
              <div>
                <div>
                  <BarChart3 size={20} />
                </div>
                <h3>Analytics</h3>
              </div>
              <p>
                Track revenue, conversion rates, and business growth
              </p>
            </div>

            {/* Feature 4: Team Work */}
            <div>
              <div>
                <Image
                  src={featureImages.teamWork.src}
                  alt={featureImages.teamWork.alt}
                  title={featureImages.teamWork.title}
                  fill
                 
                />
              </div>
              <div>
                <div>
                  <Smartphone size={20} />
                </div>
                <h3>Mobile Ready</h3>
              </div>
              <p>
                Create quotes on-site with any device, online or offline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Social Proof with Case Study Images */}
      <section>
        <div>
          <div>
            <h2>
              Real Results from <span>Real Contractors</span>
            </h2>
          </div>

          <div>
            {[
              {
                name: "Mike's Painting Co.",
                location: "Denver, CO",
                result: "340% Revenue Increase",
                quote: "We went from $150K to $500K in just 18 months. The speed of quoting changed everything.",
                image: professionalImages.caseStudies.satisfaction
              },
              {
                name: "Professional Painters LLC",
                location: "Austin, TX",
                result: "85% Time Saved",
                quote: "What used to take me 3 hours now takes 30 seconds. I can bid on 10x more jobs.",
                image: professionalImages.caseStudies.planning
              },
              {
                name: "Elite Coatings",
                location: "Miami, FL",
                result: "60% Close Rate",
                quote: "Professional quotes impress customers. Our close rate doubled in 90 days.",
                image: professionalImages.caseStudies.completion
              }
            ].map((testimonial, index) => (
              <div key={index}>
                <div>
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} success story`}
                    fill
                   
                  />
                  <div>
                    {testimonial.result}
                  </div>
                </div>
                <div>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} />
                  ))}
                </div>
                <p>"{testimonial.quote}"</p>
                <div>
                  <div>{testimonial.name}</div>
                  <div>{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Link 
              href="/painting-contractor-software-case-study"
             
            >
              Read Full Case Studies
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA with Image */}
      <section>
        <div>
          <Image
            src={professionalImages.hero.main}
            alt="Professional painter at work"
            fill
           
          />
          {/* Dark overlay for better text readability */}
          <div></div>
          <div></div>
        </div>
        <div>
          <h2>
            Ready to Transform Your Painting Business?
          </h2>
          <p>
            Join 5,247+ contractors who are winning more jobs with less effort
          </p>
          <div>
            <Link 
              href="/trial-signup" 
             
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/pricing" 
             
            >
              View Pricing
            </Link>
          </div>
          <p>
            No credit card required • 2-minute setup • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}