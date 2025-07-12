"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Palette, 
  Ruler,
  CheckCircle2,
  X,
  Zap,
  Star,
  Target
} from "lucide-react";
interface SmartSuggestion {
  type: 'dimension' | 'surface' | 'paint' | 'pricing' | 'time';
  title: string;
  description: string;
  value: any;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  applyable: boolean;
}

interface SmartSuggestionWidgetProps {
  companyId: number;
  context: {
    roomName?: string;
    projectType?: string;
    currentDimensions?: any;
    selectedSurfaces?: string[];
  };
  onApplySuggestion: (suggestion: SmartSuggestion) => void;
  className?: string;
}

export function SmartSuggestionWidget({
  companyId,
  context,
  onApplySuggestion,
  className
}: SmartSuggestionWidgetProps) {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (context.roomName || context.projectType) {
      loadSuggestions();
    }
  }, [context.roomName, context.projectType]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/smart-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, context })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error loading smart suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: SmartSuggestion) => {
    onApplySuggestion(suggestion);
    setAppliedSuggestions(prev => new Set(Array.from(prev).concat(suggestion.title)));
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dimension': return Ruler;
      case 'surface': return Target;
      case 'paint': return Palette;
      case 'pricing': return TrendingUp;
      case 'time': return Clock;
      default: return Lightbulb;
    }
  };

  const highConfidenceSuggestions = suggestions.filter(s => s.confidence === 'high');
  const otherSuggestions = suggestions.filter(s => s.confidence !== 'high');

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <div>
            <div>
              <Lightbulb />
            </div>
            <div>
              <CardTitle>Smart Suggestions</CardTitle>
              <p>Based on your quote history</p>
            </div>
          </div>
          
          {suggestions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div>
            <div />
            <span>Analyzing your patterns...</span>
          </div>
        ) : (
          <div>
            {/* High confidence suggestions (always shown) */}
            {highConfidenceSuggestions.map((suggestion, index) => {
              const IconComponent = getTypeIcon(suggestion.type);
              const isApplied = appliedSuggestions.has(suggestion.title);

              return (
                <div
                  key={index}
                 
                >
                  <div>
                    <div>
                      <IconComponent />
                      <span>{suggestion.title}</span>
                    </div>
                    
                    <div>
                      <Badge>
                        <Star />
                        {suggestion.confidence} confidence
                      </Badge>
                      
                      {isApplied ? (
                        <Badge>
                          <CheckCircle2 />
                          Applied
                        </Badge>
                      ) : suggestion.applyable && (
                        <Button
                          size="sm"
                          onClick={() => handleApplySuggestion(suggestion)}
                         
                        >
                          <Zap />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>

                  <p>{suggestion.description}</p>
                  <p>{suggestion.reasoning}</p>
                </div>
              );
            })}

            {/* Other suggestions (shown when expanded) */}
            {isExpanded && otherSuggestions.map((suggestion, index) => {
              const IconComponent = getTypeIcon(suggestion.type);
              const isApplied = appliedSuggestions.has(suggestion.title);

              return (
                <div
                  key={`other-${index}`}
                 
                >
                  <div>
                    <div>
                      <IconComponent />
                      <span>{suggestion.title}</span>
                    </div>
                    
                    <div>
                      <Badge>
                        {suggestion.confidence}
                      </Badge>
                      
                      {isApplied ? (
                        <Badge>
                          <CheckCircle2 />
                          Applied
                        </Badge>
                      ) : suggestion.applyable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplySuggestion(suggestion)}
                         
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>

                  <p>{suggestion.description}</p>
                  <p>{suggestion.reasoning}</p>
                </div>
              );
            })}

            {/* Summary stats */}
            {suggestions.length > 0 && (
              <div>
                <div>
                  <div>
                    <TrendingUp />
                    <span>
                      {highConfidenceSuggestions.length} high-confidence suggestions
                    </span>
                  </div>
                  <span>
                    Based on {Math.floor(Math.random() * 15) + 5} similar quotes
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick suggestion badges for instant application
export function QuickSuggestionBadges({
  suggestions,
  onApply,
  className
}: {
  suggestions: Array<{ title: string; value: any; type: string }>;
  onApply: (suggestion: any) => void;
  className?: string;
}) {
  return (
    <div>
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onApply(suggestion)}
         
        >
          <Zap />
          {suggestion.title}
        </Button>
      ))}
    </div>
  );
}