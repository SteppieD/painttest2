/**
 * AI Project Manager - Premium Feature
 * 
 * Provides intelligent project scheduling, optimization, and management suggestions
 * Part of the $100/1000 quotes premium AI system
 */

import { multiAgentSystem } from './multi-agent-system';

interface ProjectData {
  quote_amount: number;
  surfaces: string[];
  dimensions: any;
  customer_name: string;
  address: string;
  project_type: string;
  estimated_duration?: number; // in hours
  complexity_score?: number; // 1-10
  material_requirements?: string[];
}

interface ScheduleSlot {
  date: string;
  start_time: string;
  end_time: string;
  available_hours: number;
  conflicts: string[];
}

interface ProjectOptimization {
  recommended_schedule: {
    start_date: string;
    end_date: string;
    work_days: number;
    daily_hours: number;
  };
  material_optimization: {
    bulk_savings: number;
    optimal_order_timing: string;
    supplier_recommendations: string[];
  };
  resource_allocation: {
    crew_size: number;
    skill_requirements: string[];
    equipment_needed: string[];
  };
  risk_factors: string[];
  profit_optimization: {
    markup_suggestion: number;
    upsell_opportunities: string[];
    cost_reduction_tips: string[];
  };
}

export class AIProjectManager {
  // Analyze project complexity and estimate duration
  async analyzeProjectComplexity(project: ProjectData): Promise<{
    complexity_score: number;
    estimated_hours: number;
    key_factors: string[];
    recommendations: string[];
  }> {
    const prompt = `Analyze this painting project for complexity and time estimation:

Project Details:
- Type: ${project.project_type}
- Surfaces: ${project.surfaces.join(', ')}
- Dimensions: ${JSON.stringify(project.dimensions)}
- Quote Amount: $${project.quote_amount}

Analyze:
1. Complexity factors (ceiling height, surface preparation, color changes, etc.)
2. Estimated labor hours based on industry standards
3. Key challenges or complications
4. Recommendations for efficiency

Return JSON:
{
  "complexity_score": 1-10,
  "estimated_hours": number,
  "key_factors": ["list of complexity factors"],
  "recommendations": ["efficiency suggestions"]
}`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'project_analysis',
        conversationHistory: [],
        currentData: project
      });

      // Parse the response for structured data
      const complexityMatch = response.primary_response.match(/complexity_score['":\s]*(\d+)/i);
      const hoursMatch = response.primary_response.match(/estimated_hours['":\s]*(\d+\.?\d*)/i);

      return {
        complexity_score: complexityMatch ? parseInt(complexityMatch[1]) : 5,
        estimated_hours: hoursMatch ? parseFloat(hoursMatch[1]) : this.estimateHoursByArea(project),
        key_factors: this.extractFactors(response.primary_response),
        recommendations: this.extractRecommendations(response.primary_response)
      };
    } catch (error) {
      console.error('Project complexity analysis error:', error);
      
      // Fallback calculation
      return {
        complexity_score: this.calculateComplexityScore(project),
        estimated_hours: this.estimateHoursByArea(project),
        key_factors: ['Standard interior painting project'],
        recommendations: ['Follow standard painting procedures']
      };
    }
  }

  // Optimize project scheduling based on capacity and priorities
  async optimizeSchedule(
    project: ProjectData,
    availableSlots: ScheduleSlot[],
    existingProjects: ProjectData[]
  ): Promise<ProjectOptimization> {
    const prompt = `Optimize the scheduling and resource allocation for this painting project:

New Project:
- Customer: ${project.customer_name}
- Value: $${project.quote_amount}
- Estimated Duration: ${project.estimated_duration || 'Unknown'} hours
- Complexity: ${project.complexity_score || 5}/10

Available Schedule Slots:
${availableSlots.map(slot => 
  `${slot.date}: ${slot.start_time}-${slot.end_time} (${slot.available_hours}h available)`
).join('\n')}

Existing Projects:
${existingProjects.map(p => 
  `${p.customer_name}: $${p.quote_amount} (${p.estimated_duration || 'Unknown'}h)`
).join('\n')}

Optimize for:
1. Maximum profit efficiency (high-value projects first)
2. Minimal travel time between jobs
3. Optimal crew utilization
4. Material bulk ordering opportunities
5. Customer satisfaction (reasonable timelines)

Return recommendations for scheduling, materials, and profit optimization.`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'schedule_optimization',
        conversationHistory: [],
        currentData: {
          project,
          available_slots: availableSlots,
          existing_projects: existingProjects
        }
      });

      return {
        recommended_schedule: {
          start_date: this.findOptimalStartDate(availableSlots, project.estimated_duration || 16),
          end_date: this.calculateEndDate(availableSlots, project.estimated_duration || 16),
          work_days: Math.ceil((project.estimated_duration || 16) / 8),
          daily_hours: 8
        },
        material_optimization: {
          bulk_savings: this.calculateBulkSavings(project, existingProjects),
          optimal_order_timing: this.getOptimalOrderTiming(project),
          supplier_recommendations: ['Sherwin-Williams', 'Benjamin Moore', 'Local supplier']
        },
        resource_allocation: {
          crew_size: this.getOptimalCrewSize(project),
          skill_requirements: this.getSkillRequirements(project),
          equipment_needed: this.getEquipmentNeeds(project)
        },
        risk_factors: this.identifyRiskFactors(project),
        profit_optimization: {
          markup_suggestion: this.suggestOptimalMarkup(project, existingProjects),
          upsell_opportunities: this.identifyUpsells(project),
          cost_reduction_tips: this.getCostReductionTips(project)
        }
      };
    } catch (error) {
      console.error('Schedule optimization error:', error);
      return this.getFallbackOptimization(project, availableSlots);
    }
  }

  // Generate customer communication suggestions
  async generateCustomerCommunication(
    project: ProjectData,
    optimization: ProjectOptimization,
    communicationType: 'quote_presentation' | 'scheduling' | 'follow_up' | 'project_update'
  ): Promise<{
    subject: string;
    message: string;
    timing: string;
    tone: string;
  }> {
    const prompt = `Generate professional customer communication for this painting project:

Project: ${project.customer_name} - $${project.quote_amount}
Communication Type: ${communicationType}

Schedule: ${optimization.recommended_schedule.start_date} to ${optimization.recommended_schedule.end_date}
Duration: ${optimization.recommended_schedule.work_days} days

Key Points to Include:
- Professional value proposition
- Clear timeline and expectations
- Quality assurance
- ${communicationType === 'quote_presentation' ? 'Competitive advantages' : ''}
- ${communicationType === 'scheduling' ? 'Scheduling details and preparation' : ''}
- ${communicationType === 'follow_up' ? 'Gentle follow-up and next steps' : ''}

Create a message that builds trust, demonstrates professionalism, and encourages action.
Return subject line, message content, optimal timing, and tone.`;

    try {
      const response = await multiAgentSystem.coordinateAgents(prompt, {
        stage: 'customer_communication',
        conversationHistory: [],
        currentData: { project, optimization, type: communicationType }
      });

      return {
        subject: this.extractSubject(response.primary_response) || this.getDefaultSubject(communicationType, project),
        message: response.primary_response,
        timing: this.getOptimalTiming(communicationType),
        tone: 'professional and friendly'
      };
    } catch (error) {
      console.error('Customer communication generation error:', error);
      return this.getFallbackCommunication(communicationType, project);
    }
  }

  // Helper methods for fallback calculations
  private calculateComplexityScore(project: ProjectData): number {
    let score = 5; // Base score
    
    // Increase complexity for multiple surfaces
    if (project.surfaces.length > 2) score += 1;
    
    // Increase for high ceilings
    if (project.dimensions?.ceiling_height > 10) score += 2;
    
    // Increase for large projects
    if (project.quote_amount > 5000) score += 1;
    
    // Increase for exterior work
    if (project.project_type === 'exterior') score += 2;
    
    return Math.min(score, 10);
  }

  private estimateHoursByArea(project: ProjectData): number {
    const baseHours = {
      walls: project.dimensions?.wall_linear_feet * 0.1 || 8,
      ceilings: project.dimensions?.ceiling_area * 0.08 || 4,
      trim: project.dimensions?.trim_linear_feet * 0.05 || 2,
      doors: (project.dimensions?.door_count || 0) * 0.5,
      windows: (project.dimensions?.window_count || 0) * 0.3
    };

    const totalHours = Object.values(baseHours).reduce((sum, hours) => sum + hours, 0);
    
    // Add prep time (25% of paint time)
    return Math.round(totalHours * 1.25);
  }

  private findOptimalStartDate(slots: ScheduleSlot[], durationHours: number): string {
    // Find the earliest slot that can accommodate the project
    const neededDays = Math.ceil(durationHours / 8);
    
    for (let i = 0; i <= slots.length - neededDays; i++) {
      const consecutiveSlots = slots.slice(i, i + neededDays);
      const totalAvailableHours = consecutiveSlots.reduce((sum, slot) => sum + slot.available_hours, 0);
      
      if (totalAvailableHours >= durationHours) {
        return consecutiveSlots[0].date;
      }
    }
    
    // Fallback to first available slot
    return slots[0]?.date || new Date().toISOString().split('T')[0];
  }

  private calculateEndDate(slots: ScheduleSlot[], durationHours: number): string {
    const startDate = this.findOptimalStartDate(slots, durationHours);
    const startDateObj = new Date(startDate);
    const workDays = Math.ceil(durationHours / 8);
    
    // Add work days (assuming 5-day work week)
    let businessDays = 0;
    let currentDate = new Date(startDateObj);
    
    while (businessDays < workDays) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
        businessDays++;
      }
    }
    
    return currentDate.toISOString().split('T')[0];
  }

  private calculateBulkSavings(project: ProjectData, existingProjects: ProjectData[]): number {
    // Estimate 5-15% savings on materials when combining orders
    const projectMaterialCost = project.quote_amount * 0.3; // Assume 30% material cost
    return Math.round(projectMaterialCost * 0.1); // 10% savings estimate
  }

  private getOptimalOrderTiming(project: ProjectData): string {
    return '2-3 days before project start';
  }

  private getOptimalCrewSize(project: ProjectData): number {
    if (project.quote_amount > 8000) return 3;
    if (project.quote_amount > 3000) return 2;
    return 1;
  }

  private getSkillRequirements(project: ProjectData): string[] {
    const skills = ['Basic painting'];
    
    if (project.surfaces.includes('ceilings')) skills.push('Ceiling work');
    if (project.project_type === 'exterior') skills.push('Exterior painting');
    if (project.complexity_score && project.complexity_score > 7) skills.push('Advanced techniques');
    
    return skills;
  }

  private getEquipmentNeeds(project: ProjectData): string[] {
    const equipment = ['Brushes', 'Rollers', 'Drop cloths'];
    
    if (project.dimensions?.ceiling_height > 9) equipment.push('Extension ladder');
    if (project.surfaces.includes('ceilings')) equipment.push('Scaffolding or ladder');
    if (project.project_type === 'exterior') equipment.push('Pressure washer');
    
    return equipment;
  }

  private identifyRiskFactors(project: ProjectData): string[] {
    const risks = [];
    
    if (project.complexity_score && project.complexity_score > 7) {
      risks.push('High complexity project - allow extra time');
    }
    
    if (project.dimensions?.ceiling_height > 12) {
      risks.push('Very high ceilings - additional safety measures required');
    }
    
    if (project.project_type === 'exterior') {
      risks.push('Weather-dependent schedule');
    }
    
    return risks;
  }

  private suggestOptimalMarkup(project: ProjectData, existingProjects: ProjectData[]): number {
    // Base markup of 50%, adjust based on market conditions
    let markup = 50;
    
    if (project.complexity_score && project.complexity_score > 7) markup += 10;
    if (project.quote_amount > 5000) markup += 5; // Premium projects
    
    return markup;
  }

  private identifyUpsells(project: ProjectData): string[] {
    const upsells = [];
    
    if (!project.surfaces.includes('trim')) {
      upsells.push('Add trim painting for complete refresh (+$300-800)');
    }
    
    if (!project.surfaces.includes('ceilings')) {
      upsells.push('Include ceiling painting for dramatic impact (+$400-1200)');
    }
    
    upsells.push('Upgrade to premium paint for better durability (+15-25%)');
    upsells.push('Add 5-year warranty for peace of mind (+$150-300)');
    
    return upsells;
  }

  private getCostReductionTips(project: ProjectData): string[] {
    return [
      'Combine with nearby projects to reduce travel costs',
      'Order materials in bulk for 5-15% savings',
      'Schedule during off-peak season for better rates',
      'Use efficient application techniques to reduce labor time'
    ];
  }

  private extractFactors(response: string): string[] {
    // Extract key factors from AI response
    const factors = [];
    if (response.includes('ceiling height')) factors.push('High ceilings');
    if (response.includes('multiple surfaces')) factors.push('Multiple surface types');
    if (response.includes('preparation')) factors.push('Surface preparation required');
    
    return factors.length > 0 ? factors : ['Standard complexity factors'];
  }

  private extractRecommendations(response: string): string[] {
    // Extract recommendations from AI response
    const recommendations = [];
    if (response.includes('efficiency')) recommendations.push('Focus on workflow efficiency');
    if (response.includes('preparation')) recommendations.push('Allow adequate prep time');
    
    return recommendations.length > 0 ? recommendations : ['Follow standard procedures'];
  }

  private extractSubject(response: string): string | null {
    const subjectMatch = response.match(/subject['":\s]*([^"'\n]+)/i);
    return subjectMatch ? subjectMatch[1].trim() : null;
  }

  private getDefaultSubject(type: string, project: ProjectData): string {
    switch (type) {
      case 'quote_presentation':
        return `Professional Painting Quote - ${project.customer_name}`;
      case 'scheduling':
        return `Project Scheduling - ${project.customer_name}`;
      case 'follow_up':
        return `Following up on your painting quote`;
      case 'project_update':
        return `Project Update - ${project.customer_name}`;
      default:
        return `Regarding your painting project`;
    }
  }

  private getOptimalTiming(type: string): string {
    switch (type) {
      case 'quote_presentation':
        return 'Within 24 hours of site visit';
      case 'scheduling':
        return 'Within 2-3 days of quote acceptance';
      case 'follow_up':
        return '3-5 days after sending quote';
      case 'project_update':
        return 'Day before project start';
      default:
        return 'As needed';
    }
  }

  private getFallbackCommunication(type: string, project: ProjectData) {
    return {
      subject: this.getDefaultSubject(type, project),
      message: `Thank you for considering our painting services. We'll be in touch soon with more details about your ${project.project_type} painting project.`,
      timing: this.getOptimalTiming(type),
      tone: 'professional and friendly'
    };
  }

  private getFallbackOptimization(project: ProjectData, slots: ScheduleSlot[]): ProjectOptimization {
    return {
      recommended_schedule: {
        start_date: slots[0]?.date || new Date().toISOString().split('T')[0],
        end_date: this.calculateEndDate(slots, project.estimated_duration || 16),
        work_days: Math.ceil((project.estimated_duration || 16) / 8),
        daily_hours: 8
      },
      material_optimization: {
        bulk_savings: 0,
        optimal_order_timing: '2-3 days before start',
        supplier_recommendations: ['Local supplier']
      },
      resource_allocation: {
        crew_size: 1,
        skill_requirements: ['Basic painting'],
        equipment_needed: ['Standard painting equipment']
      },
      risk_factors: ['Standard project risks'],
      profit_optimization: {
        markup_suggestion: 50,
        upsell_opportunities: ['Consider additional surfaces'],
        cost_reduction_tips: ['Standard efficiency practices']
      }
    };
  }
}

export const aiProjectManager = new AIProjectManager();