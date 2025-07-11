'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Star, Zap, Users } from 'lucide-react';
import Image from 'next/image';

export function ACHeroSection() {
  return (
    <section>
      <div>
        <div>
          {/* Trust Badge */}
          <div>
            <Star size={16} />
            <span>Trusted by 5,000+ Professional Contractors</span>
          </div>

          {/* Main Headline */}
          <h1>
            Create Winning Quotes
            <br />
            <span>14x Faster</span> with AI
          </h1>

          {/* Subtitle */}
          <p>
            Stop losing jobs to faster competitors. Generate professional painting quotes 
            in 30 seconds with 99% accuracy using our AI-powered estimation engine.
          </p>

          {/* Feature List */}
          <ul>
            <li>
              <Check size={20} />
              <span>Generate quotes in 30 seconds vs. 30 minutes</span>
            </li>
            <li>
              <Check size={20} />
              <span>99% accurate AI-powered calculations</span>
            </li>
            <li>
              <Check size={20} />
              <span>Win 40% more jobs with professional quotes</span>
            </li>
            <li>
              <Check size={20} />
              <span>No credit card required • Free forever plan</span>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div>
            <Link href="/trial-signup">
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link href="/demo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              Watch 2-Min Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p>4.9/5 from 500+ reviews</p>
          </div>
        </div>

        {/* Hero Visual */}
        <div>
          <div>
            <div>
              {/* Score Badge */}
              <div>
                <div>99</div>
                <div>/100</div>
                <div>Accuracy Score</div>
              </div>
              
              {/* Quote Preview */}
              <div>
                <div>
                  <h3>Professional Quote #QT-2024-001</h3>
                  <span>Ready in 30s</span>
                </div>
                
                <div>
                  <div>
                    <Users size={24} />
                  </div>
                  <div>
                    <h4>John Smith Residence</h4>
                    <p>3 Bedroom House • Interior & Exterior</p>
                  </div>
                </div>

                <div>
                  <div>
                    <span>Total Sq Ft</span>
                    <span>2,450</span>
                  </div>
                  <div>
                    <span>Estimated Hours</span>
                    <span>48</span>
                  </div>
                  <div>
                    <span>Total Quote</span>
                    <span>$4,850</span>
                  </div>
                </div>

                <div>
                  <button>
                    Send to Client
                  </button>
                  <button>
                    Edit Quote
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div>
              <Zap size={16} />
              <span>AI Powered</span>
            </div>
            
            <div>
              <div>14x</div>
              <div>Faster</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ac-hero-social-proof {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ac-hero-ratings {
          display: flex;
          gap: 2px;
        }

        .ac-hero-social-proof p {
          color: #d1d5db;
          font-size: 14px;
        }

        .ac-hero-mockup {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }

        .ac-quote-preview {
          padding: 32px;
        }

        .ac-quote-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .ac-quote-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .ac-quote-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          color: #15803d;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .ac-quote-client {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .ac-client-avatar {
          width: 48px;
          height: 48px;
          background: #e5e7eb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .ac-quote-client h4 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .ac-quote-client p {
          font-size: 14px;
          color: #6b7280;
        }

        .ac-quote-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .ac-quote-metric {
          text-align: center;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .ac-metric-highlight {
          background: #fef3c7;
          border-color: #fbbf24;
        }

        .ac-metric-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .ac-metric-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .ac-metric-highlight .ac-metric-value {
          color: #ef2b70;
        }

        .ac-quote-actions {
          display: flex;
          gap: 12px;
        }

        .ac-quote-actions .ac-btn {
          flex: 1;
        }

        .ac-floating-badge {
          position: absolute;
          background: white;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .ac-floating-badge svg {
          color: #f59e0b;
        }

        .ac-floating-stat {
          position: absolute;
          background: linear-gradient(135deg, #ef2b70 0%, #d91e5a 100%);
          padding: 20px 24px;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(239, 43, 112, 0.3);
          text-align: center;
          color: white;
        }

        .ac-stat-value {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        .ac-stat-label {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }

        @media (max-width: 1024px) {
          .ac-hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .ac-hero-visual {
            order: -1;
            margin-bottom: 48px;
          }

          .ac-hero-cta {
            justify-content: center;
          }

          .ac-hero-features {
            max-width: 600px;
            margin: 0 auto 32px;
          }

          .ac-floating-badge,
          .ac-floating-stat {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .ac-hero-cta {
            flex-direction: column;
            width: 100%;
          }

          .ac-hero-cta .ac-btn {
            width: 100%;
          }

          .ac-quote-details {
            grid-template-columns: 1fr;
          }

          .ac-quote-preview {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}