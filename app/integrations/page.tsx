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
    <div>
      <KofiHeader />
      
      <div>
        <div>
          <h1>
            Integrations
          </h1>
          <p>
            Connect Paint Quote App with your favorite tools to streamline your workflow
          </p>
        </div>

        <div>
          <div>
            <div>
              <Calculator />
            </div>
            <h3>QuickBooks</h3>
            <p>
              Sync quotes and invoices automatically with your accounting software
            </p>
            <span>Available Now</span>
          </div>

          <div>
            <div>
              <FileText />
            </div>
            <h3>Google Workspace</h3>
            <p>
              Export quotes to Google Docs and sync with Google Calendar
            </p>
            <span>Available Now</span>
          </div>

          <div>
            <div>
              <Users />
            </div>
            <h3>CRM Systems</h3>
            <p>
              Connect with Salesforce, HubSpot, and other CRM platforms
            </p>
            <span>Coming Soon</span>
          </div>

          <div>
            <div>
              <Zap />
            </div>
            <h3>Zapier</h3>
            <p>
              Connect with 5,000+ apps through Zapier automation
            </p>
            <span>Coming Soon</span>
          </div>

          <div>
            <div>
              <Shield />
            </div>
            <h3>Payment Processing</h3>
            <p>
              Accept payments through Stripe, Square, and PayPal
            </p>
            <span>Available Now</span>
          </div>

          <div>
            <div>
              <Building2 />
            </div>
            <h3>API Access</h3>
            <p>
              Build custom integrations with our comprehensive API
            </p>
            <span>Enterprise Only</span>
          </div>
        </div>

        <div>
          <h2>Need a Custom Integration?</h2>
          <p>
            Our team can build custom integrations for enterprise customers
          </p>
          <a 
            href="/contact" 
           
          >
            Contact Sales
          </a>
        </div>
      </div>

      <ImprovedFooter />
    </div>
  );
}