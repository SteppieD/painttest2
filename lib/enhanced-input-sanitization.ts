/**
 * Enhanced Input Sanitization
 * 
 * Comprehensive sanitization to prevent XSS, SQL injection, and other attacks
 */

import { escape } from 'html-escaper';

export class InputSanitizer {
  /**
   * Sanitize string input to prevent XSS
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Remove null bytes and control characters
    let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Normalize unicode
    sanitized = sanitized.normalize('NFKC');
    
    // Escape HTML entities
    sanitized = escape(sanitized);

    // Remove SQL injection patterns (additional layer of protection)
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;)/g,
      /(\b(OR|AND)\s+\w+\s*=\s*\w+)/gi
    ];

    for (const pattern of sqlPatterns) {
      sanitized = sanitized.replace(pattern, '');
    }

    // Trim whitespace
    return sanitized.trim();
  }

  /**
   * Sanitize HTML content (for rich text fields)
   */
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Basic HTML sanitization - remove script tags and dangerous attributes
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');

    return sanitized;
  }

  /**
   * Sanitize email address
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') {
      return '';
    }

    // Basic sanitization
    let sanitized = this.sanitizeString(email);
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(sanitized)) {
      return '';
    }

    return sanitized.toLowerCase();
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    if (typeof phone !== 'string') {
      return '';
    }

    // Remove all non-numeric characters except + and -
    let sanitized = phone.replace(/[^\d+\-\s()]/g, '');
    
    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    // Basic phone validation (US format)
    const phoneRegex = /^[\+]?[1]?[\s\-\(\)]?(\d{3})[\s\-\(\)]?(\d{3})[\s\-]?(\d{4})$/;
    
    if (phoneRegex.test(sanitized)) {
      return sanitized;
    }

    // Return original if it doesn't match but has some digits
    if (/\d/.test(sanitized) && sanitized.length >= 10) {
      return sanitized;
    }

    return '';
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(input: any, options: {
    min?: number;
    max?: number;
    decimals?: number;
    allowNegative?: boolean;
  } = {}): number {
    const {
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      decimals = 2,
      allowNegative = true
    } = options;

    let num = parseFloat(String(input));

    if (isNaN(num)) {
      return 0;
    }

    // Check negative values
    if (!allowNegative && num < 0) {
      num = 0;
    }

    // Apply bounds
    num = Math.max(min, Math.min(max, num));

    // Round to specified decimal places
    num = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);

    return num;
  }

  /**
   * Sanitize access code
   */
  static sanitizeAccessCode(code: string): string {
    if (typeof code !== 'string') {
      return '';
    }

    // Remove all non-alphanumeric characters and convert to uppercase
    const sanitized = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Validate length (4-20 characters)
    if (sanitized.length < 4 || sanitized.length > 20) {
      return '';
    }

    return sanitized;
  }

  /**
   * Sanitize address
   */
  static sanitizeAddress(address: string): string {
    if (typeof address !== 'string') {
      return '';
    }

    let sanitized = this.sanitizeString(address);

    // Allow common address characters
    sanitized = sanitized.replace(/[^\w\s\-\.,#]/g, '');

    // Limit length
    if (sanitized.length > 500) {
      sanitized = sanitized.substring(0, 500);
    }

    return sanitized.trim();
  }

  /**
   * Sanitize customer name
   */
  static sanitizeCustomerName(name: string): string {
    if (typeof name !== 'string') {
      return '';
    }

    let sanitized = this.sanitizeString(name);

    // Allow only letters, spaces, hyphens, and apostrophes
    sanitized = sanitized.replace(/[^\w\s\-']/g, '');

    // Remove extra spaces
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Limit length
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 100);
    }

    // Capitalize properly
    sanitized = sanitized.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return sanitized.trim();
  }

  /**
   * Sanitize company name
   */
  static sanitizeCompanyName(name: string): string {
    if (typeof name !== 'string') {
      return '';
    }

    let sanitized = this.sanitizeString(name);

    // Allow letters, numbers, spaces, and common business characters
    sanitized = sanitized.replace(/[^\w\s\-&'.,]/g, '');

    // Remove extra spaces
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Limit length
    if (sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    }

    return sanitized.trim();
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    if (typeof url !== 'string') {
      return '';
    }

    let sanitized = this.sanitizeString(url);

    // Basic URL validation
    try {
      const urlObj = new URL(sanitized);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }

      return urlObj.href;
    } catch {
      // If not a valid URL, try adding https://
      try {
        const urlObj = new URL(`https://${sanitized}`);
        return urlObj.href;
      } catch {
        return '';
      }
    }
  }

  /**
   * Sanitize notes/comments
   */
  static sanitizeNotes(notes: string): string {
    if (typeof notes !== 'string') {
      return '';
    }

    let sanitized = this.sanitizeString(notes);

    // Limit length
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
    }

    return sanitized.trim();
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject(obj: any, schema?: Record<string, string>): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (typeof obj === 'number') {
      return isNaN(obj) ? 0 : obj;
    }

    if (typeof obj === 'boolean') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, schema));
    }

    if (typeof obj === 'object') {
      const sanitized: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = this.sanitizeString(key);
        
        if (schema && schema[sanitizedKey]) {
          // Use specific sanitization method based on schema
          switch (schema[sanitizedKey]) {
            case 'email':
              sanitized[sanitizedKey] = this.sanitizeEmail(value);
              break;
            case 'phone':
              sanitized[sanitizedKey] = this.sanitizePhone(value);
              break;
            case 'number':
              sanitized[sanitizedKey] = this.sanitizeNumber(value);
              break;
            case 'url':
              sanitized[sanitizedKey] = this.sanitizeUrl(value);
              break;
            case 'html':
              sanitized[sanitizedKey] = this.sanitizeHtml(value);
              break;
            case 'address':
              sanitized[sanitizedKey] = this.sanitizeAddress(value);
              break;
            case 'customerName':
              sanitized[sanitizedKey] = this.sanitizeCustomerName(value);
              break;
            case 'companyName':
              sanitized[sanitizedKey] = this.sanitizeCompanyName(value);
              break;
            case 'accessCode':
              sanitized[sanitizedKey] = this.sanitizeAccessCode(value);
              break;
            case 'notes':
              sanitized[sanitizedKey] = this.sanitizeNotes(value);
              break;
            default:
              sanitized[sanitizedKey] = this.sanitizeObject(value, schema);
          }
        } else {
          sanitized[sanitizedKey] = this.sanitizeObject(value, schema);
        }
      }
      
      return sanitized;
    }

    return obj;
  }

  /**
   * Create sanitization schema for common entities
   */
  static getQuoteSanitizationSchema(): Record<string, string> {
    return {
      customer_name: 'customerName',
      customer_email: 'email',
      customer_phone: 'phone',
      address: 'address',
      walls_sqft: 'number',
      ceilings_sqft: 'number',
      trim_sqft: 'number',
      walls_rate: 'number',
      ceilings_rate: 'number',
      trim_rate: 'number',
      notes: 'notes'
    };
  }

  static getCompanySanitizationSchema(): Record<string, string> {
    return {
      company_name: 'companyName',
      access_code: 'accessCode',
      phone: 'phone',
      email: 'email',
      address: 'address',
      website: 'url',
      default_walls_rate: 'number',
      default_ceilings_rate: 'number',
      default_trim_rate: 'number'
    };
  }

  static getCustomerSanitizationSchema(): Record<string, string> {
    return {
      name: 'customerName',
      email: 'email',
      phone: 'phone',
      address: 'address',
      notes: 'notes'
    };
  }
}