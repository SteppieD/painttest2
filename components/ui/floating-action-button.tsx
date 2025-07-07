"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { 
  Plus, 
  Calculator, 
  Zap, 
  MessageSquare, 
  FileText,
  X,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FABAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  action: () => void;
  isPopular?: boolean;
}

interface FloatingActionButtonProps {
  onExpressQuote: () => void;
  onFullQuote: () => void;
  onChatQuote: () => void;
  onViewQuotes: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function FloatingActionButton({
  onExpressQuote,
  onFullQuote,
  onChatQuote,
  onViewQuotes,
  className,
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const fabActions: FABAction[] = [
    {
      id: 'express-quote',
      label: 'Express Quote (30s)',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => {
        onExpressQuote();
        setIsOpen(false);
      },
      isPopular: true
    },
    {
      id: 'full-quote',
      label: 'Custom Quote',
      icon: Calculator,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => {
        onFullQuote();
        setIsOpen(false);
      }
    },
    {
      id: 'chat-quote',
      label: 'Chat Assistant',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => {
        onChatQuote();
        setIsOpen(false);
      }
    },
    {
      id: 'view-quotes',
      label: 'All Quotes',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => {
        onViewQuotes();
        setIsOpen(false);
      }
    }
  ];

  // Handle scroll behavior - hide/show FAB
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide FAB
        setIsVisible(false);
        setIsOpen(false);
      } else {
        // Scrolling up - show FAB
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.fab-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  const getMenuAlignment = () => {
    switch (position) {
      case 'bottom-left':
        return 'left-0';
      case 'bottom-center':
        return 'left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'right-0';
    }
  };

  return (
    <div 
      className={cn(
        "fixed z-50 fab-container transition-all duration-300 ease-out",
        getPositionClasses(),
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
        className
      )}
    >
      {/* Action Menu */}
      {isOpen && (
        <div className={cn(
          "absolute bottom-16 w-64 space-y-2",
          getMenuAlignment()
        )}>
          {fabActions.map((action, index) => (
            <div
              key={action.id}
              className={cn(
                "transform transition-all duration-200 ease-out",
                isOpen 
                  ? `translate-y-0 opacity-100 delay-${index * 50}` 
                  : "translate-y-4 opacity-0"
              )}
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms' 
              }}
            >
              <Button
                onClick={action.action}
                className={cn(
                  "w-full justify-start h-12 shadow-lg border-0 transition-all duration-200",
                  action.bgColor,
                  "hover:scale-105 hover:shadow-xl"
                )}
              >
                <div className="design-inline w-full">
                  <div className={cn("p-2 rounded-lg bg-white shadow-sm", action.color)}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left ml-3">
                    <span className="font-medium text-gray-900">{action.label}</span>
                    {action.isPopular && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "design-fab w-14 h-14 shadow-xl transition-all duration-300 ease-out",
          "hover:scale-110 active:scale-95",
          isOpen ? "rotate-45" : "rotate-0",
          isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
        )}
        aria-label={isOpen ? "Close menu" : "Create new quote"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm -z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

/* Mini FAB for secondary actions */
export function MiniFAB({
  icon: Icon,
  label,
  onClick,
  color = "bg-gray-600",
  className
}: {
  icon: any;
  label: string;
  onClick: () => void;
  color?: string;
  className?: string;
}) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-full shadow-lg border-0 transition-all duration-200",
        "hover:scale-110 active:scale-95",
        color,
        className
      )}
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-white" />
    </Button>
  );
}

/* Speed Dial FAB - Alternative implementation */
export function SpeedDialFAB({
  actions,
  className,
  position = 'bottom-right'
}: {
  actions: Array<{
    label: string;
    icon: any;
    onClick: () => void;
    color?: string;
  }>;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      {/* Speed dial actions */}
      <div className="flex flex-col items-center space-y-3 mb-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className={cn(
              "transition-all duration-200 ease-out",
              isOpen 
                ? `translate-y-0 opacity-100 scale-100 delay-${index * 50}` 
                : "translate-y-8 opacity-0 scale-50"
            )}
            style={{ 
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms' 
            }}
          >
            <MiniFAB
              icon={action.icon}
              label={action.label}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              color={action.color}
            />
          </div>
        ))}
      </div>

      {/* Main button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "design-fab w-14 h-14 shadow-xl transition-all duration-300",
          "hover:scale-110 active:scale-95",
          isOpen ? "rotate-45 bg-gray-600" : "rotate-0 bg-blue-600"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </Button>
    </div>
  );
}