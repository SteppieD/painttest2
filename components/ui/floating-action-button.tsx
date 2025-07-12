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
     
    >
      {/* Action Menu */}
      {isOpen && (
        <div>
          {fabActions.map((action, index) => (
            <div
              key={action.id}
             ` 
                  : "translate-y-4 opacity-0"
              )}
             ms` : '0ms' 
              }}
            >
              <Button
                onClick={action.action}
               
              >
                <div>
                  <div>
                    <action.icon />
                  </div>
                  <div>
                    <span>{action.label}</span>
                    {action.isPopular && (
                      <span>
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
       
        aria-label={isOpen ? "Close menu" : "Create new quote"}
      >
        {isOpen ? (
          <X />
        ) : (
          <Plus />
        )}
      </Button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
         
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
     
      aria-label={label}
    >
      <Icon />
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
    <div>
      {/* Speed dial actions */}
      <div>
        {actions.map((action, index) => (
          <div
            key={index}
           ` 
                : "translate-y-8 opacity-0 scale-50"
            )}
           ms` : '0ms' 
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
       
      >
        {isOpen ? (
          <X />
        ) : (
          <Plus />
        )}
      </Button>
    </div>
  );
}