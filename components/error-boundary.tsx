/**
 * React Error Boundary Components
 * 
 * Comprehensive error handling throughout the application
 */

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  showDetails: boolean;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'app' | 'page' | 'component';
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo
    });

    // Report error to logging service
    this.reportError(error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys = [], resetOnPropsChange = false } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        level: this.props.level || 'component'
      };

      // Send to monitoring service (implement based on your service)
      console.error('Error Report:', errorReport);

      // Store in localStorage for debugging
      const errorLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
      errorLogs.push(errorReport);
      
      // Keep only last 10 errors
      if (errorLogs.length > 10) {
        errorLogs.splice(0, errorLogs.length - 10);
      }
      
      localStorage.setItem('error-logs', JSON.stringify(errorLogs));

    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
      retryCount: 0
    });
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount >= 3) {
      // Max retries reached, suggest page reload
      if (confirm('Multiple retry attempts failed. Would you like to reload the page?')) {
        window.location.reload();
      }
      return;
    }

    this.setState({
      retryCount: retryCount + 1
    });

    // Reset with a small delay to allow state to settle
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, 100);
  };

  private handleReloadPage = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  private getErrorLevel(): 'critical' | 'high' | 'medium' | 'low' {
    const { error } = this.state;
    const { level = 'component' } = this.props;

    if (level === 'app') return 'critical';
    if (level === 'page') return 'high';

    // Analyze error type
    if (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')) {
      return 'medium';
    }

    if (error?.name === 'TypeError' || error?.name === 'ReferenceError') {
      return 'high';
    }

    return 'medium';
  }

  private getErrorMessage(): string {
    const { error } = this.state;
    const { level = 'component' } = this.props;

    if (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')) {
      return 'Failed to load application resources. This might be due to a network issue or an app update.';
    }

    if (level === 'app') {
      return 'A critical error occurred that prevents the application from running properly.';
    }

    if (level === 'page') {
      return 'An error occurred while loading this page. Some features may not work correctly.';
    }

    return 'An unexpected error occurred in this component.';
  }

  private getActionButtons() {
    const { level = 'component' } = this.props;
    const { retryCount } = this.state;
    const errorLevel = this.getErrorLevel();

    const buttons = [];

    // Retry button (always available for first 3 attempts)
    if (retryCount < 3) {
      buttons.push(
        <Button key="retry" onClick={this.handleRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again {retryCount > 0 && `(${retryCount}/3)`}
        </Button>
      );
    }

    // Reload page button for high-level errors
    if (level === 'page' || errorLevel === 'critical' || errorLevel === 'high') {
      buttons.push(
        <Button key="reload" variant="outline" onClick={this.handleReloadPage} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reload Page
        </Button>
      );
    }

    // Go home button for critical errors
    if (level === 'app' || errorLevel === 'critical') {
      buttons.push(
        <Button key="home" variant="outline" onClick={this.handleGoHome} className="gap-2">
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      );
    }

    return buttons;
  }

  render() {
    const { hasError, error, errorInfo, errorId, showDetails } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const errorLevel = this.getErrorLevel();
      const errorMessage = this.getErrorMessage();
      const actionButtons = this.getActionButtons();

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-6 space-y-6">
            {/* Error Header */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                errorLevel === 'critical' ? 'bg-red-100' :
                errorLevel === 'high' ? 'bg-orange-100' :
                errorLevel === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  errorLevel === 'critical' ? 'text-red-600' :
                  errorLevel === 'high' ? 'text-orange-600' :
                  errorLevel === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Something went wrong</h3>
                  <Badge variant={
                    errorLevel === 'critical' ? 'destructive' :
                    errorLevel === 'high' ? 'destructive' :
                    errorLevel === 'medium' ? 'default' : 'secondary'
                  }>
                    {errorLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">
                  {errorMessage}
                </p>

                {error && (
                  <div className="text-sm font-mono bg-muted p-2 rounded border">
                    {error.name}: {error.message}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {actionButtons}
            </div>

            {/* Error Details (Collapsible) */}
            {(error || errorInfo) && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.toggleDetails}
                  className="gap-2 text-muted-foreground"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Details
                    </>
                  )}
                </Button>

                {showDetails && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium mb-2">Error ID:</p>
                      <code className="text-xs bg-background p-2 rounded border block">
                        {errorId}
                      </code>
                    </div>

                    {error?.stack && (
                      <div>
                        <p className="text-sm font-medium mb-2">Stack Trace:</p>
                        <pre className="text-xs bg-background p-3 rounded border overflow-auto max-h-40">
                          {error.stack}
                        </pre>
                      </div>
                    )}

                    {errorInfo?.componentStack && (
                      <div>
                        <p className="text-sm font-medium mb-2">Component Stack:</p>
                        <pre className="text-xs bg-background p-3 rounded border overflow-auto max-h-40">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <p>Time: {new Date().toLocaleString()}</p>
                      <p>URL: {window.location.href}</p>
                      <p>User Agent: {navigator.userAgent}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Help Text */}
            <div className="text-sm text-muted-foreground border-t pt-4">
              <p>
                If this error persists, please contact support with the error ID above.
                {errorLevel === 'medium' && ' This might be a temporary issue that will resolve itself.'}
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return children;
  }
}

/**
 * Higher-order component for adding error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for manually reporting errors
 */
export function useErrorHandler() {
  const reportError = (error: Error, context?: string) => {
    console.error('Manual error report:', error, context);
    
    try {
      const errorReport = {
        errorId: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: error.message,
        stack: error.stack,
        context: context || 'Manual report',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const errorLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
      errorLogs.push(errorReport);
      
      if (errorLogs.length > 10) {
        errorLogs.splice(0, errorLogs.length - 10);
      }
      
      localStorage.setItem('error-logs', JSON.stringify(errorLogs));

    } catch (reportingError) {
      console.error('Failed to report manual error:', reportingError);
    }
  };

  return { reportError };
}

/**
 * Async error boundary for handling promise rejections
 */
export function useAsyncErrorHandler() {
  const { reportError } = useErrorHandler();

  const handleAsyncError = async <T,>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, context);
      }
      throw error;
    }
  };

  return { handleAsyncError };
}