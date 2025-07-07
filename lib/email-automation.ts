/**
 * Email Marketing Automation System
 * 
 * Tracks user events and triggers automated email campaigns
 */

import { communicationService } from './communication-service-production';

export interface UserEvent {
  companyId: number;
  email: string;
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  trigger: string;
  delayMinutes: number;
  subject: string;
  template: string;
}

// Define automated email campaigns
const EMAIL_CAMPAIGNS: EmailCampaign[] = [
  // Trial Onboarding Sequence
  {
    id: 'welcome',
    name: 'Welcome Email',
    trigger: 'trial_started',
    delayMinutes: 0,
    subject: 'Welcome to ProPaint Quote! Here\'s your quick start guide 🎨',
    template: 'welcome'
  },
  {
    id: 'day1_checkin',
    name: 'Day 1 Check-in',
    trigger: 'trial_started',
    delayMinutes: 1440, // 24 hours
    subject: 'Quick question about your first quote',
    template: 'day1_checkin'
  },
  {
    id: 'feature_discovery',
    name: 'Feature Discovery',
    trigger: 'trial_started',
    delayMinutes: 4320, // 3 days
    subject: 'You\'re missing out on 80% time savings',
    template: 'feature_discovery'
  },
  {
    id: 'trial_ending_soon',
    name: 'Trial Ending Soon',
    trigger: 'trial_started',
    delayMinutes: 18720, // 13 days
    subject: 'Your trial ends tomorrow - don\'t lose your quotes!',
    template: 'trial_ending'
  },
  
  // Quote Activity Triggers
  {
    id: 'first_quote_congrats',
    name: 'First Quote Congratulations',
    trigger: 'first_quote_created',
    delayMinutes: 5,
    subject: 'Congrats on your first quote! Here\'s how to win the job',
    template: 'first_quote_tips'
  },
  {
    id: 'quote_accepted',
    name: 'Quote Accepted',
    trigger: 'quote_accepted',
    delayMinutes: 0,
    subject: '🎉 Your quote was accepted!',
    template: 'quote_accepted'
  },
  
  // Engagement Campaigns
  {
    id: 'inactive_3days',
    name: 'Inactive 3 Days',
    trigger: 'user_inactive',
    delayMinutes: 4320, // 3 days
    subject: 'We noticed you haven\'t created any quotes lately',
    template: 'reengagement'
  },
  
  // Upgrade Campaigns
  {
    id: 'usage_limit_warning',
    name: 'Usage Limit Warning',
    trigger: 'approaching_limit',
    delayMinutes: 0,
    subject: 'You\'re at 80% of your monthly quote limit',
    template: 'upgrade_prompt'
  }
];

class EmailAutomationService {
  private scheduledEmails: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Track a user event and trigger associated campaigns
   */
  async trackEvent(event: UserEvent): Promise<void> {
    console.log('📊 Event tracked:', event);
    
    // Find campaigns triggered by this event
    const triggeredCampaigns = EMAIL_CAMPAIGNS.filter(
      campaign => campaign.trigger === event.event
    );
    
    // Schedule each triggered campaign
    for (const campaign of triggeredCampaigns) {
      await this.scheduleCampaign(campaign, event);
    }
    
    // Store event in database (implement based on your DB)
    await this.storeEvent(event);
  }

  /**
   * Schedule a campaign email
   */
  private async scheduleCampaign(
    campaign: EmailCampaign, 
    event: UserEvent
  ): Promise<void> {
    const scheduleKey = `${event.companyId}-${campaign.id}`;
    
    // Cancel existing schedule if any
    if (this.scheduledEmails.has(scheduleKey)) {
      clearTimeout(this.scheduledEmails.get(scheduleKey)!);
    }
    
    // Schedule new email
    const timeout = setTimeout(async () => {
      await this.sendCampaignEmail(campaign, event);
      this.scheduledEmails.delete(scheduleKey);
    }, campaign.delayMinutes * 60 * 1000);
    
    this.scheduledEmails.set(scheduleKey, timeout);
    
    console.log(`📅 Scheduled ${campaign.name} for ${event.email} in ${campaign.delayMinutes} minutes`);
  }

