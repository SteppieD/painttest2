'use client';

import React from 'react';
import { Check, Gift, Sparkles, Shield, Clock, Calculator, FileText, Smartphone, BarChart3, HeadphonesIcon } from 'lucide-react';

interface ValueItem {
  name: string;
  description: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}

export function ValueStackDisplay({ showTotal = true, variant = 'default' }: { showTotal?: boolean; variant?: 'default' | 'compact' }) {
  const valueItems: ValueItem[] = [
    {
      name: '10 Professional Quote Credits',
      description: 'Create stunning, branded quotes that win jobs',
      value: 97,
      icon: <FileText className="w-5 h-5" />,
      highlight: true
    },
    {
      name: 'AI-Powered ROI Calculator',
      description: 'See exactly how much revenue you can generate',
      value: 79,
      icon: <Calculator className="w-5 h-5" />
    },
    {
      name: 'Quote Template Library',
      description: '15+ proven templates for every job type',
      value: 67,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      name: 'Mobile App Forever',
      description: 'Quote from job sites, no laptop needed',
      value: 54,
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      name: 'Business Analytics Dashboard',
      description: 'Track win rates, revenue, and growth',
      value: 47,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: '30-Day Email Support',
      description: 'Get help when you need it',
      value: 29,
      icon: <HeadphonesIcon className="w-5 h-5" />
    }
  ];

  const totalValue = valueItems.reduce((sum, item) => sum + item.value, 0);

  if (variant === 'compact') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Gift className="w-6 h-6 text-green-600" />
          <h3 className="font-bold text-lg text-gray-900">Your Free Success Kit</h3>
          <span className="ml-auto text-sm font-medium text-green-600">
            ${totalValue} Value
          </span>
        </div>
        <ul className="space-y-2">
          {valueItems.slice(0, 4).map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>{item.name}</strong> (${item.value} value)
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-600 mt-3">
          + {valueItems.length - 4} more valuable tools included
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-green-500 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Free Contractor Success Kit</h3>
              <p className="text-sm text-white/90">Everything you need to dominate your market</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Total Value</p>
            <p className="text-2xl font-bold">${totalValue}</p>
          </div>
        </div>
      </div>

      {/* Value Items */}
      <div className="p-6">
        <ul className="space-y-4">
          {valueItems.map((item, index) => (
            <li 
              key={index} 
              className={`flex items-start gap-4 p-3 rounded-lg transition-all hover:bg-gray-50 ${
                item.highlight ? 'bg-green-50 border border-green-200' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.highlight ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600 ml-4">${item.value}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Total Section */}
        {showTotal && (
          <>
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Value of Your Free Kit:</p>
                  <p className="text-xs text-gray-500 mt-1">No credit card required • Yours to keep forever</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 line-through text-lg">${totalValue}</p>
                  <p className="text-3xl font-bold text-green-600">FREE</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Setup in 2 Minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}