/**
 * Enhanced Error Handling and User Feedback System
 * 
 * Provides comprehensive error handling, user feedback mechanisms,
 * and client-side validation integration
 */

import { z } from 'zod';

export interface UserFeedback {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  details?: string[];
  actionable?: boolean;
  actions?: FeedbackAction[];
  dismissible?: boolean;
  duration?: number; // Auto-dismiss after milliseconds
  field?: string; // For form field-specific errors
}

export interface FeedbackAction {
  label: string;
  action: 'retry' | 'dismiss' | 'navigate' | 'custom';
  target?: string; // URL for navigate, function name for custom
  variant?: 'primary' | 'secondary' | 'destructive';
}

export interface ValidationFeedback {
  field: string;
  message: string;
  type: 'error' | 'warning';
  suggestions?: string[];
}

export interface ErrorContext {
  operation: string;
  entityType?: string;
  entityId?: string | number;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  timestamp: string;
  stackTrace?: string;
}

export class ErrorHandler {
  private static feedbackQueue: UserFeedback[] = [];
  private static errorLog: (ErrorContext & { error: any })[] = [];

  /**
   * Convert API errors to user-friendly feedback
   */
  static apiErrorToFeedback(error: any, context: Partial<ErrorContext> = {}): UserFeedback {
    const baseContext: ErrorContext = {
      operation: context.operation || 'unknown',
      timestamp: new Date().toISOString(),
      ...context
    };

    // Log error for debugging
    this.logError(error, baseContext);

    // Handle different error types
    if (error.response) {
      // HTTP error response
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return this.createValidationErrorFeedback(data, baseContext);
        case 401:
          return this.createAuthErrorFeedback(data, baseContext);
        case 403:
          return this.createPermissionErrorFeedback(data, baseContext);
        case 404:
          return this.createNotFoundErrorFeedback(data, baseContext);
        case 409:
          return this.createConflictErrorFeedback(data, baseContext);
        case 422:
          return this.createValidationErrorFeedback(data, baseContext);
        case 429:
          return this.createRateLimitErrorFeedback(data, baseContext);
        case 500:
          return this.createServerErrorFeedback(data, baseContext);
        default:
          return this.createGenericErrorFeedback(data, baseContext);
      }
    }

    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
      return this.createNetworkErrorFeedback(error, baseContext);
    }

    if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
      return this.createTimeoutErrorFeedback(error, baseContext);
    }

    // Validation errors from Zod
    if (error instanceof z.ZodError) {
      return this.createZodErrorFeedback(error, baseContext);
    }

    // Generic error
    return this.createGenericErrorFeedback(error, baseContext);
  }

  /**
   * Create success feedback
   */
  static createSuccessFeedback(
    operation: string,
    message?: string,
    details?: string[]
  ): UserFeedback {
    const operationMessages: Record<string, string> = {
      'quote_created': 'Quote created successfully',
      'quote_updated': 'Quote updated successfully',
      'quote_deleted': 'Quote deleted successfully',
      'customer_created': 'Customer added successfully',
      'customer_updated': 'Customer updated successfully',
      'company_created': 'Company account created successfully',
      'settings_saved': 'Settings saved successfully',
      'data_exported': 'Data exported successfully',
      'email_sent': 'Email sent successfully',
      'backup_created': 'Backup created successfully'
    };

    return {
      type: 'success',
      title: 'Success',
      message: message || operationMessages[operation] || 'Operation completed successfully',
      details,
      dismissible: true,
      duration: 5000
    };
  }

  /**
   * Validation error feedback
   */
  private static createValidationErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    const errors = Array.isArray(data.errors) ? data.errors : [data.message || 'Validation failed'];
    
    return {
      type: 'error',
      title: 'Invalid Input',
      message: 'Please check the following issues:',
      details: errors,
      actionable: true,
      actions: [
        {
          label: 'Fix Issues',
          action: 'dismiss',
          variant: 'primary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Authentication error feedback
   */
  private static createAuthErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'error',
      title: 'Authentication Required',
      message: 'You need to sign in to continue',
      actionable: true,
      actions: [
        {
          label: 'Sign In',
          action: 'navigate',
          target: '/access-code',
          variant: 'primary'
        },
        {
          label: 'Cancel',
          action: 'dismiss',
          variant: 'secondary'
        }
      ],
      dismissible: false
    };
  }

  /**
   * Permission error feedback
   */
  private static createPermissionErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'error',
      title: 'Access Denied',
      message: 'You don\'t have permission to perform this action',
      details: ['Contact your administrator if you believe this is an error'],
      actionable: true,
      actions: [
        {
          label: 'Go Back',
          action: 'navigate',
          target: '/dashboard',
          variant: 'primary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Not found error feedback
   */
  private static createNotFoundErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    const entityType = context.entityType || 'item';
    
    return {
      type: 'error',
      title: 'Not Found',
      message: `The ${entityType} you're looking for doesn't exist`,
      details: ['It may have been deleted or moved'],
      actionable: true,
      actions: [
        {
          label: 'Go Back',
          action: 'navigate',
          target: '/dashboard',
          variant: 'primary'
        },
        {
          label: 'Refresh Page',
          action: 'custom',
          target: 'window.location.reload',
          variant: 'secondary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Conflict error feedback
   */
  private static createConflictErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'error',
      title: 'Data Conflict',
      message: 'The data has been modified by another user',
      details: ['Please refresh and try again'],
      actionable: true,
      actions: [
        {
          label: 'Refresh',
          action: 'custom',
          target: 'window.location.reload',
          variant: 'primary'
        },
        {
          label: 'Cancel',
          action: 'dismiss',
          variant: 'secondary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Rate limit error feedback
   */
  private static createRateLimitErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    const retryAfter = data.details?.retryAfter || 60;
    
    return {
      type: 'warning',
      title: 'Too Many Requests',
      message: 'You\'re sending requests too quickly',
      details: [`Please wait ${retryAfter} seconds before trying again`],
      actionable: true,
      actions: [
        {
          label: 'Try Again Later',
          action: 'dismiss',
          variant: 'primary'
        }
      ],
      dismissible: true,
      duration: retryAfter * 1000
    };
  }

  /**
   * Server error feedback
   */
  private static createServerErrorFeedback(
    data: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'error',
      title: 'Server Error',
      message: 'Something went wrong on our end',
      details: [
        'Our team has been notified',
        'Please try again in a few minutes'
      ],
      actionable: true,
      actions: [
        {
          label: 'Try Again',
          action: 'retry',
          variant: 'primary'
        },
        {
          label: 'Contact Support',
          action: 'navigate',
          target: '/contact',
          variant: 'secondary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Network error feedback
   */
  private static createNetworkErrorFeedback(
    error: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'error',
      title: 'Connection Error',
      message: 'Unable to connect to the server',
      details: [
        'Check your internet connection',
        'The server may be temporarily unavailable'
      ],
      actionable: true,
      actions: [
        {
          label: 'Try Again',
          action: 'retry',
          variant: 'primary'
        },
        {
          label: 'Check Connection',
          action: 'custom',
          target: 'checkConnection',
          variant: 'secondary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Timeout error feedback
   */
  private static createTimeoutErrorFeedback(
    error: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'warning',
      title: 'Request Timeout',
      message: 'The request is taking longer than expected',
      details: ['This might be due to heavy server load'],
      actionable: true,
      actions: [
        {
          label: 'Try Again',
          action: 'retry',
          variant: 'primary'
        },
        {
          label: 'Cancel',
          action: 'dismiss',
          variant: 'secondary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Zod validation error feedback
   */
  private static createZodErrorFeedback(
    error: z.ZodError,
    context: ErrorContext
  ): UserFeedback {
    const errors = error.errors.map(err => {
      const field = err.path.join('.');
      return `${field}: ${err.message}`;
    });

    return {
      type: 'error',
      title: 'Validation Error',
      message: 'Please fix the following issues:',
      details: errors,
      actionable: true,
      actions: [
        {
          label: 'Fix Issues',
          action: 'dismiss',
          variant: 'primary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Generic error feedback
   */
  private static createGenericErrorFeedback(
    error: any,
    context: ErrorContext
  ): UserFeedback {
    return {
      type: 'error',
      title: 'Error',
      message: error.message || 'An unexpected error occurred',
      details: ['Please try again or contact support if the problem persists'],
      actionable: true,
      actions: [
        {
          label: 'Try Again',
          action: 'retry',
          variant: 'primary'
        },
        {
          label: 'Contact Support',
          action: 'navigate',
          target: '/contact',
          variant: 'secondary'
        }
      ],
      dismissible: true
    };
  }

  /**
   * Log error for debugging
   */
  private static logError(error: any, context: ErrorContext): void {
    const logEntry = {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      }
    };

    this.errorLog.push(logEntry);

    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', logEntry);
    }
  }

  /**
   * Get error logs (for debugging/monitoring)
   */
  static getErrorLogs(): (ErrorContext & { error: any })[] {
    return [...this.errorLog];
  }

  /**
   * Clear error logs
   */
  static clearErrorLogs(): void {
    this.errorLog = [];
  }
}

/**
 * Client-side form validation helpers
 */
export class FormValidator {
  private errors: Map<string, ValidationFeedback> = new Map();
  private warnings: Map<string, ValidationFeedback> = new Map();

  /**
   * Validate a field with Zod schema
   */
  validateField(
    fieldName: string,
    value: any,
    schema: z.ZodSchema,
    options: { showWarnings?: boolean } = {}
  ): ValidationFeedback | null {
    try {
      schema.parse(value);
      
      // Clear any existing errors for this field
      this.errors.delete(fieldName);
      this.warnings.delete(fieldName);
      
      return null;
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        const feedback: ValidationFeedback = {
          field: fieldName,
          message: firstError.message,
          type: 'error'
        };

        this.errors.set(fieldName, feedback);
        return feedback;
      }
      
      return null;
    }
  }

  /**
   * Validate entire form
   */
  validateForm(
    data: Record<string, any>,
    schema: z.ZodSchema
  ): {
    isValid: boolean;
    errors: ValidationFeedback[];
    warnings: ValidationFeedback[];
  } {
    this.errors.clear();
    this.warnings.clear();

    try {
      schema.parse(data);
      
      return {
        isValid: true,
        errors: [],
        warnings: []
      };
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationFeedback[] = [];
        
        for (const zodError of error.errors) {
          const fieldName = zodError.path.join('.');
          const feedback: ValidationFeedback = {
            field: fieldName,
            message: zodError.message,
            type: 'error',
            suggestions: this.getSuggestions(zodError)
          };
          
          errors.push(feedback);
          this.errors.set(fieldName, feedback);
        }

        return {
          isValid: false,
          errors,
          warnings: Array.from(this.warnings.values())
        };
      }
      
      return {
        isValid: false,
        errors: [{
          field: 'form',
          message: 'Validation failed',
          type: 'error'
        }],
        warnings: []
      };
    }
  }

  /**
   * Get suggestions for common validation errors
   */
  private getSuggestions(error: z.ZodIssue): string[] {
    const suggestions: string[] = [];

    switch (error.code) {
      case 'invalid_string':
        if (error.validation === 'email') {
          suggestions.push('Make sure to include @ and a domain (e.g., user@example.com)');
        }
        if (error.validation === 'url') {
          suggestions.push('Include http:// or https:// at the beginning');
        }
        break;
        
      case 'too_small':
        if (error.type === 'string') {
          suggestions.push(`Must be at least ${error.minimum} characters long`);
        }
        if (error.type === 'number') {
          suggestions.push(`Must be at least ${error.minimum}`);
        }
        break;
        
      case 'too_big':
        if (error.type === 'string') {
          suggestions.push(`Must be no more than ${error.maximum} characters`);
        }
        if (error.type === 'number') {
          suggestions.push(`Must be no more than ${error.maximum}`);
        }
        break;
        
      case 'invalid_type':
        suggestions.push(`Expected ${error.expected}, got ${error.received}`);
        break;
    }

    return suggestions;
  }

  /**
   * Get field error
   */
  getFieldError(fieldName: string): ValidationFeedback | null {
    return this.errors.get(fieldName) || null;
  }

  /**
   * Get all errors
   */
  getAllErrors(): ValidationFeedback[] {
    return Array.from(this.errors.values());
  }

  /**
   * Check if form has errors
   */
  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors.clear();
    this.warnings.clear();
  }
}

/**
 * Toast notification system for user feedback
 */
export class ToastManager {
  private static toasts: (UserFeedback & { id: string })[] = [];
  private static listeners: Set<(toasts: typeof ToastManager.toasts) => void> = new Set();

  /**
   * Show a toast notification
   */
  static show(feedback: UserFeedback): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const toast = { ...feedback, id };
    
    this.toasts.push(toast);
    this.notifyListeners();

    // Auto-dismiss if duration is set
    if (feedback.duration) {
      setTimeout(() => {
        this.dismiss(id);
      }, feedback.duration);
    }

    return id;
  }

  /**
   * Dismiss a toast notification
   */
  static dismiss(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  /**
   * Dismiss all toast notifications
   */
  static dismissAll(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  /**
   * Get all active toasts
   */
  static getToasts(): (UserFeedback & { id: string })[] {
    return [...this.toasts];
  }

  /**
   * Subscribe to toast changes
   */
  static subscribe(listener: (toasts: typeof ToastManager.toasts) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  private static notifyListeners(): void {
    for (const listener of this.listeners) {
      listener([...this.toasts]);
    }
  }
}

/**
 * Utility functions for error handling in React components
 */
export const ErrorUtils = {
  /**
   * Handle async operation with error feedback
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext> = {}
  ): Promise<{ data?: T; error?: UserFeedback }> {
    try {
      const data = await operation();
      return { data };
    } catch (error) {
      const feedback = ErrorHandler.apiErrorToFeedback(error, context);
      ToastManager.show(feedback);
      return { error: feedback };
    }
  },

  /**
   * Create form submission handler
   */
  createSubmitHandler<T>(
    submitFn: (data: T) => Promise<any>,
    options: {
      successMessage?: string;
      errorContext?: Partial<ErrorContext>;
      onSuccess?: (result: any) => void;
      onError?: (feedback: UserFeedback) => void;
    } = {}
  ) {
    return async (data: T) => {
      try {
        const result = await submitFn(data);
        
        const successFeedback = ErrorHandler.createSuccessFeedback(
          'form_submit',
          options.successMessage
        );
        ToastManager.show(successFeedback);
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
        
      } catch (error) {
        const feedback = ErrorHandler.apiErrorToFeedback(error, options.errorContext);
        ToastManager.show(feedback);
        
        if (options.onError) {
          options.onError(feedback);
        }
        
        throw error;
      }
    };
  }
};