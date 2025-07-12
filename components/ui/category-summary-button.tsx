"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
       
      >
        {status === 'completed' ? (
          <Check />
        ) : status === 'needs_review' ? (
          <AlertCircle />
        ) : (
          icon
        )}
        <span>{name}</span>
        {isClickable && <Edit3 />}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
       
        onClick={() => isClickable && onClick(id)}
      >
        <div>
          {icon}
          <span>{name}</span>
        </div>
        
        <div>
          <span>{summary}</span>
          {isClickable && <Edit3 />}
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card>
      <CardContent 
       
        onClick={() => isClickable && onClick(id)}
      >
        <div>
          {/* Left side: Icon, name, and summary */}
          <div>
            <div>
              {icon}
            </div>
            
            <div>
              <div>
                <h3>{name}</h3>
                <Badge variant={config.badgeVariant}>
                  {config.badgeText}
                </Badge>
              </div>
              
              <p>
                {summary}
              </p>
              
              {details && details.length > 0 && (
                <div>
                  {details.map((detail, index) => (
                    <div key={index}>
                      <div />
                      {detail}
                    </div>
                  ))}
                </div>
              )}
              
              {showProgress && typeof progress === 'number' && (
                <div>
                  <Progress value={progress} />
                  <span>{progress}% complete</span>
                </div>
              )}
              
              {showLastUpdated && lastUpdated && (
                <div>
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
             
            >
              <Edit3 />
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
    icon: <User />,
    isRequired: true
  },
  project_location: {
    id: 'project_location',
    name: 'Project Location',
    icon: <MapPin />,
    isRequired: true
  },
  project_type: {
    id: 'project_type',
    name: 'Project Type',
    icon: <Home />,
    isRequired: true
  },
  rooms: {
    id: 'rooms',
    name: 'Rooms',
    icon: <Layers />,
    isRequired: true
  },
  surfaces: {
    id: 'surfaces',
    name: 'Surfaces',
    icon: <Square />,
    isRequired: true
  },
  quantities: {
    id: 'quantities',
    name: 'Doors & Windows',
    icon: <DoorOpen />,
    isRequired: false
  },
  paint_selection: {
    id: 'paint_selection',
    name: 'Paint Selection',
    icon: <Palette />,
    isRequired: true
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing & Markup',
    icon: <Calculator />,
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
    <div>
      <div>
        <span>Progress</span>
        <span>
          {completedCategories} of {totalCategories} complete
        </span>
      </div>
      <Progress value={progressPercentage} />
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
      <div>
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
    <div>
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