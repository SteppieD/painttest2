"use client";

import { useState } from "react";
import { ArrowLeft, Palette, Download, Mail, Copy, Star, Award, CheckCircle } from "lucide-react";

export default function LiquidGlassDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('cards');

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <button>
                <ArrowLeft />
              </button>
              <div>
                <h1>Apple Liquid Glass Demo</h1>
                <p>ProPaint Quote Platform</p>
              </div>
            </div>
            
            <div>
              <button>
                <Download />
                Export
              </button>
              <button>
                <Mail />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Demo Navigation */}
        <div>
          <div>
            {[
              { id: 'cards', label: 'Glass Cards' },
              { id: 'buttons', label: 'Glass Buttons' },
              { id: 'panels', label: 'Glass Panels' },
              { id: 'quote', label: 'Quote Preview' }
            ].map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glass Cards Demo */}
        {activeDemo === 'cards' && (
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <Palette />
                  </div>
                  <div>
                    <h3>Basic Glass Card</h3>
                    <p>Standard glass effect</p>
                  </div>
                </div>
                <p>
                  This demonstrates the base liquid glass card effect with backdrop blur and translucent layers.
                </p>
              </div>
            </div>

            <div>
              <div>
                <div>
                  <div>
                    <CheckCircle />
                  </div>
                  <div>
                    <h3>Success Glass</h3>
                    <p>Completed quotes</p>
                  </div>
                </div>
                <p>
                  Success variant with green glass tinting for completed projects and accepted quotes.
                </p>
              </div>
            </div>

            <div>
              <div>
                <div>
                  <div>
                    <Award />
                  </div>
                  <div>
                    <h3>Warning Glass</h3>
                    <p>Pending items</p>
                  </div>
                </div>
                <p>
                  Warning variant with amber glass tinting for pending quotes and attention items.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Glass Buttons Demo */}
        {activeDemo === 'buttons' && (
          <div>
            <div>
              <h3>Button Variations</h3>
              <div>
                <button>
                  <Copy />
                  Standard Button
                </button>
                <button>
                  <CheckCircle />
                  Success Action
                </button>
                <button>
                  <Mail />
                  Info Action
                </button>
                <button>
                  <Award />
                  Warning Action
                </button>
              </div>
            </div>

            <div>
              <h3>Interactive Effects</h3>
              <p>
                Hover over buttons to see the liquid glass shimmer effect and smooth transitions.
                The glass buttons feature specular highlights and dynamic background changes.
              </p>
              <div>
                <button>
                  Large Button
                </button>
                <button>
                  Small Button
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Glass Panels Demo */}
        {activeDemo === 'panels' && (
          <div>
            <div>
              <h3>Dashboard Panel</h3>
              <div>
                <div>
                  <span>Total Quotes</span>
                  <span>$24,580</span>
                </div>
                <div>
                  <span>This Month</span>
                  <span>$8,340</span>
                </div>
                <div>
                  <span>Pending</span>
                  <span>3 quotes</span>
                </div>
              </div>
            </div>

            <div>
              <div>
                <h3>Quote Presentation</h3>
                <div>
                  <div>
                    <span>Customer</span>
                    <span>John Smith</span>
                  </div>
                  <div>
                    <span>Project</span>
                    <span>Interior Painting</span>
                  </div>
                  <div>
                    <div>
                      <span>Total Price</span>
                      <span>$4,250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote Preview Demo */}
        {activeDemo === 'quote' && (
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <Palette />
                  </div>
                  <div>
                    <h2>Professional Quote</h2>
                    <p>Quote #PQ-2025-001</p>
                  </div>
                </div>
                <div>
                  <Star />
                  <span>Premium Service</span>
                </div>
              </div>
            </div>

            <div>
              <div>
                <div>
                  <h3>Project Details</h3>
                  <div>
                    <div>
                      <span>Customer:</span>
                      <span>Sarah Johnson</span>
                    </div>
                    <div>
                      <span>Address:</span>
                      <span>123 Oak Street</span>
                    </div>
                    <div>
                      <span>Project Type:</span>
                      <span>Interior Painting</span>
                    </div>
                    <div>
                      <span>Timeline:</span>
                      <span>3-4 days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3>Cost Breakdown</h3>
                  <div>
                    <div>
                      <span>Materials:</span>
                      <span>$1,240</span>
                    </div>
                    <div>
                      <span>Labor:</span>
                      <span>$2,800</span>
                    </div>
                    <div>
                      <span>Equipment:</span>
                      <span>$210</span>
                    </div>
                    <div>
                      <div>
                        <span>Total:</span>
                        <span>$4,250</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div>
                    <h3>Final Quote</h3>
                    <p>Professional painting services</p>
                  </div>
                  <div>
                    <div>$4,250</div>
                    <div>Valid for 30 days</div>
                  </div>
                </div>
              </div>

              <div>
                <button>
                  <CheckCircle />
                  Accept Quote
                </button>
                <button>
                  <Download />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div>
        <Palette />
      </div>
    </div>
  );
}