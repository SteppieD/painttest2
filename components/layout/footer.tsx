import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Clock } from 'lucide-react'
import { COMPANY_INFO, PAINTING_SERVICES, SERVICE_AREAS } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/paint-logo-transparent.png"
                alt={COMPANY_INFO.name}
                width={32}
                height={32}
                className="w-8 h-8 brightness-0 invert"
              />
              <span className="font-display font-bold text-xl">{COMPANY_INFO.name}</span>
            </div>
            <p className="text-gray-300 mb-4">{COMPANY_INFO.tagline}</p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              {PAINTING_SERVICES.map((service) => (
                <li key={service.id}>
                  <Link 
                    href={`/services/${service.id}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/calculator"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Free Quote Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog & Tips
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary-400 transition-colors">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  {COMPANY_INFO.address.street}<br />
                  {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <div>Mon-Fri: {COMPANY_INFO.businessHours.weekdays}</div>
                  <div>Sat: {COMPANY_INFO.businessHours.saturday}</div>
                  <div>Sun: {COMPANY_INFO.businessHours.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Areas Bar */}
      <div className="bg-secondary-800 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400">
            Proudly serving{' '}
            {SERVICE_AREAS.slice(0, 5).map((area, index) => (
              <span key={area.city}>
                <Link 
                  href={`/locations/${area.city.toLowerCase().replace(' ', '-')}-${area.state.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                >
                  {area.city}
                </Link>
                {index < 4 && ', '}
              </span>
            ))}
            {' '}and{' '}
            <Link href="/locations" className="hover:text-white transition-colors">
              more locations
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© {currentYear} {COMPANY_INFO.name}. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}