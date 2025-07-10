'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Star, TrendingUp, Shield, Users, Clock, Award, DollarSign, Gift, Sparkles, AlertCircle } from 'lucide-react';

export function EnhancedContractorHero() {
  // Live activity simulation
  const [liveActivity, setLiveActivity] = useState({
    quotesCreated: 12847,
    activeNow: 247,
    lastQuote: { name: 'Mike from Dallas', amount: '$4,200', time: '2 min ago' }
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(prev => ({
        quotesCreated: prev.quotesCreated + Math.floor(Math.random() * 3),
        activeNow: prev.activeNow + Math.floor(Math.random() * 5) - 2,
        lastQuote: {
          name: ['Sarah from Phoenix', 'Tom from Miami', 'John from Austin', 'Lisa from Denver'][Math.floor(Math.random() * 4)],
          amount: `$${(Math.random() * 8000 + 2000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          time: '1 min ago'
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="contractor-hero bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Live Activity Badge - SOCIAL PROOF */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-sm font-medium text-green-800">
                {liveActivity.activeNow} contractors creating quotes right now
              </span>
            </div>

            {/* Value Stack Hero - RECIPROCITY */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Get <span className="text-green-600">$297 Worth</span> of
                <br />
                Professional Tools
                <br />
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-yellow-300 -skew-x-12 rounded"></span>
                  <span className="relative px-2">100% FREE</span>
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Join <strong className="text-gray-900">5,247 contractors</strong> who create 
                professional quotes in 30 seconds, not 3 days. 
                <span className="block mt-2 text-green-600 font-semibold">
                  Win 40% more jobs starting today.
                </span>
              </p>
            </div>

            {/* Free Value Stack - RECIPROCITY */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Your Free Contractor Success Kit:</h3>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>10 Professional Quote Credits</strong> 
                    <span className="text-gray-600"> - Create stunning quotes ($97 value)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>AI-Powered ROI Calculator</strong>
                    <span className="text-gray-600"> - See your revenue potential ($79 value)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Quote Template Library</strong>
                    <span className="text-gray-600"> - 15+ proven templates ($67 value)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Mobile App Forever</strong>
                    <span className="text-gray-600"> - Quote from job sites ($54 value)</span>
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Value:</span>
                  <div>
                    <span className="text-gray-400 line-through">$297</span>
                    <span className="text-2xl font-bold text-green-600 ml-2">FREE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/trial-signup" className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                Get Your Free Success Kit
                <Sparkles className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/demo" className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:border-gray-400 transition-all">
                Watch 2-Min Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                30-day money back
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                4.9/5 rating (2,847 reviews)
              </span>
            </div>

            {/* Live Social Proof - SOCIAL PROOF */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm">
                  <strong>{liveActivity.lastQuote.name}</strong> just created a{' '}
                  <strong className="text-green-600">{liveActivity.lastQuote.amount}</strong> quote{' '}
                  <span className="text-gray-600">({liveActivity.lastQuote.time})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main Visual Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Potential Monthly Revenue Increase
                </h3>
                <div className="text-5xl font-bold text-green-600">+$18,500</div>
                <p className="text-gray-600 mt-2">Based on winning 40% more jobs</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Time saved per month:</span>
                  <span className="font-bold text-gray-900">32 hours</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Additional jobs won:</span>
                  <span className="font-bold text-gray-900">8-12 jobs</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium">Your ROI:</span>
                  <span className="font-bold text-green-600 text-xl">2,340%</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm transform rotate-12 z-20">
              Save 20% Today
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                  <div className="text-sm text-gray-600">Just saved 3 hours!</div>
                </div>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl transform rotate-3 z-0"></div>
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-16 py-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span><strong className="text-gray-900">5,247</strong> Active Contractors</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span><strong className="text-gray-900">$73M+</strong> Quotes Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span><strong className="text-gray-900">{liveActivity.quotesCreated.toLocaleString()}</strong> Quotes Created Today</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span><strong className="text-gray-900">BBB A+</strong> Rated Business</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}