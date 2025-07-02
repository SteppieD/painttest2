/**
 * Input Sanitization and Validation Utilities
 * 
 * Provides secure input sanitization for database operations and API endpoints
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: any;
  error?: string;
}

export class InputSanitizer {
  
  /**
   * Validate and sanitize numeric ID (for company_id, quote_id, etc.)
   */
  static validateId(input: any, fieldName: string = 'ID'): ValidationResult {
    if (input === null || input === undefined) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    const numericId = parseInt(String(input));
    
    if (isNaN(numericId) || numericId <= 0) {
      return { isValid: false, error: `Invalid ${fieldName} format` };
    }

    return { isValid: true, sanitizedValue: numericId };
  }

  /**
   * Validate and sanitize quote status
   */
  static validateQuoteStatus(status: string): ValidationResult {
    const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled', 'draft'];
    
    if (!status || typeof status !== 'string') {
      return { isValid: false, error: 'Status is required' };
    }

    const sanitizedStatus = status.trim().toLowerCase();
    
    if (!allowedStatuses.includes(sanitizedStatus)) {
      return { 
        isValid: false, 
        error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` 
      };
    }

    return { isValid: true, sanitizedValue: sanitizedStatus };
  }

  /**
   * Validate and sanitize timeframe parameter
   */
  static validateTimeframe(timeframe: string): ValidationResult {
    const allowedTimeframes = ['30d', '90d', 'all'];
    
    if (!timeframe || typeof timeframe !== 'string') {
      return { isValid: true, sanitizedValue: '30d' }; // Default value
    }

    const sanitizedTimeframe = timeframe.trim().toLowerCase();
    
    if (!allowedTimeframes.includes(sanitizedTimeframe)) {
      return { isValid: true, sanitizedValue: '30d' }; // Default fallback
    }

    return { isValid: true, sanitizedValue: sanitizedTimeframe };
  }

  /**
   * Validate and sanitize limit parameter for pagination
   */
  static validateLimit(limit: any, defaultLimit: number = 50, maxLimit: number = 100): ValidationResult {
    if (!limit) {
      return { isValid: true, sanitizedValue: defaultLimit };
    }

    const numericLimit = parseInt(String(limit));
    
    if (isNaN(numericLimit) || numericLimit <= 0) {
      return { isValid: true, sanitizedValue: defaultLimit };
    }

    const sanitizedLimit = Math.min(Math.max(numericLimit, 1), maxLimit);
    return { isValid: true, sanitizedValue: sanitizedLimit };
  }

  /**
   * Validate and sanitize string input (for names, addresses, etc.)
   */
  static validateString(input: any, fieldName: string, minLength: number = 1, maxLength: number = 255): ValidationResult {
    if (input === null || input === undefined) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (typeof input !== 'string') {
      return { isValid: false, error: `${fieldName} must be a string` };
    }

    const sanitizedInput = input.trim();
    
    if (sanitizedInput.length < minLength) {
      return { isValid: false, error: `${fieldName} must be at least ${minLength} characters long` };
    }

    if (sanitizedInput.length > maxLength) {
      return { isValid: false, error: `${fieldName} must be no more than ${maxLength} characters long` };
    }

    // Basic XSS protection - remove potentially dangerous characters
    const xssProtected = sanitizedInput
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    return { isValid: true, sanitizedValue: xssProtected };
  }

  /**
   * Validate and sanitize email address
   */
  static validateEmail(email: any): ValidationResult {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    if (typeof email !== 'string') {
      return { isValid: false, error: 'Email must be a string' };
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitizedEmail)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    if (sanitizedEmail.length > 254) {
      return { isValid: false, error: 'Email address too long' };
    }

    return { isValid: true, sanitizedValue: sanitizedEmail };
  }

  /**
   * Validate and sanitize phone number
   */
  static validatePhone(phone: any): ValidationResult {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' };
    }

    if (typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number must be a string' };
    }

    // Remove all non-numeric characters
    const numbersOnly = phone.replace(/\D/g, '');
    
    // US phone number validation (10 or 11 digits)
    if (numbersOnly.length === 10) {
      return { isValid: true, sanitizedValue: `+1${numbersOnly}` };
    } else if (numbersOnly.length === 11 && numbersOnly.startsWith('1')) {
      return { isValid: true, sanitizedValue: `+${numbersOnly}` };
    } else {
      return { isValid: false, error: 'Invalid phone number format' };
    }
  }

  /**
   * Validate and sanitize JSON input
   */
  static validateJSON(input: any, fieldName: string): ValidationResult {
    if (!input) {
      return { isValid: true, sanitizedValue: {} };
    }

    if (typeof input === 'object') {
      try {
        // Ensure it's valid JSON by stringifying and parsing
        const jsonString = JSON.stringify(input);
        const parsed = JSON.parse(jsonString);
        return { isValid: true, sanitizedValue: parsed };
      } catch (e) {
        return { isValid: false, error: `Invalid ${fieldName} object` };
      }
    }

    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return { isValid: true, sanitizedValue: parsed };
      } catch (e) {
        return { isValid: false, error: `Invalid ${fieldName} JSON format` };
      }
    }

    return { isValid: false, error: `${fieldName} must be a valid JSON object or string` };
  }

  /**
   * Build safe WHERE clause for database queries
   */
  static buildWhereClause(conditions: Array<{ field: string; operator: string; value: any }>): { 
    whereClause: string; 
    params: any[] 
  } {
    if (conditions.length === 0) {
      return { whereClause: '1=1', params: [] };
    }

    const clauses = conditions.map(condition => `${condition.field} ${condition.operator} ?`);
    const params = conditions.map(condition => condition.value);

    return {
      whereClause: clauses.join(' AND '),
      params
    };
  }

  /**
   * Escape special characters for LIKE queries
   */
  static escapeLikeValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
  }
}

/**
 * Middleware helper for validating request parameters
 */
export function validateRequestParams(params: Record<string, any>, validations: Record<string, Function>): {
  isValid: boolean;
  sanitizedParams: Record<string, any>;
  errors: string[];
} {
  const sanitizedParams: Record<string, any> = {};
  const errors: string[] = [];

  for (const [key, validationFn] of Object.entries(validations)) {
    const result = validationFn(params[key]);
    
    if (result.isValid) {
      sanitizedParams[key] = result.sanitizedValue;
    } else {
      errors.push(result.error);
    }
  }

  return {
    isValid: errors.length === 0,
    sanitizedParams,
    errors
  };
}