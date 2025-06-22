"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  Check, 
  Edit3, 
  AlertCircle,
  Home,
  Palette,
  Square,
  DoorOpen,
  Calculator,
  User,
  MapPin,
  Layers
} from "lucide-react";

export type CategoryStatus = 'pending' | 'in_progress' | 'completed' | 'needs_review';

export interface CategorySummary {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: CategoryStatus;
  summary: string;
  details?: string[];
  progress?: number; // 0-100
  lastUpdated?: Date;
  canEdit?: boolean;
  isRequired?: boolean;
}

interface CategorySummaryButtonProps {
  category: CategorySummary;
  onClick?: (categoryId: string) => void;
  variant?: 'card' | 'pill' | 'compact';
  showProgress?: boolean;
  showLastUpdated?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CategorySummaryButton({ 
  category, 
  onClick,
  variant = 'card',
  showProgress = false,
  showLastUpdated = false,
  disabled = false,
  className
}: CategorySummaryButtonProps) {
  const { id, name, icon, status, summary, details, progress, lastUpdated, canEdit = true } = category;
  
  const statusConfig = {
    pending: {
      color: 'bg-gray-100 text-gray-600 border-gray-200',
      badgeVariant: 'secondary' as const,
      badgeText: 'Pending'
    },
    in_progress: {
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      badgeVariant: 'secondary' as const,
      badgeText: 'In Progress'
    },
    completed: {
      color: 'bg-green-50 text-green-700 border-green-200',
      badgeVariant: 'secondary' as const,
      badgeText: 'Complete'
    },
    needs_review: {
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      badgeVariant: 'secondary' as const,
      badgeText: 'Review Needed'
    }
  };

  const config = statusConfig[status];
  const isClickable = canEdit && !disabled && onClick;

  if (variant === 'pill') {
    return (
      <Button
        variant={status === 'completed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => isClickable && onClick(id)}
        disabled={disabled}
        className={cn(
          "h-8 px-3 gap-2 transition-all duration-200",
          status === 'completed' && "bg-green-600 hover:bg-green-700 text-white",
          status === 'needs_review' && "border-orange-300 text-orange-700 hover:bg-orange-50",
          isClickable && "cursor-pointer hover:shadow-sm",
          className
        )}
      >
        {status === 'completed' ? (
          <Check className="w-3 h-3" />
        ) : status === 'needs_review' ? (
          <AlertCircle className="w-3 h-3" />
        ) : (
          icon
        )}
        <span className="text-xs font-medium">{name}</span>
        {isClickable && <Edit3 className="w-3 h-3 opacity-50" />}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
          config.color,
          isClickable && "cursor-pointer hover:shadow-sm",
          className
        )}
        onClick={() => isClickable && onClick(id)}
      >
        <div className="flex items-center gap-2 flex-1">
          {icon}
          <span className="font-medium text-sm">{name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">{summary}</span>
          {isClickable && <Edit3 className="w-4 h-4 opacity-50" />}
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={cn(
      "transition-all duration-200 border",
      config.color,
      isClickable && "cursor-pointer hover:shadow-md",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <CardContent 
        className="p-4"
        onClick={() => isClickable && onClick(id)}
      >
        <div className="flex items-start justify-between">
          {/* Left side: Icon, name, and summary */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-white/50">
              {icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm">{name}</h3>
                <Badge variant={config.badgeVariant} className="text-xs">
                  {config.badgeText}
                </Badge>
              </div>
              
              <p className="text-sm opacity-80 mb-2">
                {summary}
              </p>
              
              {details && details.length > 0 && (
                <div className="space-y-1">
                  {details.map((detail, index) => (
                    <div key={index} className="text-xs opacity-70 flex items-center gap-1">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {detail}
                    </div>
                  ))}
                </div>
              )}
              
              {showProgress && typeof progress === 'number' && (
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs opacity-70 mt-1">{progress}% complete</span>
                </div>
              )}
              
              {showLastUpdated && lastUpdated && (
                <div className="text-xs opacity-60 mt-1">
                  Updated {lastUpdated.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          {/* Right side: Edit button */}
          {isClickable && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-50 hover:opacity-100"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-defined category templates
export const QUOTE_CATEGORIES: Record<string, Omit<CategorySummary, 'status' | 'summary'>> = {
  customer_info: {
    id: 'customer_info',
    name: 'Customer Info',
    icon: <User className="w-5 h-5" />,
    isRequired: true
  },
  project_location: {
    id: 'project_location',
    name: 'Project Location',
    icon: <MapPin className="w-5 h-5" />,
    isRequired: true
  },
  project_type: {
    id: 'project_type',
    name: 'Project Type',
    icon: <Home className="w-5 h-5" />,
    isRequired: true
  },
  rooms: {
    id: 'rooms',
    name: 'Rooms',
    icon: <Layers className="w-5 h-5" />,
    isRequired: true
  },
  surfaces: {
    id: 'surfaces',
    name: 'Surfaces',
    icon: <Square className="w-5 h-5" />,
    isRequired: true
  },
  quantities: {
    id: 'quantities',
    name: 'Doors & Windows',
    icon: <DoorOpen className="w-5 h-5" />,
    isRequired: false
  },
  paint_selection: {
    id: 'paint_selection',
    name: 'Paint Selection',
    icon: <Palette className="w-5 h-5" />,
    isRequired: true
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing & Markup',
    icon: <Calculator className="w-5 h-5" />,
    isRequired: true
  }
};

interface CategoryProgressBarProps {
  categories: CategorySummary[];
  className?: string;
}

export function CategoryProgressBar({ categories, className }: CategoryProgressBarProps) {
  const totalCategories = categories.length;
  const completedCategories = categories.filter(cat => cat.status === 'completed').length;
  const progressPercentage = totalCategories > 0 ? (completedCategories / totalCategories) * 100 : 0;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Progress</span>
        <span className="text-gray-600">
          {completedCategories} of {totalCategories} complete
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}

interface CategoryGridProps {
  categories: CategorySummary[];
  onCategoryClick?: (categoryId: string) => void;
  variant?: 'card' | 'pill' | 'compact';
  showProgress?: boolean;
  className?: string;
}

export function CategoryGrid({ 
  categories, 
  onCategoryClick,
  variant = 'card',
  showProgress = false,
  className
}: CategoryGridProps) {
  if (variant === 'pill') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {categories.map((category) => (
          <CategorySummaryButton
            key={category.id}
            category={category}
            onClick={onCategoryClick}
            variant="pill"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(
      variant === 'compact' ? "space-y-2" : "grid gap-3 md:grid-cols-2",
      className
    )}>
      {categories.map((category) => (
        <CategorySummaryButton
          key={category.id}
          category={category}
          onClick={onCategoryClick}
          variant={variant}
          showProgress={showProgress}
        />
      ))}
    </div>
  );
}

// Helper functions
export function createCategorySummary(
  categoryId: keyof typeof QUOTE_CATEGORIES,
  status: CategoryStatus,
  summary: string,
  options?: Partial<CategorySummary>
): CategorySummary {
  const template = QUOTE_CATEGORIES[categoryId];
  return {
    ...template,
    status,
    summary,
    lastUpdated: new Date(),
    ...options
  };
}

export function getCompletionPercentage(categories: CategorySummary[]): number {
  if (categories.length === 0) return 0;
  const completed = categories.filter(cat => cat.status === 'completed').length;
  return Math.round((completed / categories.length) * 100);
}

export function getNextPendingCategory(categories: CategorySummary[]): CategorySummary | undefined {
  return categories.find(cat => cat.status === 'pending');
}