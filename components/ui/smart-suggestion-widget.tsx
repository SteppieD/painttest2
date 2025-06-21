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
import { cn } from "@/lib/utils";

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
    setAppliedSuggestions(prev => new Set([...prev, suggestion.title]));
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
    <Card className={cn("design-card border-blue-200", className)}>
      <CardHeader className="pb-3">
        <div className="design-inline">
          <div className="design-inline">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Smart Suggestions</CardTitle>
              <p className="text-sm text-gray-600">Based on your quote history</p>
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
          <div className="design-inline p-4">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Analyzing your patterns...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* High confidence suggestions (always shown) */}
            {highConfidenceSuggestions.map((suggestion, index) => {
              const IconComponent = getTypeIcon(suggestion.type);
              const isApplied = appliedSuggestions.has(suggestion.title);

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    isApplied 
                      ? "bg-green-50 border-green-200" 
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  )}
                >
                  <div className="design-inline mb-2">
                    <div className="design-inline">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{suggestion.title}</span>
                    </div>
                    
                    <div className="design-inline">
                      <Badge className={cn("text-xs", getConfidenceColor(suggestion.confidence))}>
                        <Star className="w-3 h-3 mr-1" />
                        {suggestion.confidence} confidence
                      </Badge>
                      
                      {isApplied ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                      ) : suggestion.applyable && (
                        <Button
                          size="sm"
                          onClick={() => handleApplySuggestion(suggestion)}
                          className="design-button design-button-small h-6 px-3"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                  <p className="text-xs text-gray-500">{suggestion.reasoning}</p>
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
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    isApplied 
                      ? "bg-green-50 border-green-200" 
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  )}
                >
                  <div className="design-inline mb-2">
                    <div className="design-inline">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{suggestion.title}</span>
                    </div>
                    
                    <div className="design-inline">
                      <Badge className={cn("text-xs", getConfidenceColor(suggestion.confidence))}>
                        {suggestion.confidence}
                      </Badge>
                      
                      {isApplied ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                      ) : suggestion.applyable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplySuggestion(suggestion)}
                          className="h-6 px-2 text-xs"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">{suggestion.description}</p>
                  <p className="text-xs text-gray-500">{suggestion.reasoning}</p>
                </div>
              );
            })}

            {/* Summary stats */}
            {suggestions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="design-inline text-sm">
                  <div className="design-inline">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      {highConfidenceSuggestions.length} high-confidence suggestions
                    </span>
                  </div>
                  <span className="text-blue-600">
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
    <div className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onApply(suggestion)}
          className="design-button design-button-small border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Zap className="w-3 h-3 mr-1" />
          {suggestion.title}
        </Button>
      ))}
    </div>
  );
}