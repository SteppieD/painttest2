/**
 * Company Branding System
 * 
 * Manages company logos, colors, and branding preferences
 * for professional quote and email customization
 */

export interface CompanyBrandingData {
  company_id: string;
  logo_url?: string;
  logo_file?: File;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  company_name: string;
  company_tagline?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
  primaryRgb: string;
  secondaryRgb: string;
  accentRgb: string;
}

export class CompanyBrandingManager {
  
  // Default professional color scheme
  private static DEFAULT_COLORS = {
    primary: '#3182ce',     // Professional blue
    secondary: '#2d3748',   // Dark gray
    accent: '#38a169',      // Success green
  };

  // Convert hex to RGB for CSS usage
  static hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `${r}, ${g}, ${b}`;
  }

  // Get processed branding colors with RGB values
  static getBrandingColors(branding?: Partial<CompanyBrandingData>): BrandingColors {
    const colors = {
      primary: branding?.primary_color || this.DEFAULT_COLORS.primary,
      secondary: branding?.secondary_color || this.DEFAULT_COLORS.secondary,
      accent: branding?.accent_color || this.DEFAULT_COLORS.accent,
    };

    return {
      ...colors,
      primaryRgb: this.hexToRgb(colors.primary),
      secondaryRgb: this.hexToRgb(colors.secondary),
      accentRgb: this.hexToRgb(colors.accent),
    };
  }

  // Generate CSS custom properties for branding
  static generateBrandingCSS(branding?: Partial<CompanyBrandingData>): string {
    const colors = this.getBrandingColors(branding);
    
    return `
      :root {
        --brand-primary: ${colors.primary};
        --brand-secondary: ${colors.secondary};
        --brand-accent: ${colors.accent};
        --brand-primary-rgb: ${colors.primaryRgb};
        --brand-secondary-rgb: ${colors.secondaryRgb};
        --brand-accent-rgb: ${colors.accentRgb};
      }
    `;
  }

  // Get logo element for templates
  static getLogoElement(branding?: Partial<CompanyBrandingData>, className: string = 'company-logo'): string {
    const companyName = branding?.company_name || 'Professional Painting Services';
    
    if (branding?.logo_url) {
      return `<img src="${branding.logo_url}" alt="${companyName}" class="${className}" />`;
    } else {
      // Default logo placeholder with branding colors
      const colors = this.getBrandingColors(branding);
      return `
        <div class="${className}-placeholder" style="
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        ">🎨</div>
      `;
    }
  }

  // Apply branding to email templates
  static applyBrandingToEmailTemplate(
    htmlTemplate: string, 
    branding?: Partial<CompanyBrandingData>
  ): string {
    const colors = this.getBrandingColors(branding);
    
    // Replace CSS custom properties in email template
    let brandedTemplate = htmlTemplate
      .replace(/#3182ce/g, colors.primary)
      .replace(/#2b77cb/g, colors.primary)
      .replace(/#2d3748/g, colors.secondary)
      .replace(/#38a169/g, colors.accent)
      .replace(/background: linear-gradient\(135deg, #3182ce, #2b77cb\)/g, 
               `background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`)
      .replace(/color: #3182ce/g, `color: ${colors.primary}`)
      .replace(/border: 2px solid #3182ce/g, `border: 2px solid ${colors.primary}`)
      .replace(/background: #3182ce/g, `background: ${colors.primary}`);

    // Replace logo placeholder if logo URL exists
    if (branding?.logo_url) {
      const logoElement = `<img src="${branding.logo_url}" alt="${branding.company_name || 'Company Logo'}" class="company-logo" />`;
      brandedTemplate = brandedTemplate.replace(
        /<div class="company-logo-placeholder">🎨<\/div>/g,
        logoElement
      );
    }

    return brandedTemplate;
  }

  // Apply branding to PDF templates
  static applyBrandingToPDFTemplate(
    htmlTemplate: string, 
    branding?: Partial<CompanyBrandingData>
  ): string {
    const colors = this.getBrandingColors(branding);
    
    // Inject custom CSS at the beginning of the template
    const brandingCSS = `
      <style>
        ${this.generateBrandingCSS(branding)}
        .branded-header {
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) !important;
        }
        .branded-accent {
          color: var(--brand-accent) !important;
        }
        .branded-primary {
          color: var(--brand-primary) !important;
        }
        .branded-border {
          border-color: var(--brand-primary) !important;
        }
        .branded-button {
          background: var(--brand-primary) !important;
        }
      </style>
    `;
    
    // Insert CSS after <head> tag
    let brandedTemplate = htmlTemplate.replace(
      /<head>/i, 
      `<head>${brandingCSS}`
    );

    // Replace logo placeholder if logo URL exists
    if (branding?.logo_url) {
      const logoElement = `<img src="${branding.logo_url}" alt="${branding.company_name || 'Company Logo'}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px;" />`;
      brandedTemplate = brandedTemplate.replace(
        /<div[^>]*company-logo-placeholder[^>]*>🎨<\/div>/g,
        logoElement
      );
    }

    return brandedTemplate;
  }

  // Validate color format
  static isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  // Get color scheme suggestions
  static getColorSuggestions(): Array<{
    name: string;
    description: string;
    primary: string;
    secondary: string;
    accent: string;
  }> {
    return [
      {
        name: 'Professional Blue',
        description: 'Clean and trustworthy',
        primary: '#3182ce',
        secondary: '#2d3748',
        accent: '#38a169'
      },
      {
        name: 'Elegant Gray',
        description: 'Sophisticated and modern',
        primary: '#4a5568',
        secondary: '#2d3748',
        accent: '#3182ce'
      },
      {
        name: 'Warm Orange',
        description: 'Friendly and energetic',
        primary: '#ed8936',
        secondary: '#2d3748',
        accent: '#38a169'
      },
      {
        name: 'Forest Green',
        description: 'Natural and reliable',
        primary: '#38a169',
        secondary: '#2d3748',
        accent: '#3182ce'
      },
      {
        name: 'Deep Purple',
        description: 'Creative and premium',
        primary: '#805ad5',
        secondary: '#2d3748',
        accent: '#38a169'
      },
      {
        name: 'Burgundy Red',
        description: 'Bold and confident',
        primary: '#c53030',
        secondary: '#2d3748',
        accent: '#38a169'
      }
    ];
  }

  // Generate preview elements
  static generateBrandingPreview(branding: Partial<CompanyBrandingData>): {
    colors: BrandingColors;
    logoElement: string;
    sampleCard: string;
  } {
    const colors = this.getBrandingColors(branding);
    const logoElement = this.getLogoElement(branding);
    
    const sampleCard = `
      <div style="
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 20px 0;
      ">
        <div style="
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          ${logoElement}
          <div>
            <div style="font-weight: bold; font-size: 18px;">${branding.company_name || 'Your Company Name'}</div>
            <div style="opacity: 0.9; font-size: 14px;">${branding.company_tagline || 'Professional Painting Services'}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="color: ${colors.primary}; font-weight: bold; font-size: 16px; margin-bottom: 8px;">
            Sample Quote Header
          </div>
          <div style="color: #4a5568; line-height: 1.6;">
            This is how your professional quotes will look with your custom branding applied.
          </div>
        </div>
        
        <div style="
          background: ${colors.accent};
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
          cursor: pointer;
        ">
          Accept Quote
        </div>
      </div>
    `;
    
    return {
      colors,
      logoElement,
      sampleCard
    };
  }
}

export default CompanyBrandingManager;