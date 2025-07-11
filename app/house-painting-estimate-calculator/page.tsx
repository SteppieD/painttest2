import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Home, 
  Calculator, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Star,
  ArrowRight,
  Palette,
  Ruler,
  PaintBucket,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'House Painting Estimate Calculator | Residential Painting Cost Calculator | ProPaint Quote',
  description: 'Free house painting estimate calculator. Get accurate residential painting costs instantly. Professional estimates for interior and exterior house painting.',
  keywords: 'house painting estimate, house painter estimate, residential painting calculator, house painting cost calculator, home painting estimate',
  openGraph: {
    title: 'House Painting Estimate Calculator | Residential Painting Costs',
    description: 'Get accurate house painting estimates instantly with our free residential painting calculator.',
    type: 'website',
  },
};

export default function HousePaintingEstimateCalculatorPage() {
  return (
    <div>
      {/* Header */}
      <header>
        <div>
          <div>
            <Link href="/">
              <Palette />
              <span>ProPaint Quote</span>
            </Link>
            <nav>
              <Link href="/painting-estimate-calculator">Calculator</Link>
              <Link href="/painting-quote-templates">Templates</Link>
              <Link href="/trial-signup">Free Calculator</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            <span>House Painting</span> Estimate Calculator
          </h1>
          <p>
            Get accurate residential painting estimates instantly. Calculate interior and exterior house painting costs with our professional calculator used by contractors nationwide.
          </p>
          <div>
            <Link href="/trial-signup">
              <Calculator />
              Calculate House Painting Cost
              <ArrowRight />
            </Link>
            <p>Free estimates • Professional accuracy • Instant results</p>
          </div>
          
          <div>
            <div>
              <Home />
              <div>Residential Focus</div>
              <div>Designed specifically for house painting</div>
            </div>
            <div>
              <Clock />
              <div>2-Minute Estimates</div>
              <div>Get accurate costs in just minutes</div>
            </div>
            <div>
              <DollarSign />
              <div>100% Free</div>
              <div>No hidden fees or signup required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Features */}
      <section>
        <div>
          <div>
            <h2>Accurate House Painting Estimates</h2>
            <p>Professional-grade calculator that considers all aspects of residential painting projects</p>
          </div>

          <div>
            <div>
              <h3>What Our Calculator Includes:</h3>
              <div>
                <div>
                  <CheckCircle />
                  <div>
                    <h4>Room-by-Room Analysis</h4>
                    <p>Calculate each room separately for maximum accuracy</p>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <h4>Interior & Exterior</h4>
                    <p>Separate calculations for indoor and outdoor painting</p>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <h4>Paint & Labor Costs</h4>
                    <p>Complete breakdown of materials and labor</p>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <h4>Local Market Rates</h4>
                    <p>Pricing adjusted for your geographic area</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3>Sample House Estimates</h3>
              <div>
                <div>
                  <div>
                    <div>
                      <h4>Small House (1,200 sq ft)</h4>
                      <p>Interior painting, 3 bedrooms</p>
                    </div>
                    <div>$2,800-$4,200</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <h4>Medium House (2,000 sq ft)</h4>
                      <p>Full interior & exterior</p>
                    </div>
                    <div>$6,500-$9,800</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <h4>Large House (3,500 sq ft)</h4>
                      <p>Premium paint, full service</p>
                    </div>
                    <div>$12,000-$18,500</div>
                  </div>
                </div>
              </div>
              <p>*Estimates vary by location, paint quality, and project scope</p>
            </div>
          </div>
        </div>
      </section>

      {/* House Painting Types */}
      <section>
        <div>
          <div>
            <h2>Types of House Painting We Calculate</h2>
            <p>Comprehensive estimates for all residential painting projects</p>
          </div>

          <div>
            <div>
              <Home />
              <h3>Interior House Painting</h3>
              <ul>
                <li>• Living rooms and bedrooms</li>
                <li>• Kitchens and bathrooms</li>
                <li>• Hallways and staircases</li>
                <li>• Ceilings and trim work</li>
              </ul>
            </div>

            <div>
              <Shield />
              <h3>Exterior House Painting</h3>
              <ul>
                <li>• Siding and walls</li>
                <li>• Trim and shutters</li>
                <li>• Doors and windows</li>
                <li>• Decks and fencing</li>
              </ul>
            </div>

            <div>
              <PaintBucket />
              <h3>Specialty Painting</h3>
              <ul>
                <li>• Cabinet refinishing</li>
                <li>• Accent walls</li>
                <li>• Garage floors</li>
                <li>• Deck staining</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section>
        <div>
          <div>
            <h2>How to Calculate Your House Painting Cost</h2>
            <p>Simple 4-step process to get accurate estimates</p>
          </div>

          <div>
            <div>
              <div>
                <Ruler />
              </div>
              <h3>1. Measure Rooms</h3>
              <p>Enter the dimensions of each room you want painted</p>
            </div>

            <div>
              <div>
                <Home />
              </div>
              <h3>2. Select Surfaces</h3>
              <p>Choose walls, ceilings, trim, or exterior surfaces</p>
            </div>

            <div>
              <div>
                <PaintBucket />
              </div>
              <h3>3. Choose Paint Quality</h3>
              <p>Select from good, better, or premium paint options</p>
            </div>

            <div>
              <div>
                <Calculator />
              </div>
              <h3>4. Get Estimate</h3>
              <p>Receive detailed cost breakdown and professional quote</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <h2>Homeowners Trust Our Calculator</h2>
          
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "The house painting calculator gave me exactly what I needed to budget for our home renovation. The estimate was spot-on compared to the actual quotes I received from contractors."
              </p>
              <div>Lisa Thompson</div>
              <div>Homeowner, Austin TX</div>
            </div>

            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "I used this to plan my painting budget before getting contractor quotes. It helped me understand the costs and negotiate better. Highly accurate and easy to use!"
              </p>
              <div>Robert Chen</div>
              <div>Homeowner, Seattle WA</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Get Your House Painting Estimate Now</h2>
          <p>Calculate accurate painting costs for your home in just 2 minutes</p>
          
          <div>
            <Link href="/trial-signup">
              <Calculator />
              Start Free Calculator
              <ArrowRight />
            </Link>
            <Link href="/painting-quote-templates">
              Get Quote Templates
            </Link>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>100% Free calculator</span>
            </div>
            <div>
              <CheckCircle />
              <span>No signup required</span>
            </div>
            <div>
              <CheckCircle />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <div>
            <div>
              <div>
                <Palette />
                <span>ProPaint Quote</span>
              </div>
              <p>Free house painting calculator for accurate residential painting estimates. Used by homeowners nationwide.</p>
            </div>
            <div>
              <h3>Calculators</h3>
              <ul>
                <li><Link href="/painting-estimate-calculator">Painting Calculator</Link></li>
                <li><Link href="/commercial-painting-estimating">Commercial Calculator</Link></li>
                <li><Link href="/trial-signup">Professional Tools</Link></li>
              </ul>
            </div>
            <div>
              <h3>Resources</h3>
              <ul>
                <li><Link href="/painting-quote-templates">Quote Templates</Link></li>
                <li><Link href="/how-to-quote-painting-jobs">Quoting Guide</Link></li>
                <li><Link href="/painting-business-software">Business Software</Link></li>
              </ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/support">Support</Link></li>
              </ul>
            </div>
          </div>
          <div>
            <p>&copy; 2024 ProPaint Quote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}