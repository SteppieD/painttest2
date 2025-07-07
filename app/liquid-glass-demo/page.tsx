"use client";

import { useState } from "react";
import { ArrowLeft, Palette, Download, Mail, Copy, Star, Award, CheckCircle } from "lucide-react";

export default function LiquidGlassDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('cards');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="liquid-glass-header">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="liquid-glass-button" style={{ padding: '8px' }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Apple Liquid Glass Demo</h1>
                <p className="text-sm text-gray-200">ProPaint Quote Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="liquid-glass-button liquid-glass-success">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="liquid-glass-button liquid-glass-info">
                <Mail className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Demo Navigation */}
        <div className="liquid-glass-nav mb-8">
          <div className="flex gap-2">
            {[
              { id: 'cards', label: 'Glass Cards' },
              { id: 'buttons', label: 'Glass Buttons' },
              { id: 'panels', label: 'Glass Panels' },
              { id: 'quote', label: 'Quote Preview' }
            ].map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`liquid-glass-button ${activeDemo === demo.id ? 'liquid-glass-info' : ''}`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glass Cards Demo */}
        {activeDemo === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="liquid-glass-card">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Basic Glass Card</h3>
                    <p className="text-sm text-gray-300">Standard glass effect</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm">
                  This demonstrates the base liquid glass card effect with backdrop blur and translucent layers.
                </p>
              </div>
            </div>

            <div className="liquid-glass-card liquid-glass-success">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Success Glass</h3>
                    <p className="text-sm text-gray-300">Completed quotes</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm">
                  Success variant with green glass tinting for completed projects and accepted quotes.
                </p>
              </div>
            </div>

            <div className="liquid-glass-card liquid-glass-warning">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Warning Glass</h3>
                    <p className="text-sm text-gray-300">Pending items</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm">
                  Warning variant with amber glass tinting for pending quotes and attention items.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Glass Buttons Demo */}
        {activeDemo === 'buttons' && (
          <div className="space-y-8">
            <div className="liquid-glass-panel">
              <h3 className="text-lg font-semibold text-white mb-4">Button Variations</h3>
              <div className="flex flex-wrap gap-4">
                <button className="liquid-glass-button">
                  <Copy className="w-4 h-4 mr-2" />
                  Standard Button
                </button>
                <button className="liquid-glass-button liquid-glass-success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success Action
                </button>
                <button className="liquid-glass-button liquid-glass-info">
                  <Mail className="w-4 h-4 mr-2" />
                  Info Action
                </button>
                <button className="liquid-glass-button liquid-glass-warning">
                  <Award className="w-4 h-4 mr-2" />
                  Warning Action
                </button>
              </div>
            </div>

            <div className="liquid-glass-panel">
              <h3 className="text-lg font-semibold text-white mb-4">Interactive Effects</h3>
              <p className="text-gray-200 mb-4">
                Hover over buttons to see the liquid glass shimmer effect and smooth transitions.
                The glass buttons feature specular highlights and dynamic background changes.
              </p>
              <div className="flex gap-4">
                <button className="liquid-glass-button" style={{ padding: '16px 32px' }}>
                  Large Button
                </button>
                <button className="liquid-glass-button liquid-glass-success" style={{ padding: '8px 16px' }}>
                  Small Button
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Glass Panels Demo */}
        {activeDemo === 'panels' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="liquid-glass-panel">
              <h3 className="text-lg font-semibold text-white mb-4">Dashboard Panel</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200">Total Quotes</span>
                  <span className="text-white font-semibold">$24,580</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-200">This Month</span>
                  <span className="text-white font-semibold">$8,340</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-200">Pending</span>
                  <span className="text-white font-semibold">3 quotes</span>
                </div>
              </div>
            </div>

            <div className="liquid-glass-quote">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quote Presentation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">Customer</span>
                    <span className="text-white">John Smith</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">Project</span>
                    <span className="text-white">Interior Painting</span>
                  </div>
                  <div className="liquid-glass-price p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Total Price</span>
                      <span className="text-white font-bold text-xl">$4,250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote Preview Demo */}
        {activeDemo === 'quote' && (
          <div className="liquid-glass-quote">
            <div className="liquid-glass-header p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Professional Quote</h2>
                    <p className="text-gray-200">Quote #PQ-2025-001</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Premium Service</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="liquid-glass-panel">
                  <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Customer:</span>
                      <span className="text-white">Sarah Johnson</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Address:</span>
                      <span className="text-white">123 Oak Street</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Project Type:</span>
                      <span className="text-white">Interior Painting</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Timeline:</span>
                      <span className="text-white">3-4 days</span>
                    </div>
                  </div>
                </div>

                <div className="liquid-glass-panel">
                  <h3 className="text-lg font-semibold text-white mb-4">Cost Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Materials:</span>
                      <span className="text-white">$1,240</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Labor:</span>
                      <span className="text-white">$2,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Equipment:</span>
                      <span className="text-white">$210</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total:</span>
                        <span className="text-white">$4,250</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="liquid-glass-price">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Final Quote</h3>
                    <p className="text-gray-200 text-sm">Professional painting services</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">$4,250</div>
                    <div className="text-sm text-gray-200">Valid for 30 days</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button className="liquid-glass-button liquid-glass-success" style={{ padding: '12px 32px' }}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Quote
                </button>
                <button className="liquid-glass-button">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="liquid-glass-fab">
        <Palette className="w-6 h-6" />
      </div>
    </div>
  );
}