import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Smartphone, 
  Calculator, 
  Download, 
  Wifi, 
  Clock, 
  Camera,
  CheckCircle,
  Star,
  ArrowRight,
  Palette,
  Zap,
  Shield,
  MapPin,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mobile Painting Estimate App | Field Estimates on iPhone & Android | ProPaint Quote',
  description: 'Professional mobile painting estimate app for contractors. Create accurate quotes on-site with iPhone and Android. Works offline. Download free painting estimator app.',
  keywords: 'mobile painting estimate app, painting estimate app, field estimating app, mobile painting calculator, on-site painting quotes, contractor mobile app',
  openGraph: {
    title: 'Mobile Painting Estimate App | Field Estimates on iPhone & Android',
    description: 'Professional mobile painting estimate app for contractors. Create accurate quotes on-site with iPhone and Android.',
    type: 'website',
  },
};

export default function MobilePaintingEstimateAppPage() {
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
              <Link href="/trial-signup">Download App</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <Smartphone />
              Mobile-First Design
            </div>
          </div>
          
          <h1>
            <span>Mobile Painting</span> Estimate App
          </h1>
          <p>
            Create professional painting quotes directly on-site with your iPhone or Android. Superior speed to quote with accurate estimates in minutes, even without internet connection.
          </p>
          
          <div>
            <Link href="/trial-signup">
              <Download />
              Download Free Mobile App
              <ArrowRight />
            </Link>
            <p>iPhone & Android • Works offline • Free forever</p>
          </div>

          <div>
            <div>
              <Zap />
              <div>Field Ready</div>
              <div>Quote jobs on-site during customer walks</div>
            </div>
            <div>
              <Wifi />
              <div>Works Offline</div>
              <div>No internet required for calculations</div>
            </div>
            <div>
              <Clock />
              <div>3-Min Quotes</div>
              <div>Fastest mobile quote generation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Specific Features */}
      <section>
        <div>
          <div>
            <h2>Built for Contractors in the Field</h2>
            <p>Mobile-first features designed specifically for on-site estimating and customer interactions</p>
          </div>

          <div>
            <div>
              <Smartphone />
              <h3>Touch-Optimized Interface</h3>
              <p>Large buttons and intuitive gestures make estimating fast and error-free on any screen size.</p>
              <ul>
                <li>• Large touch targets</li>
                <li>• Gesture-based navigation</li>
                <li>• Portrait/landscape modes</li>
                <li>• Dark mode for outdoor use</li>
              </ul>
            </div>

            <div>
              <Camera />
              <h3>Photo Documentation</h3>
              <p>Capture job site photos and attach them to quotes for professional documentation and follow-up.</p>
              <ul>
                <li>• In-app photo capture</li>
                <li>• Image annotation tools</li>
                <li>• Before/after comparisons</li>
                <li>• Cloud photo storage</li>
              </ul>
            </div>

            <div>
              <MapPin />
              <h3>GPS & Location</h3>
              <p>Automatically tag quotes with GPS coordinates and get directions to customer locations.</p>
              <ul>
                <li>• Automatic GPS tagging</li>
                <li>• Built-in navigation</li>
                <li>• Location-based pricing</li>
                <li>• Route optimization</li>
              </ul>
            </div>

            <div>
              <Wifi />
              <h3>Offline Capability</h3>
              <p>Create complete quotes without internet. Perfect for basements, remote areas, or poor signal locations.</p>
              <ul>
                <li>• Full offline functionality</li>
                <li>• Local data storage</li>
                <li>• Sync when connected</li>
                <li>• No data usage worries</li>
              </ul>
            </div>

            <div>
              <Calculator />
              <h3>Voice Input</h3>
              <p>Speak measurements and room details for hands-free data entry while walking through properties.</p>
              <ul>
                <li>• Speech-to-text entry</li>
                <li>• Voice measurement input</li>
                <li>• Hands-free operation</li>
                <li>• Multi-language support</li>
              </ul>
            </div>

            <div>
              <Users />
              <h3>Customer Signatures</h3>
              <p>Get instant approvals with digital signature capture directly on your mobile device.</p>
              <ul>
                <li>• Digital signature pad</li>
                <li>• Instant approval process</li>
                <li>• Legal document creation</li>
                <li>• Email confirmations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Speed to Quote Advantage */}
      <section>
        <div>
          <div>
            <h2>Ultimate Speed to Quote Advantage</h2>
            <p>Mobile app gives you the fastest quote turnaround time in the industry</p>
          </div>

          <div>
            <div>
              <h3>Beat Every Competitor on Response Time</h3>
              <div>
                <div>
                  <CheckCircle />
                  <div>
                    <h4>Same-Visit Quote Delivery</h4>
                    <p>Create and email professional quotes before leaving the customer's property.</p>
                  </div>
                </div>
                
                <div>
                  <CheckCircle />
                  <div>
                    <h4>3-Minute Accurate Estimates</h4>
                    <p>Mobile-optimized interface reduces quote generation to under 3 minutes.</p>
                  </div>
                </div>
                
                <div>
                  <CheckCircle />
                  <div>
                    <h4>Instant Customer Approval</h4>
                    <p>Digital signatures and instant invoicing close deals on the spot.</p>
                  </div>
                </div>
                
                <div>
                  <CheckCircle />
                  <div>
                    <h4>24/7 Estimating Capability</h4>
                    <p>Quote emergency jobs and after-hours requests from anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3>Mobile Performance Metrics</h3>
              <div>
                <div>
                  <div>3min</div>
                  <div>Average quote creation time</div>
                </div>
                
                <div>
                  <div>85%</div>
                  <div>Same-visit conversion rate</div>
                </div>
                
                <div>
                  <div>10x</div>
                  <div>Faster than traditional methods</div>
                </div>
              </div>
              
              <div>
                <h4>Contractor Impact</h4>
                <div>"We close 3x more jobs since using the mobile app. Customers love getting quotes immediately."</div>
                <div>- Mobile App User Survey</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section>
        <div>
          <div>
            <h2>Works on Any Mobile Device</h2>
            <p>Native apps for iPhone and Android, plus responsive web app for tablets</p>
          </div>

          <div>
            <div>
              <Smartphone />
              <h3>iPhone App</h3>
              <ul>
                <li>• iOS 12.0 or later</li>
                <li>• iPhone 6s and newer</li>
                <li>• iPad compatible</li>
                <li>• Apple Pencil support</li>
              </ul>
              <Link href="/trial-signup">
                <Download />
                Download for iOS
              </Link>
            </div>

            <div>
              <Smartphone />
              <h3>Android App</h3>
              <ul>
                <li>• Android 6.0 or later</li>
                <li>• All screen sizes</li>
                <li>• Tablet optimized</li>
                <li>• Stylus support</li>
              </ul>
              <Link href="/trial-signup">
                <Download />
                Download for Android
              </Link>
            </div>

            <div>
              <Calculator />
              <h3>Web App</h3>
              <ul>
                <li>• Any modern browser</li>
                <li>• Progressive web app</li>
                <li>• Offline capabilities</li>
                <li>• No installation required</li>
              </ul>
              <Link href="/painting-estimate-calculator">
                <Calculator />
                Try Web Version
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <h2>Field Contractors Love the Mobile App</h2>
          
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "The mobile app is a game-changer. I create quotes while walking through homes with customers. They're impressed by the instant professionalism and I close 70% more jobs."
              </p>
              <div>Carlos Rodriguez</div>
              <div>Rodriguez Painting Services</div>
            </div>

            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>
                "Working offline is crucial for my business. Many job sites have poor cell service, but I can still create accurate quotes. The photo features help with documentation too."
              </p>
              <div>Jennifer Park</div>
              <div>Park Professional Painting</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Download Your Mobile Painting Estimate App</h2>
          <p>Join thousands of contractors who quote jobs faster with mobile technology</p>
          
          <div>
            <Link href="/trial-signup">
              <Download />
              Download Free App
              <ArrowRight />
            </Link>
            <Link href="/painting-estimate-calculator">
              Try Web Version
            </Link>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>iPhone & Android apps</span>
            </div>
            <div>
              <CheckCircle />
              <span>Works completely offline</span>
            </div>
            <div>
              <CheckCircle />
              <span>Free forever</span>
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
              <p>Mobile painting estimate app for contractors. Create professional quotes on-site with superior speed to quote.</p>
            </div>
            <div>
              <h3>Mobile Apps</h3>
              <ul>
                <li><Link href="/trial-signup">iPhone App</Link></li>
                <li><Link href="/trial-signup">Android App</Link></li>
                <li><Link href="/painting-estimate-calculator">Web App</Link></li>
              </ul>
            </div>
            <div>
              <h3>Features</h3>
              <ul>
                <li><Link href="/painting-estimating-software">Estimating Software</Link></li>
                <li><Link href="/commercial-painting-estimating">Commercial Tools</Link></li>
                <li><Link href="/painting-quote-templates">Quote Templates</Link></li>
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