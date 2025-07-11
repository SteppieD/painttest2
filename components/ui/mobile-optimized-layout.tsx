"use client";

import { useState, useEffect, useRef } from "react";
interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  showBottomPadding?: boolean;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  className?: string;
}

interface SwipeDetectorProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  hapticFeedback?: boolean;
}

interface VirtualKeyboardDetectorProps {
  children: React.ReactNode;
  onKeyboardOpen?: () => void;
  onKeyboardClose?: () => void;
}

// Main mobile-optimized layout wrapper
export function MobileOptimizedLayout({
  children,
  showBottomPadding = true,
  enablePullToRefresh = false,
  onRefresh,
  className
}: MobileOptimizedLayoutProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enablePullToRefresh || !onRefresh) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enablePullToRefresh || !onRefresh || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Only allow pull to refresh when at top of page
    const isAtTop = containerRef.current?.scrollTop === 0;
    
    if (isAtTop && diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 80)); // Damping effect
      
      // Prevent default scrolling when pulling
      if (diff > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!enablePullToRefresh || !onRefresh || isRefreshing) return;
    
    if (pullDistance > 60) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      ref={containerRef}
     
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
        <div 
         
          style={{ 
            transform: `translateY(-${Math.max(60 - pullDistance, 0)}px)`,
            opacity: Math.min(pullDistance / 60, 1)
          }}
        >
          {isRefreshing ? (
            <div>
              <div></div>
              <span>Refreshing...</span>
            </div>
          ) : (
            <span>{pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}</span>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
}

// Swipe gesture detector
export function SwipeDetector({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className
}: SwipeDetectorProps) {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const endPos = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const deltaX = endPos.x - startPos.x;
    const deltaY = endPos.y - startPos.y;
    
    // Determine if gesture qualifies as a swipe
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (Math.max(absX, absY) < threshold) {
      setIsSwiping(false);
      return;
    }
    
    // Determine swipe direction
    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
    
    setIsSwiping(false);
  };

  return (
    <div
     
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Touch-friendly button with proper sizing and feedback
export function TouchFriendlyButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  hapticFeedback = false
}: TouchFriendlyButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    if (disabled) return;
    setIsPressed(true);
    
    // Haptic feedback (iOS Safari)
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (!disabled) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 active:bg-gray-300';
      case 'ghost':
        return 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'min-h-[40px] px-4 text-sm';
      case 'large':
        return 'min-h-[56px] px-8 text-lg';
      default:
        return 'min-h-[48px] px-6 text-base';
    }
  };

  return (
    <button
     
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Virtual keyboard detector for iOS Safari
export function VirtualKeyboardDetector({
  children,
  onKeyboardOpen,
  onKeyboardClose
}: VirtualKeyboardDetectorProps) {
  useEffect(() => {
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) {
        // Keyboard is likely open
        onKeyboardOpen?.();
        document.body.classList.add('keyboard-open');
      } else {
        // Keyboard is likely closed
        onKeyboardClose?.();
        document.body.classList.remove('keyboard-open');
      }
    };

    // Listen for viewport changes (modern browsers)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleViewportChange);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
      document.body.classList.remove('keyboard-open');
    };
  }, [onKeyboardOpen, onKeyboardClose]);

  return <>{children}</>;
}

// Touch-optimized input component
export function TouchFriendlyInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  className,
  ...props
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
     
      {...props}
    />
  );
}

// Safe area wrapper for devices with notches
export function SafeAreaWrapper({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      {children}
    </div>
  );
}

// Loading spinner optimized for mobile
export function MobileLoadingSpinner({
  size = 'medium',
  message = 'Loading...',
  className
}: {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div>
      <div />
      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}

// Bottom sheet component (Google Material Design)
export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div>
      {/* Backdrop */}
      <div 
       
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
       
        style={{
          transform: `translateY(${currentY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div />
        
        {/* Title */}
        {title && (
          <div>
            <h3>{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}