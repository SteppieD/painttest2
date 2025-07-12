import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Brain, 
  Clock, 
  Smartphone, 
  TrendingUp, 
  Zap, 
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Calculator,
  Sparkles,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'AI Painting Quote Generator | Instant Professional Estimates | ProPaint Quote',
  description: 'Generate professional painting quotes instantly with AI. No manual calculations. Accurate estimates in seconds. Try our AI painting quote generator free.',
  keywords: 'painting quote generator, ai painting quote, automated painting estimates, ai quote generator, painting estimate ai, smart painting quotes',
  openGraph: {
    title: 'AI Painting Quote Generator | Instant Professional Estimates',
    description: 'Generate professional painting quotes instantly with AI. No manual calculations required.',
    type: 'website',
  },
};

export default function PaintingQuoteGeneratorAIPage() {
  return (
    <div>

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <Sparkles />
              AI-Powered Technology
            </div>
          </div>
          
          <h1>
            <span>AI Painting Quote</span> Generator
          </h1>
          <p>
            Generate professional painting quotes instantly with artificial intelligence. No manual calculations, no guesswork – just accurate estimates in seconds.
          </p>
          
          <div>
            <Link href="/trial-signup">
              <Brain />
              Try AI Quote Generator Free
              <ArrowRight />
            </Link>
            <p>Free AI quotes • No credit card required • Instant results</p>
          </div>

          <div>
            <div>
              <Zap />
              <div>Instant Quotes</div>
              <div>AI generates quotes in under 30 seconds</div>
            </div>
            <div>
              <Brain />
              <div>Smart Analysis</div>
              <div>AI learns from millions of painting projects</div>
            </div>
            <div>
              <TrendingUp />
              <div>95% Accuracy</div>
              <div>More accurate than manual calculations</div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section>
        <div>
          <div>
            <h2>How Our AI Quote Generator Works</h2>
            <p>Advanced artificial intelligence analyzes your project details and generates professional quotes instantly</p>
          </div>

          <div>
            <div>
              <div>
                <span>1</span>
              </div>
              <h3>Input Project Details</h3>
              <p>Simply describe your painting project – room dimensions, surfaces, and preferences. Our conversational AI guides you through the process.</p>
            </div>

            <div>
              <div>
                <Brain />
              </div>
              <h3>AI Analysis</h3>
              <p>Our AI analyzes your project using data from thousands of painting jobs, industry standards, and current material costs.</p>
            </div>

            <div>
              <div>
                <CheckCircle />
              </div>
              <h3>Professional Quote</h3>
              <p>Receive a detailed, professional quote with material lists, labor estimates, and total costs – ready to send to your customer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section>
        <div>
          <div>
            <h2>AI-Powered Features</h2>
            <p>Advanced artificial intelligence that thinks like an experienced painter</p>
          </div>

          <div>
            <div>
              <Lightbulb />
              <h3>Smart Room Analysis</h3>
              <p>AI automatically calculates surface areas, identifies prep work needs, and recommends paint quantities based on room characteristics.</p>
              <ul>
                <li>• Automatic area calculations</li>
                <li>• Prep work assessment</li>
                <li>• Paint coverage optimization</li>
              </ul>
            </div>

            <div>
              <Brain />
              <h3>Intelligent Pricing</h3>
              <p>AI considers local market rates, material costs, and project complexity to suggest competitive yet profitable pricing.</p>
              <ul>
                <li>• Market-aware pricing</li>
                <li>• Profit margin optimization</li>
                <li>• Competitive analysis</li>
              </ul>
            </div>

            <div>
              <BarChart3 />
              <h3>Learning Algorithm</h3>
              <p>Our AI continuously learns from successful quotes and industry data to improve accuracy and recommendations.</p>
              <ul>
                <li>• Continuous improvement</li>
                <li>• Industry data integration</li>
                <li>• Pattern recognition</li>
              </ul>
            </div>

            <div>
              <Clock />
              <h3>Instant Generation</h3>
              <p>Generate detailed quotes in under 30 seconds. What used to take hours now takes moments.</p>
              <ul>
                <li>• 30-second quotes</li>
                <li>• Real-time processing</li>
                <li>• Immediate delivery</li>
              </ul>
            </div>

            <div>
              <Smartphone />
              <h3>Mobile AI Assistant</h3>
              <p>Access AI quote generation on any device. Create quotes on-site during customer consultations.</p>
              <ul>
                <li>• Mobile-optimized AI</li>
                <li>• On-site quote generation</li>
                <li>• Offline capability</li>
              </ul>
            </div>

            <div>
              <Shield />
              <h3>Quality Assurance</h3>
              <p>AI validates quotes for accuracy and completeness before delivery, ensuring professional standards.</p>
              <ul>
                <li>• Automatic validation</li>
                <li>• Error detection</li>
                <li>• Professional formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section>
        <div>
          <div>
            <h2>Traditional Estimating vs AI-Powered Quotes</h2>
            <p>See the dramatic difference AI makes in your quoting process</p>
          </div>

          <div>
            <div>
              <h3>❌ Traditional Manual Estimating</h3>
              <ul>
                <li>
                  <div>•</div>
                  <div><strong>2-4 hours per quote</strong> - Measuring, calculating, researching prices</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Math errors common</strong> - Manual calculations lead to mistakes</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Outdated pricing</strong> - Hard to keep track of current material costs</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Inconsistent format</strong> - Each quote looks different</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Lost opportunities</strong> - Slow response loses customers</div>
                </li>
              </ul>
            </div>

            <div>
              <h3>✅ AI-Powered Quote Generation</h3>
              <ul>
                <li>
                  <div>•</div>
                  <div><strong>30 seconds per quote</strong> - AI handles all calculations instantly</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>95% accuracy guaranteed</strong> - AI eliminates human error</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Real-time pricing</strong> - AI updates with current market rates</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Professional templates</strong> - Consistent, branded presentation</div>
                </li>
                <li>
                  <div>•</div>
                  <div><strong>Instant delivery</strong> - Respond to leads immediately</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <h2>Contractors Love Our AI Technology</h2>
          
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "The AI quote generator is like having an experienced estimator working 24/7. It's incredibly accurate and saves me hours every day. My customers are impressed with the speed and professionalism."
              </p>
              <div>David Chen</div>
              <div>Premier Painting Services</div>
            </div>

            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "I was skeptical about AI at first, but this tool has transformed my business. I can now provide quotes during the initial consultation, which has increased my closing rate by 60%."
              </p>
              <div>Maria Rodriguez</div>
              <div>Rodriguez Painting Co.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Experience the Future of Painting Quotes</h2>
          <p>Try our AI quote generator free and see why contractors are switching to automated estimating</p>
          
          <div>
            <Link href="/trial-signup">
              <Brain />
              Try AI Generator Free
              <ArrowRight />
            </Link>
            <Link href="/painting-estimate-calculator">
              See Live Demo
            </Link>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>Free AI quotes included</span>
            </div>
            <div>
              <CheckCircle />
              <span>No credit card required</span>
            </div>
            <div>
              <CheckCircle />
              <span>Instant activation</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}