import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Sparkles, 
  Info,
  Calculator,
  Home,
  Ruler,
  DollarSign,
  FileText,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description?: string;
}

interface EnhancedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
  stage?: string;
  showQuickActions?: boolean;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading = false,
  placeholder = "Type your message or complete quote information...",
  stage = '',
  showQuickActions = true
}) => {
  const [showHelp, setShowHelp] = useState(false);
  
  // Dynamic quick actions based on stage
  const getQuickActions = (): QuickAction[] => {
    switch (stage) {
      case 'customer_info':
        return [
          { 
            icon: FileText, 
            label: "Full Example", 
            value: "John Smith at 123 Main St, Springfield",
            description: "Customer name and address"
          }
        ];
      
      case 'project_type':
        return [
          { icon: Home, label: "Interior", value: "interior" },
          { icon: Home, label: "Exterior", value: "exterior" },
          { icon: Home, label: "Both", value: "both" }
        ];
      
      case 'measurements':
        return [
          { 
            icon: Ruler, 
            label: "Example", 
            value: "500 sqft walls, 300 sqft ceilings",
            description: "Common measurement format"
          }
        ];
      
      case 'rate_confirmation':
        return [
          { icon: DollarSign, label: "Adjust Walls", value: "walls to $2.00" },
          { icon: DollarSign, label: "Adjust Ceilings", value: "ceilings to $1.75" },
          { icon: Calculator, label: "Looks Good", value: "looks good" }
        ];
      
      case 'quote_review':
        return [
          { icon: FileText, label: "See Breakdown", value: "breakdown" },
          { icon: Send, label: "Save Quote", value: "save" },
          { icon: Calculator, label: "Adjust", value: "adjust rates" }
        ];
      
      default:
        return [];
    }
  };
  
  const quickActions = getQuickActions();
  
  // Help content based on stage
  const getHelpContent = () => {
    const helpMap: { [key: string]: { title: string; examples: string[] } } = {
      customer_info: {
        title: "Customer Information",
        examples: [
          "John Smith at 123 Main Street",
          "Sarah at 456 Oak Avenue",
          "Mike Johnson, 789 Pine Drive"
        ]
      },
      measurements: {
        title: "Measurement Formats",
        examples: [
          "500 linear feet, 9 foot ceilings",
          "1200 sqft walls, 800 sqft ceilings",
          "300 trim, 6 doors, 8 windows"
        ]
      },
      paint_product_selection: {
        title: "Paint Selection",
        examples: [
          "1 (select by number)",
          "Sherwin ProClassic",
          "custom"
        ]
      },
      rate_confirmation: {
        title: "Rate Adjustments",
        examples: [
          "walls to $2.50",
          "ceiling rate $1.25",
          "doors should be $150",
          "looks good"
        ]
      }
    };
    
    return helpMap[stage] || { title: "Quote Creation", examples: [] };
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };
  
  return (
    <div className="relative">
      {/* Quick actions bar */}
      {showQuickActions && quickActions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Quick actions:</span>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onChange(action.value)}
                className="h-7 text-xs gap-1 hover:bg-blue-50 hover:border-blue-300"
                disabled={isLoading}
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex items-end gap-2 p-3">
          <div className="flex-1 relative">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-h-[60px] max-h-[200px] resize-none border-0 focus:ring-0 p-0 text-sm"
              rows={2}
            />
            
            {/* Character count for long messages */}
            {value.length > 100 && (
              <div className="absolute bottom-0 right-0 text-xs text-gray-400">
                {value.length} chars
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {/* Help button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(!showHelp)}
              className="h-9 w-9 text-gray-500 hover:text-gray-700"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            
            {/* Send button */}
            <Button
              onClick={onSend}
              disabled={!value.trim() || isLoading}
              size="icon"
              className={cn(
                "h-9 w-9 transition-all duration-200",
                value.trim() && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* AI indicator */}
        <div className="px-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Claude Sonnet 4</span>
          </div>
          
          <div className="text-xs text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
      
      {/* Help panel */}
      {showHelp && (
        <div className="absolute bottom-full right-0 mb-2 w-80 p-4 bg-white border rounded-lg shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">{getHelpContent().title}</h3>
              <p className="text-xs text-gray-500 mt-1">Example formats</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(false)}
              className="h-6 w-6 -mr-2 -mt-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {getHelpContent().examples.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(example);
                  setShowHelp(false);
                }}
                className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded transition-colors"
              >
                <code className="text-blue-600">{example}</code>
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500">
              💡 Pro tip: Include all details in one message for faster quotes!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatInput;