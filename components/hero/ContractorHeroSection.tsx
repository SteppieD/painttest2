'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Star, TrendingUp, Shield, Users, Clock, Award, DollarSign } from 'lucide-react';

export function ContractorHeroSection() {
  return (
    <section>
      <div>
        <div>
          {/* Urgency/Scarcity Badge - CIALDINI */}
          <div>
            <Clock size={16} />
            <span>Limited Time: Lock in 2024 Pricing (Increases Jan 1st)</span>
          </div>

          {/* Main Headline - Loss Aversion + Clear Value */}
          <h1>
            Stop Losing $50,000+ in Jobs
            <br />
            to Contractors Who Quote
            <br />
            <span>3 Days Faster</span>
          </h1>

          {/* Specific Problem/Solution Statement */}
          <p>
            Your competitors use AI to send quotes in 30 seconds while you're 
            still measuring. <strong>Join 5,247 contractors</strong> who now win 
            40% more bids with instant, accurate quotes.
          </p>

          {/* Social Proof Numbers - CIALDINI */}
          <div>
            <div>
              <div>
                <TrendingUp size={24} />
              </div>
              <div>
                <div>$2.4M+</div>
                <div>Additional Revenue Generated</div>
              </div>
            </div>
            <div>
              <div>
                <Users size={24} />
              </div>
              <div>
                <div>5,247</div>
                <div>Active Contractors</div>
              </div>
            </div>
            <div>
              <div>
                <Award size={24} />
              </div>
              <div>
                <div>4.9/5</div>
                <div>Contractor Rating</div>
              </div>
            </div>
          </div>

          {/* Clear Benefits List */}
          <ul>
            <li>
              <Check size={20} />
              <span><strong>30-second quotes</strong> vs. 3 days (win jobs before competitors even measure)</span>
            </li>
            <li>
              <Check size={20} />
              <span><strong>99.2% accuracy</strong> verified by 50,000+ completed jobs</span>
            </li>
            <li>
              <Check size={20} />
              <span><strong>Win 40% more jobs</strong> with professional, branded quotes</span>
            </li>
            <li>
              <Check size={20} />
              <span><strong>ROI in first week</strong> - average contractor saves 20 hours/month</span>
            </li>
          </ul>

          {/* CTA with Reciprocity - CIALDINI */}
          <div>
            <div>
              <Link href="/trial-signup">
                Start Free - No Card Required
                <ArrowRight size={20} />
              </Link>
              <Link href="/demo">
                <svg>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
                  <path d="M10 8L16 12L10 16V8Z" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                See 2-Min Demo
              </Link>
            </div>
            <p>
              <Shield size={16} />
              30-day money back + We'll pay you $500 if it doesn't save you time
            </p>
          </div>

          {/* Testimonial - CIALDINI Liking */}
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="#f59e0b" />
              ))}
            </div>
            <p>
              "Was losing 2-3 jobs a week to faster competitors. Now I send quotes 
              before leaving the driveway. <strong>Made back the yearly cost in my first job.</strong>"
            </p>
            <div>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-family='Arial' font-size='18' font-weight='bold'%3EMJ%3C/text%3E%3C/svg%3E" alt="Mike Johnson" />
              <div>
                <p>Mike Johnson</p>
                <p>Johnson Painting, LLC • Dallas, TX</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual - Show the actual product */}
        <div>
          <div>
            {/* ROI Calculator Preview */}
            <div>
              <div>
                <DollarSign size={20} />
                <h3>Your Monthly Savings</h3>
              </div>
              
              <div>
                <div>
                  <span>Time Saved:</span>
                  <span>32 hours</span>
                </div>
                <div>
                  <span>Extra Jobs Won:</span>
                  <span>8-12 jobs</span>
                </div>
                <div>
                  <span>Revenue Increase:</span>
                  <span>$18,500</span>
                </div>
              </div>

              <div>
                <div>
                  <span>Old Way</span>
                  <span>3 days/quote</span>
                </div>
                <div>→</div>
                <div>
                  <span>With AI</span>
                  <span>30 seconds</span>
                </div>
              </div>
            </div>

            {/* Floating proof elements */}
            <div>
              <Shield size={16} />
              <span>BBB A+ Rated</span>
            </div>
            
            <div>
              <div>12,847</div>
              <div>Quotes Today</div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}