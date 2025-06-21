/**
 * Customer Psychology Insights - Premium Feature
 * 
 * Analyzes customer behavior, preferences, and psychology to optimize
 * communication, pricing, and project approach for maximum conversion
 * Part of the $100/1000 quotes premium AI system
 */

import { multiAgentSystem } from './multi-agent-system';

interface CustomerProfile {
  name: string;
  address?: string;
  communication_history: Array<{
    message: string;
    timestamp: Date;
    type: 'phone' | 'email' | 'text' | 'in_person';
  }>;
  project_details: {
    type: string;
    surfaces: string[];
    timeline?: string;
    budget_mentioned?: number;
    budget_signals?: string[];
  };
  behavioral_indicators: {
    urgency_level: 'low' | 'medium' | 'high';
    decision_making_style: 'analytical' | 'emotional' | 'practical' | 'social';
    price_sensitivity: 'low' | 'medium' | 'high';
    quality_focus: 'low' | 'medium' | 'high';
  };
}

interface PsychologyInsights {
  customer_type: {
    primary_type: string;
    confidence: number;
    description: string;
    traits: string[];
  };
  communication_strategy: {
    preferred_tone: string;
    key_messages: string[];
    words_to_use: string[];
    words_to_avoid: string[];
    optimal_timing: string;
  };
  pricing_psychology: {
    price_anchoring_strategy: string;
    presentation_format: 'single_price' | 'tiered_options' | 'value_breakdown';
    payment_terms_suggestion: string;
    negotiation_approach: string;
  };
  conversion_tactics: {
    primary_motivators: string[];
    objection_likely: string[];
    urgency_creators: string[];
    trust_builders: string[];
  };
  follow_up_strategy: {
    timing: string;
    approach: string;
    key_focus: string;
    backup_strategies: string[];
  };
}

export class CustomerPsychologyAnalyzer {
  // Analyze customer communication and behavior patterns
  async analyzeCustomerPsychology(
    customerData: Partial<CustomerProfile>,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<PsychologyInsights> {
    const prompt = `Analyze this customer's psychology and communication patterns for optimal sales approach:

Customer Data:
- Name: ${customerData.name}
- Project: ${customerData.project_details?.type} - ${customerData.project_details?.surfaces?.join(', ')}
- Timeline mentioned: ${customerData.project_details?.timeline || 'Not specified'}
- Budget signals: ${customerData.project_details?.budget_signals?.join(', ') || 'None detected'}

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Analyze for:
1. Customer personality type (analytical, emotional, practical, social)
2. Price sensitivity indicators
3. Decision-making style and timeline
4. Quality vs. cost priorities
5. Communication preferences
6. Likely objections and concerns
7. Motivation triggers

Provide specific recommendations for:
- Communication tone and messaging
- Pricing presentation strategy
- Conversion tactics
- Follow-up approach

Focus on psychological insights that will increase conversion probability.`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'customer_psychology_analysis',
        conversationHistory,
        currentData: customerData,
        customerProfile: customerData
      });

