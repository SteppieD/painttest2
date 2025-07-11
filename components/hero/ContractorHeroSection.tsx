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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
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
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p>
              "Was losing 2-3 jobs a week to faster competitors. Now I send quotes 
              before leaving the driveway. <strong>Made back the yearly cost in my first job.</strong>"
            </p>
            <div>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e5e7eb'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='18' font-weight='bold'%3EMJ%3C/text%3E%3C/svg%3E" alt="Mike Johnson" />
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

      <style jsx>{`
        .contractor-hero {
          background: #ffffff;
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 80px 0 40px;
        }

        /* Subtle construction pattern background */
        .contractor-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(234, 88, 12, 0.03) 35px,
              rgba(234, 88, 12, 0.03) 70px
            );
          pointer-events: none;
        }

        .contractor-hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .contractor-hero-content {
          color: #111827;
        }

        .contractor-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          animation: pulse 2s ease-in-out infinite;
        }

        .contractor-hero-badge.urgent {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .contractor-hero-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          color: #111827;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .highlight-orange {
          color: #ea580c;
          position: relative;
        }

        .highlight-orange::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 4px;
          background: #ea580c;
          opacity: 0.3;
        }

        .contractor-hero-subtitle {
          font-size: 20px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 32px;
        }

        .contractor-hero-subtitle strong {
          color: #111827;
          font-weight: 700;
        }

        .contractor-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .contractor-stat {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: #fef3c7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ea580c;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .contractor-benefits {
          list-style: none;
          margin-bottom: 32px;
        }

        .contractor-benefits li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 16px;
          color: #4b5563;
        }

        .contractor-benefits li svg {
          color: #059669;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contractor-benefits strong {
          color: #111827;
        }

        .contractor-cta-section {
          margin-bottom: 32px;
        }

        .contractor-cta-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .contractor-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }

        .contractor-btn-primary {
          background: #ea580c;
          color: white;
        }

        .contractor-btn-primary:hover {
          background: #c2410c;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(234, 88, 12, 0.3);
        }

        .contractor-btn-secondary {
          background: white;
          color: #111827;
          border: 2px solid #e5e7eb;
        }

        .contractor-btn-secondary:hover {
          border-color: #ea580c;
          color: #ea580c;
        }

        .contractor-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #059669;
          font-weight: 600;
        }

        .contractor-testimonial {
          background: #f9fafb;
          border-left: 4px solid #ea580c;
          padding: 24px;
          border-radius: 8px;
        }

        .testimonial-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 12px;
        }

        .testimonial-quote {
          font-size: 16px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 16px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testimonial-author img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .author-name {
          font-weight: 700;
          color: #111827;
          font-size: 14px;
        }

        .author-company {
          font-size: 12px;
          color: #6b7280;
        }

        /* Visual Side */
        .contractor-hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .contractor-mockup {
          position: relative;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .roi-calculator-preview {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 32px;
          width: 400px;
        }

        .calculator-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        }

        .calculator-header svg {
          color: #059669;
        }

        .calculator-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .calculator-metrics {
          margin-bottom: 24px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .metric-row.highlight {
          background: #fef3c7;
          margin: 0 -16px;
          padding: 12px 16px;
          border-radius: 8px;
          border: none;
        }

        .metric-label {
          color: #6b7280;
          font-size: 14px;
        }

        .metric-value {
          font-weight: 700;
          color: #111827;
          font-size: 18px;
        }

        .metric-row.highlight .metric-value {
          color: #ea580c;
          font-size: 24px;
        }

        .calculator-comparison {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .comparison-item {
          text-align: center;
        }

        .comparison-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .comparison-time {
          display: block;
          font-weight: 700;
        }

        .comparison-item.old .comparison-time {
          color: #ef4444;
        }

        .comparison-item.new .comparison-time {
          color: #059669;
        }

        .comparison-arrow {
          font-size: 24px;
          color: #9ca3af;
        }

        .floating-badge {
          position: absolute;
          background: white;
          padding: 8px 16px;
          border-radius: 999px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          animation: float 4s ease-in-out infinite;
        }

        .floating-badge.verified {
          top: -20px;
          right: -40px;
          color: #059669;
          border: 2px solid #059669;
        }

        .floating-counter {
          position: absolute;
          bottom: -20px;
          left: -60px;
          background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(234, 88, 12, 0.3);
          text-align: center;
          color: white;
          animation: float 5s ease-in-out infinite;
        }

        .counter-value {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        .counter-label {
          font-size: 12px;
          opacity: 0.9;
          margin-top: 4px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .contractor-hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .contractor-stats-grid {
            justify-content: center;
            max-width: 500px;
            margin: 0 auto 32px;
          }

          .contractor-benefits {
            max-width: 600px;
            margin: 0 auto 32px;
            text-align: left;
          }

          .contractor-cta-buttons {
            justify-content: center;
          }

          .contractor-hero-visual {
            margin-top: 48px;
          }

          .floating-badge,
          .floating-counter {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .contractor-hero-container {
            padding: 0 16px;
          }

          .contractor-stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .contractor-cta-buttons {
            flex-direction: column;
          }

          .contractor-btn {
            width: 100%;
            justify-content: center;
          }

          .roi-calculator-preview {
            width: 100%;
            max-width: 350px;
          }
        }
      `}</style>
    </section>
  );
}