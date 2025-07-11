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
  HelpCircle,
  X
} from 'lucide-react';
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
    <div>
      {/* Quick actions bar */}
      {showQuickActions && quickActions.length > 0 && (
        <div>
          <div>
            <span>Quick actions:</span>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onChange(action.value)}
               
                disabled={isLoading}
              >
                <action.icon />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div>
        <div>
          <div>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
             
              rows={2}
            />
            
            {/* Character count for long messages */}
            {value.length > 100 && (
              <div>
                {value.length} chars
              </div>
            )}
          </div>
          
          <div>
            {/* Help button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(!showHelp)}
             
            >
              <HelpCircle />
            </Button>
            
            {/* Send button */}
            <Button
              onClick={onSend}
              disabled={!value.trim() || isLoading}
              size="icon"
             
            >
              {isLoading ? (
                <div />
              ) : (
                <Send />
              )}
            </Button>
          </div>
        </div>
        
        {/* AI indicator */}
        <div>
          <div>
            <Sparkles />
            <span>Powered by Claude Sonnet 4</span>
          </div>
          
          <div>
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
      
      {/* Help panel */}
      {showHelp && (
        <div>
          <div>
            <div>
              <h3>{getHelpContent().title}</h3>
              <p>Example formats</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(false)}
             
            >
              <X />
            </Button>
          </div>
          
          <div>
            {getHelpContent().examples.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(example);
                  setShowHelp(false);
                }}
               
              >
                <code>{example}</code>
              </button>
            ))}
          </div>
          
          <div>
            <p>
              💡 Pro tip: Include all details in one message for faster quotes!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatInput;