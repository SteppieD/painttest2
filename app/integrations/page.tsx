import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { Shield, Zap, Building2, FileText, Calculator, Users } from 'lucide-react';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Integrations - Connect Your Painting Business Tools',
  description: 'Connect Paint Quote App with QuickBooks, Google Workspace, CRM systems and more. Streamline your painting business workflow with powerful integrations.',
  keywords: 'painting software integrations, quickbooks integration, google workspace integration, crm integration, painting business tools',
  path: '/integrations',
});

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      <div className="container mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Integrations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect Paint Quote App with your favorite tools to streamline your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">QuickBooks</h3>
            <p className="text-gray-600 mb-4">
              Sync quotes and invoices automatically with your accounting software
            </p>
            <span className="text-sm text-green-600 font-medium">Available Now</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Google Workspace</h3>
            <p className="text-gray-600 mb-4">
              Export quotes to Google Docs and sync with Google Calendar
            </p>
            <span className="text-sm text-green-600 font-medium">Available Now</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">CRM Systems</h3>
            <p className="text-gray-600 mb-4">
              Connect with Salesforce, HubSpot, and other CRM platforms
            </p>
            <span className="text-sm text-blue-600 font-medium">Coming Soon</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Zapier</h3>
            <p className="text-gray-600 mb-4">
              Connect with 5,000+ apps through Zapier automation
            </p>
            <span className="text-sm text-blue-600 font-medium">Coming Soon</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Processing</h3>
            <p className="text-gray-600 mb-4">
              Accept payments through Stripe, Square, and PayPal
            </p>
            <span className="text-sm text-green-600 font-medium">Available Now</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">API Access</h3>
            <p className="text-gray-600 mb-4">
              Build custom integrations with our comprehensive API
            </p>
            <span className="text-sm text-blue-600 font-medium">Enterprise Only</span>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Integration?</h2>
          <p className="text-gray-600 mb-8">
            Our team can build custom integrations for enterprise customers
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Sales
          </a>
        </div>
      </div>

      <ImprovedFooter />
    </div>
  );
}