      return this.parseInsightsFromResponse(response.primary_response, customerData);
    } catch (error) {
      console.error('Customer psychology analysis error:', error);
      return this.generateFallbackInsights(customerData, conversationHistory);
    }
  }

  // Generate personalized quote presentation based on psychology insights
  async generatePersonalizedPresentation(
    customerData: Partial<CustomerProfile>,
    quoteDetails: any,
    insights: PsychologyInsights
  ): Promise<{
    presentation_strategy: string;
    opening_message: string;
    value_proposition: string;
    pricing_presentation: string;
    closing_approach: string;
    follow_up_plan: string;
  }> {
    const prompt = `Create a personalized quote presentation strategy based on customer psychology:

Customer Profile:
- Type: ${insights.customer_type.primary_type}
- Communication Style: ${insights.communication_strategy.preferred_tone}
- Price Sensitivity: ${customerData.behavioral_indicators?.price_sensitivity || 'medium'}
- Decision Style: ${customerData.behavioral_indicators?.decision_making_style || 'practical'}

Quote Details:
- Amount: $${quoteDetails.quote_amount}
- Surfaces: ${quoteDetails.surfaces?.join(', ')}
- Timeline: ${quoteDetails.timeline || 'TBD'}

Key Insights:
- Primary Motivators: ${insights.conversion_tactics.primary_motivators.join(', ')}
- Likely Objections: ${insights.conversion_tactics.objection_likely.join(', ')}
- Trust Builders: ${insights.conversion_tactics.trust_builders.join(', ')}

Create a complete presentation strategy that:
1. Opens with the right tone and message
2. Presents value in a way that resonates with their psychology
3. Addresses their specific concerns proactively
4. Uses their preferred communication style
5. Includes a compelling close and follow-up plan

Make it feel natural and consultative, not salesy.`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'personalized_presentation',
        conversationHistory: [],
        currentData: { customer: customerData, quote: quoteDetails, insights }
      });

      return this.parsePresentationFromResponse(response.primary_response, insights);
    } catch (error) {
      console.error('Personalized presentation generation error:', error);
      return this.generateFallbackPresentation(customerData, quoteDetails, insights);
    }
  }

  // Predict customer objections and prepare responses
  async predictObjectionsAndResponses(
    customerData: Partial<CustomerProfile>,
    quoteDetails: any,
    insights: PsychologyInsights
  ): Promise<Array<{
    objection: string;
    likelihood: 'low' | 'medium' | 'high';
    response_strategy: string;
    suggested_response: string;
  }>> {
    const prompt = `Predict likely customer objections and prepare responses:

Customer Profile: ${insights.customer_type.primary_type}
Price Sensitivity: ${customerData.behavioral_indicators?.price_sensitivity}
Quote Amount: $${quoteDetails.quote_amount}

Based on customer psychology and common patterns, predict:
1. Most likely objections (price, timeline, quality concerns, etc.)
2. How this customer type typically phrases objections
3. Best response strategies for their psychology
4. Specific language that will resonate

Consider:
- Their communication style: ${insights.communication_strategy.preferred_tone}
- Their motivators: ${insights.conversion_tactics.primary_motivators.join(', ')}
- Their decision style: ${customerData.behavioral_indicators?.decision_making_style}

Provide specific objection predictions with tailored response strategies.`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'objection_prediction',
        conversationHistory: [],
        currentData: { customer: customerData, quote: quoteDetails, insights }
      });

      return this.parseObjectionsFromResponse(response.primary_response);
    } catch (error) {
      console.error('Objection prediction error:', error);
      return this.generateFallbackObjections(customerData, quoteDetails);
    }
  }

  // Generate follow-up sequence based on customer psychology
  async generateFollowUpSequence(
    customerData: Partial<CustomerProfile>,
    insights: PsychologyInsights,
    quoteStatus: 'sent' | 'viewed' | 'no_response' | 'questions' | 'objections'
  ): Promise<Array<{
    day: number;
    method: 'email' | 'phone' | 'text';
    message: string;
    purpose: string;
    tone: string;
  }>> {
    const prompt = `Create a follow-up sequence tailored to customer psychology:

Customer Type: ${insights.customer_type.primary_type}
Current Status: ${quoteStatus}
Decision Style: ${customerData.behavioral_indicators?.decision_making_style}
Communication Preference: ${insights.communication_strategy.preferred_tone}

Create a 7-day follow-up sequence that:
1. Respects their communication style
2. Addresses their specific psychology
3. Provides value, not just pressure
4. Uses appropriate timing for their decision style
5. Varies the approach and method

Consider:
- Their urgency level: ${customerData.behavioral_indicators?.urgency_level}
- Their motivators: ${insights.conversion_tactics.primary_motivators.join(', ')}
- Optimal timing: ${insights.follow_up_strategy.timing}

Make each touchpoint valuable and customer-focused.`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'follow_up_sequence',
        conversationHistory: [],
        currentData: { customer: customerData, insights, status: quoteStatus }
      });

      return this.parseFollowUpSequence(response.primary_response, insights);
    } catch (error) {
      console.error('Follow-up sequence generation error:', error);
      return this.generateFallbackFollowUpSequence(insights);
    }
  }

  // Private helper methods
  private parseInsightsFromResponse(response: string, customerData: Partial<CustomerProfile>): PsychologyInsights {
    // Extract insights from AI response using pattern matching
    const customerTypes = ['analytical', 'emotional', 'practical', 'social'];
    const detectedType = customerTypes.find(type => 
      response.toLowerCase().includes(type)
    ) || 'practical';

    return {
      customer_type: {
        primary_type: detectedType,
        confidence: 0.8,
        description: this.getTypeDescription(detectedType),
        traits: this.getTypeTraits(detectedType)
      },
      communication_strategy: {
        preferred_tone: this.inferTone(response, detectedType),
        key_messages: this.extractKeyMessages(response),
        words_to_use: this.getPositiveWords(detectedType),
        words_to_avoid: this.getNegativeWords(detectedType),
        optimal_timing: this.getOptimalTiming(detectedType)
      },
      pricing_psychology: {
        price_anchoring_strategy: this.getPricingStrategy(detectedType),
        presentation_format: this.getPreferredFormat(detectedType),
        payment_terms_suggestion: 'Standard terms with flexibility',
        negotiation_approach: this.getNegotiationApproach(detectedType)
      },
      conversion_tactics: {
        primary_motivators: this.getPrimaryMotivators(detectedType),
        objection_likely: this.getLikelyObjections(detectedType),
        urgency_creators: this.getUrgencyCreators(detectedType),
        trust_builders: this.getTrustBuilders(detectedType)
      },
      follow_up_strategy: {
        timing: this.getFollowUpTiming(detectedType),
        approach: this.getFollowUpApproach(detectedType),
        key_focus: this.getFollowUpFocus(detectedType),
        backup_strategies: this.getBackupStrategies(detectedType)
      }
    };
  }

  private getTypeDescription(type: string): string {
    const descriptions = {
      analytical: 'Data-driven, detail-oriented, needs comprehensive information',
      emotional: 'Values feelings, relationships, and personal connection',
      practical: 'Focused on value, efficiency, and straightforward solutions',
      social: 'Influenced by others, seeks validation and social proof'
    };
    return descriptions[type as keyof typeof descriptions] || descriptions.practical;
  }

  private getTypeTraits(type: string): string[] {
    const traits = {
      analytical: ['Detail-oriented', 'Data-driven', 'Methodical', 'Research-focused'],
      emotional: ['Relationship-focused', 'Values trust', 'Intuitive', 'Personal connection important'],
      practical: ['Value-conscious', 'Efficient', 'Straightforward', 'Results-oriented'],
      social: ['Seeks validation', 'Values opinions', 'Community-minded', 'Trend-aware']
    };
    return traits[type as keyof typeof traits] || traits.practical;
  }

  private inferTone(response: string, type: string): string {
    const tones = {
      analytical: 'Professional and detailed',
      emotional: 'Warm and personal',
      practical: 'Straightforward and honest',
      social: 'Friendly and consultative'
    };
    return tones[type as keyof typeof tones] || tones.practical;
  }

  private extractKeyMessages(response: string): string[] {
    return [
      'Quality workmanship guaranteed',
      'Professional and reliable service',
      'Transparent pricing and timeline',
      'Customer satisfaction focus'
    ];
  }

  private getPositiveWords(type: string): string[] {
    const words = {
      analytical: ['proven', 'detailed', 'systematic', 'thorough', 'professional'],
      emotional: ['beautiful', 'transform', 'home', 'family', 'comfortable'],
      practical: ['value', 'efficient', 'reliable', 'straightforward', 'honest'],
      social: ['popular', 'recommended', 'trusted', 'neighbors', 'community']
    };
    return words[type as keyof typeof words] || words.practical;
  }

  private getNegativeWords(type: string): string[] {
    const words = {
      analytical: ['rushed', 'approximate', 'maybe', 'probably'],
      emotional: ['cheap', 'basic', 'standard', 'minimal'],
      practical: ['expensive', 'premium', 'luxury', 'unnecessary'],
      social: ['unique', 'different', 'experimental', 'untested']
    };
    return words[type as keyof typeof words] || words.practical;
  }

  private getOptimalTiming(type: string): string {
    const timing = {
      analytical: 'Allow time for consideration, mid-week preferred',
      emotional: 'When relaxed, evening or weekend',
      practical: 'Business hours, quick decisions appreciated',
      social: 'When others can be consulted, flexible timing'
    };
    return timing[type as keyof typeof timing] || timing.practical;
  }

  private getPricingStrategy(type: string): string {
    const strategies = {
      analytical: 'Detailed breakdown with comparisons',
      emotional: 'Focus on value and transformation',
      practical: 'Clear value proposition and ROI',
      social: 'Social proof and neighbor comparisons'
    };
    return strategies[type as keyof typeof strategies] || strategies.practical;
  }

  private getPreferredFormat(type: string): 'single_price' | 'tiered_options' | 'value_breakdown' {
    const formats = {
      analytical: 'value_breakdown' as const,
      emotional: 'single_price' as const,
      practical: 'single_price' as const,
      social: 'tiered_options' as const
    };
    return formats[type as keyof typeof formats] || 'single_price';
  }

  private getNegotiationApproach(type: string): string {
    const approaches = {
      analytical: 'Logical reasoning with data support',
      emotional: 'Value-based with personal benefits',
      practical: 'Straightforward value demonstration',
      social: 'Social proof and testimonials'
    };
    return approaches[type as keyof typeof approaches] || approaches.practical;
  }

  private getPrimaryMotivators(type: string): string[] {
    const motivators = {
      analytical: ['Quality assurance', 'Detailed process', 'Professional credentials'],
      emotional: ['Home transformation', 'Family comfort', 'Personal satisfaction'],
      practical: ['Value for money', 'Time efficiency', 'Reliable service'],
      social: ['Neighbor approval', 'Trending choices', 'Community reputation']
    };
    return motivators[type as keyof typeof motivators] || motivators.practical;
  }

  private getLikelyObjections(type: string): string[] {
    const objections = {
      analytical: ['Need more details', 'Want to compare options', 'Timeline concerns'],
      emotional: ['Disruption to family', 'Trust concerns', 'Change anxiety'],
      practical: ['Price too high', 'Unnecessary features', 'Timeline too long'],
      social: ['Need others\' opinions', 'What will neighbors think', 'Timing concerns']
    };
    return objections[type as keyof typeof objections] || objections.practical;
  }

  private getUrgencyCreators(type: string): string[] {
    const urgency = {
      analytical: ['Limited scheduling availability', 'Seasonal pricing changes'],
      emotional: ['Perfect timing for family events', 'Seasonal comfort benefits'],
      practical: ['Off-season pricing', 'Schedule efficiency'],
      social: ['Neighborhood project timing', 'Community discount opportunities']
    };
    return urgency[type as keyof typeof urgency] || urgency.practical;
  }

  private getTrustBuilders(type: string): string[] {
    const trust = {
      analytical: ['Certifications', 'Detailed process', 'Quality guarantees'],
      emotional: ['Personal references', 'Family testimonials', 'Care for home'],
      practical: ['Insurance coverage', 'Written guarantees', 'Local reputation'],
      social: ['Neighborhood testimonials', 'Community involvement', 'Social proof']
    };
    return trust[type as keyof typeof trust] || trust.practical;
  }

  private getFollowUpTiming(type: string): string {
    const timing = {
      analytical: '3-5 days (allow consideration time)',
      emotional: '2-3 days (maintain connection)',
      practical: '1-2 days (quick decision preference)',
      social: '3-4 days (consultation time)'
    };
    return timing[type as keyof typeof timing] || timing.practical;
  }

  private getFollowUpApproach(type: string): string {
    const approaches = {
      analytical: 'Provide additional details and comparisons',
      emotional: 'Check in personally and address concerns',
      practical: 'Clarify value and next steps',
      social: 'Share social proof and community benefits'
    };
    return approaches[type as keyof typeof approaches] || approaches.practical;
  }

  private getFollowUpFocus(type: string): string {
    const focus = {
      analytical: 'Answer questions and provide data',
      emotional: 'Build relationship and trust',
      practical: 'Clarify value and timeline',
      social: 'Provide social validation'
    };
    return focus[type as keyof typeof focus] || focus.practical;
  }

  private getBackupStrategies(type: string): string[] {
    const strategies = {
      analytical: ['Provide case studies', 'Offer trial or guarantee', 'Schedule consultation'],
      emotional: ['Personal visit', 'Family testimonials', 'Flexible timeline'],
      practical: ['Payment options', 'Scope adjustments', 'Seasonal timing'],
      social: ['Neighbor references', 'Community testimonials', 'Group discounts']
    };
    return strategies[type as keyof typeof strategies] || strategies.practical;
  }

  // Additional fallback methods would go here...
  private parsePresentationFromResponse(response: string, insights: PsychologyInsights): any {
    return {
      presentation_strategy: `Tailored approach for ${insights.customer_type.primary_type} customer`,
      opening_message: "Thank you for considering our painting services...",
      value_proposition: "Professional quality with reliable service...",
      pricing_presentation: "Investment breakdown and value explanation...",
      closing_approach: "Next steps and decision timeline...",
      follow_up_plan: "Personalized follow-up sequence..."
    };
  }

  private parseObjectionsFromResponse(response: string): any[] {
    return [
      {
        objection: "Price seems high",
        likelihood: 'high' as const,
        response_strategy: "Value demonstration",
        suggested_response: "I understand price is important. Let me show you the value..."
      }
    ];
  }

  private parseFollowUpSequence(response: string, insights: PsychologyInsights): any[] {
    return [
      {
        day: 1,
        method: 'email' as const,
        message: "Thank you for your time today...",
        purpose: "Recap and next steps",
        tone: insights.communication_strategy.preferred_tone
      }
    ];
  }

  private generateFallbackInsights(customerData: Partial<CustomerProfile>, conversationHistory: any[]): PsychologyInsights {
    return this.parseInsightsFromResponse("practical customer type detected", customerData);
  }

  private generateFallbackPresentation(customerData: any, quoteDetails: any, insights: PsychologyInsights): any {
    return this.parsePresentationFromResponse("standard presentation approach", insights);
  }

  private generateFallbackObjections(customerData: any, quoteDetails: any): any[] {
    return this.parseObjectionsFromResponse("common objections expected");
  }

  private generateFallbackFollowUpSequence(insights: PsychologyInsights): any[] {
    return this.parseFollowUpSequence("standard follow-up sequence", insights);
  }
}

export const customerPsychologyAnalyzer = new CustomerPsychologyAnalyzer();