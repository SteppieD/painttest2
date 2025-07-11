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
      <div ${className}`}>
        <CheckCircle2 />
        <span>Success!</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card`}>
        <div>
          <AlertTriangle />
          <div>
            <p>Error</p>
            <p>{error}</p>
            
            {!networkStatus.isOnline && (
              <div>
                <WifiOff />
                <span>
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
    <div`}>
      {/* Main loading indicator */}
      <div>
        {variant === 'spinner' && (
          <Loader2 animate-spin text-primary`} />
        )}
        
        {variant === 'dots' && (
          <div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                bg-primary rounded-full animate-pulse`}
               s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
        
        {variant === 'pulse' && (
          <div bg-primary rounded-full animate-pulse`} />
        )}
        
        <span text-muted-foreground`}>
          {loadingText}
        </span>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div>
          <Progress value={progress} />
          <div>
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* Network status */}
      {showNetworkStatus && (
        <div>
          {networkStatus.isOnline ? (
            <>
              <Wifi />
              <Badge variant="secondary">
                {networkStatus.effectiveType?.toUpperCase() || 'Online'}
              </Badge>
            </>
          ) : (
            <>
              <WifiOff />
              <Badge variant="outline">
                Offline
              </Badge>
            </>
          )}
          
          {queuedActions.length > 0 && (
            <Badge variant="outline">
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
    <div`}>
      {showAvatar && (
        <div>
          <div />
          <div>
            <div />
            <div />
          </div>
        </div>
      )}
      
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
         
         %`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

export function QuoteLoadingSkeleton() {
  return (
    <Card>
      <div>
        <SkeletonLoader lines={2} />
        <div />
      </div>
      
      <div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div />
            <div />
          </div>
        ))}
      </div>
      
      <div>
        <div />
        <SkeletonLoader lines={3} />
      </div>
    </Card>
  );
}

export function ChatLoadingSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}`}>
          <div`}>
            <SkeletonLoader lines={2} />
          </div>
        </div>
      ))}
      
      <div>
        <div>
          <div>
            <div>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                 
                 s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
            <span>AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div>
      {/* Header */}
      <div, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
             
             s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div />
          <div />
        </div>
        <div />
      </div>
      
      {/* Stats */}
      <div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div>
              <div />
              <div />
              <div />
            </div>
          </Card>
        ))}
      </div>
      
      {/* Main content */}
      <Card>
        <div>
          <SkeletonLoader lines={1} />
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
    <div>
      <div>
        <div />
        <div>
          <Zap />
        </div>
      </div>
      
      <div>
        <h3>{operation}</h3>
        {duration && (
          <div>
            <Clock />
            <span>Est. {duration}s</span>
          </div>
        )}
      </div>
      
      {showTips && (
        <div>
          <p>
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
    <div>
      <Card 
       
        onClick={() => setShowDetails(!showDetails)}
      >
        <div>
          {isSyncing ? (
            <Loader2 />
          ) : networkStatus.isOnline ? (
            <Wifi />
          ) : (
            <WifiOff />
          )}
          
          <div>
            {isSyncing ? 'Syncing...' :
             !networkStatus.isOnline ? 'Offline' :
             queuedActions.length > 0 ? `${queuedActions.length} pending` :
             'Online'}
          </div>
          
          {queuedActions.length > 0 && (
            <Badge variant="outline">
              {queuedActions.length}
            </Badge>
          )}
        </div>
        
        {showDetails && (
          <div>
            <div>
              Connection: {networkStatus.effectiveType || 'Unknown'}
            </div>
            {queuedActions.length > 0 && (
              <div>
                {queuedActions.length} action(s) will sync when online
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}