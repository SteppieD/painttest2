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
    <div>
      {/* Avatar for assistant */}
      {role === 'assistant' && (
        <div>
          <Sparkles />
        </div>
      )}
      
      <div>
        {/* Message bubble */}
        <div
         
        >
          {role === 'assistant' ? (
            <div>
              {/* Status indicator for assistant messages */}
              {metadata?.stage && (
                <div>
                  <div>
                    <Badge variant="secondary">
                      {metadata.stage.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    {metadata.confidence && metadata.confidence > 0.8 && (
                      <CheckCircle />
                    )}
                  </div>
                </div>
              )}
              
              <div>
                {parseStructuredContent(content)}
              </div>
              
              {/* Quick info extracted */}
              {metadata?.parsedData && (
                <ParsedDataDisplay data={metadata.parsedData} />
              )}
            </div>
          ) : (
            <div>{content}</div>
          )}
        </div>
        
        {/* Timestamp */}
        <div>
          {new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {/* Avatar for user */}
      {role === 'user' && (
        <div>
          <User />
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
    <div>
      {/* Summary cards */}
      <div>
        <div>
          <div>
            <DollarSign />
            <div>
              <p>Total Quote</p>
              <p>
                ${totalMatch ? totalMatch[1] : '0.00'}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <div>
            <Calculator />
            <div>
              <p>Projected Profit</p>
              <p>
                ${profitMatch ? profitMatch[1] : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed breakdown */}
      <div>
        <MarkdownContent content={content} />
      </div>
      
      {/* Action buttons */}
      <div>
        <Button size="sm" variant="outline">
          <FileText />
          See Breakdown
        </Button>
        <Button size="sm">
          <CheckCircle />
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
    <div>
      <div>
        {rates.map((rate, index) => {
          const match = rate.match(/• \*\*(.*?)\*\*: \$([\d.]+)(.*)/);
          if (!match) return null;
          
          const [_, label, price, unit] = match;
          
          return (
            <div key={index}>
              <span>{label}</span>
              <span>
                ${price}{unit}
              </span>
            </div>
          );
        })}
      </div>
      
      <div>
        <p>
          Would you like to adjust any rates?
        </p>
        <div>
          <Badge variant="outline">
            "walls to $3.50"
          </Badge>
          <Badge variant="outline">
            "doors $120"
          </Badge>
          <Badge variant="outline">
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
    <div>
      <p>Select your paint product:</p>
      
      <div>
        {productLines.map((line, index) => {
          const cleanLine = line.replace(/\*\*/g, '');
          const parts = cleanLine.match(/(\d+)\. (.+?) - \$(\d+)\/gallon(.*)/);
          
          if (!parts) return null;
          const [_, num, productName, price, extra] = parts;
          
          return (
            <Button
              key={index}
              variant="outline"
             
            >
              <div>
                <Badge>{num}</Badge>
                <div>
                  <p>{productName}</p>
                  <p>
                    ${price}/gallon {extra}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <p>
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
    <div>
      <div>
        <Info />
        <span>Information Captured</span>
      </div>
      <div>
        {items.map((item, index) => (
          <div key={index}>
            <item.icon />
            <span>{item.label}:</span>
            <span>{item.value}</span>
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
    
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };
  
  return <div>{renderContent(content)}</div>;
};

export default EnhancedMessage;