  /**
   * Send a campaign email
   */
  private async sendCampaignEmail(
    campaign: EmailCampaign,
    event: UserEvent
  ): Promise<void> {
    try {
      // Get email template content
      const { html, text } = this.getEmailContent(campaign.template, event);
      
      // Send via communication service
      const result = await communicationService.sendEmail({
        to: event.email,
        subject: campaign.subject,
        text,
        html,
        trackOpens: true,
        trackClicks: true
      });
      
      if (result.success) {
        console.log(`✅ Sent ${campaign.name} to ${event.email}`);
        
        // Track email sent event
        await this.trackEvent({
          ...event,
          event: 'email_sent',
          properties: {
            campaignId: campaign.id,
            campaignName: campaign.name,
            messageId: result.messageId
          }
        });
      } else {
        console.error(`❌ Failed to send ${campaign.name}:`, result.error);
      }
    } catch (error) {
      console.error('Error sending campaign email:', error);
    }
  }

  /**
   * Get email content based on template
   */
  private getEmailContent(
    template: string, 
    event: UserEvent
  ): { html: string; text: string } {
    // This would normally load from a template system
    // For now, simple examples:
    
    const templates: Record<string, { html: string; text: string }> = {
      welcome: {
        html: `
          <h1>Welcome to ProPaint Quote!</h1>
          <p>Hi there,</p>
          <p>You're about to save hours on every quote. Here's how to get started:</p>
          <ol>
            <li>Complete your setup (2 minutes)</li>
            <li>Create your first quote (30 seconds)</li>
            <li>Send it to a customer</li>
          </ol>
          <p>Ready to start?</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Create Your First Quote
          </a>
        `,
        text: 'Welcome to ProPaint Quote! Get started at ' + process.env.NEXT_PUBLIC_APP_URL
      },
      
      day1_checkin: {
        html: `
          <h2>Quick question...</h2>
          <p>Have you created your first quote yet?</p>
          <p>If yes - awesome! Here are some tips for following up with customers.</p>
          <p>If no - what's holding you back? Just reply and let us know!</p>
        `,
        text: 'Have you created your first quote yet? Let us know how we can help!'
      }
      
      // Add more templates as needed
    };
    
    return templates[template] || {
      html: '<p>Email content</p>',
      text: 'Email content'
    };
  }

  /**
   * Store event in database
   */
  private async storeEvent(event: UserEvent): Promise<void> {
    // Implement based on your database
    // For now, just log
    console.log('Storing event:', event);
  }

  /**
   * Cancel all scheduled emails for a company
   */
  cancelScheduledEmails(companyId: number): void {
    const keysToDelete: string[] = [];
    
    this.scheduledEmails.forEach((timeout, key) => {
      if (key.startsWith(`${companyId}-`)) {
        clearTimeout(timeout);
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.scheduledEmails.delete(key));
    
    console.log(`Cancelled ${keysToDelete.length} scheduled emails for company ${companyId}`);
  }
}

// Export singleton instance
export const emailAutomation = new EmailAutomationService();

// Helper functions for common events
export const trackTrialStarted = (company: any) => {
  return emailAutomation.trackEvent({
    companyId: company.id,
    email: company.email,
    event: 'trial_started',
    properties: {
      companyName: company.name,
      accessCode: company.access_code
    }
  });
};

export const trackQuoteCreated = (company: any, quote: any, isFirst: boolean = false) => {
  return emailAutomation.trackEvent({
    companyId: company.id,
    email: company.email,
    event: isFirst ? 'first_quote_created' : 'quote_created',
    properties: {
      quoteId: quote.id,
      quoteValue: quote.total_price,
      customerName: quote.customer_name
    }
  });
};

export const trackQuoteAccepted = (company: any, quote: any) => {
  return emailAutomation.trackEvent({
    companyId: company.id,
    email: company.email,
    event: 'quote_accepted',
    properties: {
      quoteId: quote.id,
      quoteValue: quote.total_price,
      customerName: quote.customer_name
    }
  });
};

export const trackSubscriptionStarted = (company: any, plan: string) => {
  return emailAutomation.trackEvent({
    companyId: company.id,
    email: company.email,
    event: 'subscription_started',
    properties: {
      plan,
      timestamp: new Date()
    }
  });
};