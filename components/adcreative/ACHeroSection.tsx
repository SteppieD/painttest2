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
              <svg>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
                <path d="M10 8L16 12L10 16V8Z" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              Watch 2-Min Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} color="#f59e0b" />
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

      
    </section>
  );
}