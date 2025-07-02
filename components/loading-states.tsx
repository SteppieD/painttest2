/**
 * Enhanced Loading States and UI Feedback
 * 
 * Comprehensive loading indicators with context awareness
 */

'use client';

import React from 'react';
import { Loader2, Wifi, WifiOff, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useOfflineSupport } from '@/hooks/use-offline-support';

export interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  error?: string | null;
  success?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  showNetworkStatus?: boolean;
  retryAction?: () => void;
  className?: string;
}

export function LoadingState({
  isLoading,
  loadingText = 'Loading...',
  error,
  success,
  progress,
  size = 'md',
  variant = 'spinner',
  showNetworkStatus = false,
  retryAction,
  className = ''
}: LoadingStateProps) {
  const { networkStatus, queuedActions } = useOfflineSupport();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (success) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${textSizes[size]} ${className}`}>
        <CheckCircle2 className={sizeClasses[size]} />
        <span>Success!</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 border-red-200 bg-red-50 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            
            {!networkStatus.isOnline && (
              <div className="flex items-center gap-2 mt-2">
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-600">
                  You're offline. Changes will sync when connection is restored.
                </span>
              </div>
            )}
          </div>
          
          {retryAction && (
            <Button size="sm" variant="outline" onClick={retryAction}>
              Try Again
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!isLoading) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Main loading indicator */}
      <div className="flex items-center gap-3">
        {variant === 'spinner' && (
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        )}
        
        {variant === 'dots' && (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} bg-primary rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
        
        {variant === 'pulse' && (
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`} />
        )}
        
        <span className={`${textSizes[size]} text-muted-foreground`}>
          {loadingText}
        </span>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* Network status */}
      {showNetworkStatus && (
        <div className="flex items-center gap-2">
          {networkStatus.isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <Badge variant="secondary" className="text-xs">
                {networkStatus.effectiveType?.toUpperCase() || 'Online'}
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-600" />
              <Badge variant="outline" className="text-xs">
                Offline
              </Badge>
            </>
          )}
          
          {queuedActions.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {queuedActions.length} pending
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export function SkeletonLoader({ 
  lines = 3, 
  className = '',
  showAvatar = false 
}: { 
  lines?: number; 
  className?: string;
  showAvatar?: boolean;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/6" />
          </div>
        </div>
      )}
      
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-muted rounded animate-pulse`}
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

export function QuoteLoadingSkeleton() {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonLoader lines={2} className="flex-1" />
        <div className="w-20 h-8 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-6 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
        <SkeletonLoader lines={3} />
      </div>
    </Card>
  );
}

export function ChatLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-xs p-3 rounded-lg space-y-2 ${
            i % 2 === 0 ? 'bg-muted' : 'bg-primary/10'
          }`}>
            <SkeletonLoader lines={2} />
          </div>
        </div>
      ))}
      
      <div className="flex justify-start">
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-6 bg-muted rounded animate-pulse"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse w-64" />
          <div className="h-4 bg-muted rounded animate-pulse w-48" />
        </div>
        <div className="h-10 bg-muted rounded animate-pulse w-32" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-8 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </Card>
        ))}
      </div>
      
      {/* Main content */}
      <Card className="p-6">
        <div className="space-y-6">
          <SkeletonLoader lines={1} className="w-1/4" />
          <TableLoadingSkeleton />
        </div>
      </Card>
    </div>
  );
}

export function SmartLoadingState({ 
  operation, 
  duration, 
  showTips = true 
}: { 
  operation: string; 
  duration?: number;
  showTips?: boolean;
}) {
  const [tipIndex, setTipIndex] = React.useState(0);
  
  const tips = [
    "💡 You can create quotes using natural language",
    "🎨 Try our paint color recommendations",
    "📱 All changes are automatically saved",
    "🔄 Your data syncs across all devices",
    "⚡ Use keyboard shortcuts for faster navigation"
  ];

  React.useEffect(() => {
    if (!showTips) return;
    
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [showTips, tips.length]);

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{operation}</h3>
        {duration && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Est. {duration}s</span>
          </div>
        )}
      </div>
      
      {showTips && (
        <div className="text-center max-w-sm">
          <p className="text-sm text-muted-foreground transition-opacity duration-500">
            {tips[tipIndex]}
          </p>
        </div>
      )}
    </div>
  );
}

export function NetworkStatusIndicator() {
  const { networkStatus, queuedActions, isSyncing } = useOfflineSupport();
  const [showDetails, setShowDetails] = React.useState(false);

  if (networkStatus.isOnline && queuedActions.length === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card 
        className="p-3 cursor-pointer transition-all hover:shadow-lg"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : networkStatus.isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-600" />
          )}
          
          <div className="text-sm">
            {isSyncing ? 'Syncing...' :
             !networkStatus.isOnline ? 'Offline' :
             queuedActions.length > 0 ? `${queuedActions.length} pending` :
             'Online'}
          </div>
          
          {queuedActions.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {queuedActions.length}
            </Badge>
          )}
        </div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t space-y-2">
            <div className="text-xs text-muted-foreground">
              Connection: {networkStatus.effectiveType || 'Unknown'}
            </div>
            {queuedActions.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {queuedActions.length} action(s) will sync when online
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}