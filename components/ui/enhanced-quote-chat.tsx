import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  CheckCircle, 
  AlertCircle, 
  Calculator,
  Palette,
  DollarSign,
  Ruler,
  Home,
  Clock,
  User,
  MapPin,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteData {
  customer_name?: string;
  address?: string;
  project_type?: string;
  areas?: {
    walls_sqft?: number;
    ceilings_sqft?: number;
    trim_sqft?: number;
    doors_count?: number;
    windows_count?: number;
  };
  rates?: {
    wall_rate?: number;
    ceiling_rate?: number;
    trim_rate?: number;
    door_rate?: number;
    window_rate?: number;
  };
  calculation?: {
    revenue?: { total: number };
    profit?: number;
  };
}

interface MessageMetadata {
  stage?: string;
  parsedData?: any;
  confidence?: number;
}

interface EnhancedMessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: MessageMetadata;
  quoteData?: QuoteData;
}

export const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  content,
  role,
  timestamp,
  metadata,
  quoteData
}) => {
  // Parse structured content from assistant messages
  const parseStructuredContent = (text: string) => {
    const sections = [];
    
    // Check for quote display sections
    if (text.includes('**REVENUE BREAKDOWN**') || text.includes('**Total Quote:**')) {
      return <QuoteDisplay content={text} />;
    }
    
    // Check for rate confirmation sections
    if (text.includes('**Are there any rates here that you would like to change')) {
      return <RateConfirmationDisplay content={text} />;
    }
    
    // Check for product selection
    if (text.includes('I have these products available:')) {
      return <ProductSelectionDisplay content={text} />;
    }
    
    // Default markdown rendering
    return <MarkdownContent content={text} />;
  };

  return (
    <div className={cn(
      "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      role === 'user' ? "justify-end" : "justify-start"
    )}>
      {/* Avatar for assistant */}
      {role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[85%] lg:max-w-[70%]",
        role === 'user' ? "items-end" : "items-start"
      )}>
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md",
            role === 'user'
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3"
              : "bg-white border border-gray-200 p-0 overflow-hidden"
          )}
        >
          {role === 'assistant' ? (
            <div>
              {/* Status indicator for assistant messages */}
              {metadata?.stage && (
                <div className="px-4 pt-3 pb-2 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {metadata.stage.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    {metadata.confidence && metadata.confidence > 0.8 && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                {parseStructuredContent(content)}
              </div>
              
              {/* Quick info extracted */}
              {metadata?.parsedData && (
                <ParsedDataDisplay data={metadata.parsedData} />
              )}
            </div>
          ) : (
            <div className="text-sm leading-relaxed">{content}</div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs mt-1 px-2",
          role === 'user' ? "text-gray-500" : "text-gray-400"
        )}>
          {new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {/* Avatar for user */}
      {role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

// Component for displaying quote calculations
const QuoteDisplay: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const totalMatch = content.match(/\*\*Total Quote: \$([0-9,]+\.?\d*)\*\*/);
  const profitMatch = content.match(/\*\*Projected Profit: \$([0-9,]+\.?\d*)\*\*/);
  
  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Quote</p>
              <p className="text-lg font-bold text-blue-900">
                ${totalMatch ? totalMatch[1] : '0.00'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-green-600 font-medium">Projected Profit</p>
              <p className="text-lg font-bold text-green-900">
                ${profitMatch ? profitMatch[1] : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed breakdown */}
      <div className="text-sm space-y-2">
        <MarkdownContent content={content} />
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline" className="text-xs">
          <FileText className="w-3 h-3 mr-1" />
          See Breakdown
        </Button>
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Save Quote
        </Button>
      </div>
    </div>
  );
};

// Component for rate confirmation display
const RateConfirmationDisplay: React.FC<{ content: string }> = ({ content }) => {
  const rates = content.match(/• \*\*(.*?)\*\*: \$([\d.]+)(.*)/g) || [];
  
  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {rates.map((rate, index) => {
          const match = rate.match(/• \*\*(.*?)\*\*: \$([\d.]+)(.*)/);
          if (!match) return null;
          
          const [_, label, price, unit] = match;
          
          return (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm font-bold text-blue-600">
                ${price}{unit}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="pt-2 border-t">
        <p className="text-sm text-gray-600 mb-2">
          Would you like to adjust any rates?
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
            "walls to $3.50"
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
            "doors $120"
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
            "looks good"
          </Badge>
        </div>
      </div>
    </div>
  );
};

// Component for product selection display
const ProductSelectionDisplay: React.FC<{ content: string }> = ({ content }) => {
  const productLines = content.match(/\*\*\d+\.\*\* .*$/gm) || [];
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-700">Select your paint product:</p>
      
      <div className="grid gap-2">
        {productLines.map((line, index) => {
          const cleanLine = line.replace(/\*\*/g, '');
          const parts = cleanLine.match(/(\d+)\. (.+?) - \$(\d+)\/gallon(.*)/);
          
          if (!parts) return null;
          const [_, num, productName, price, extra] = parts;
          
          return (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left h-auto p-3 hover:bg-blue-50 hover:border-blue-300"
            >
              <div className="flex items-start gap-3 w-full">
                <Badge className="bg-blue-100 text-blue-700">{num}</Badge>
                <div className="flex-1">
                  <p className="font-medium text-sm">{productName}</p>
                  <p className="text-xs text-gray-600">
                    ${price}/gallon {extra}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 italic">
        Say the number or product name to select
      </p>
    </div>
  );
};

// Component for displaying parsed data
const ParsedDataDisplay: React.FC<{ data: any }> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;
  
  const items = [];
  
  if (data.customer_name) {
    items.push({ icon: User, label: 'Customer', value: data.customer_name });
  }
  if (data.property_address || data.address) {
    items.push({ icon: MapPin, label: 'Address', value: data.property_address || data.address });
  }
  if (data.walls_sqft) {
    items.push({ icon: Ruler, label: 'Walls', value: `${data.walls_sqft} sq ft` });
  }
  if (data.project_type) {
    items.push({ icon: Home, label: 'Type', value: data.project_type });
  }
  
  if (items.length === 0) return null;
  
  return (
    <div className="px-4 pb-3 pt-2 bg-gray-50 border-t">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-3 h-3 text-gray-500" />
        <span className="text-xs text-gray-600 font-medium">Information Captured</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <item.icon className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced markdown renderer
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const renderContent = (text: string) => {
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Handle line breaks
    text = text.replace(/\n/g, '<br />');
    
    // Handle bullet points with better styling
    text = text.replace(/^• /gm, '<span class="inline-block w-4">•</span>');
    
    return <div dangerouslySetInnerHTML={{ __html: text }} className="prose-sm" />;
  };
  
  return <div className="text-sm leading-relaxed text-gray-700">{renderContent(content)}</div>;
};

export default EnhancedMessage;