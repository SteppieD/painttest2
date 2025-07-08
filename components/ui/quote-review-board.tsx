"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Layers,
  ChevronRight,
  FileText
} from "lucide-react";
import { CategorySummary, CategoryGrid, CategoryProgressBar } from "./category-summary-button";
import { RoomTemplate } from "./room-type-button";
import { QuantityItem } from "./quantity-button";

interface QuoteReviewData {
  customerInfo: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  projectType: 'interior' | 'exterior' | 'both';
  rooms: RoomTemplate[];
  surfaces: string[];
  quantities: QuantityItem[];
  paintSelections: {
    [category: string]: {
      brand: string;
      product: string;
      pricePerGallon: number;
    };
  };
  markup: number;
  estimatedTotal?: number;
}

interface QuoteReviewBoardProps {
  data: QuoteReviewData;
  categories: CategorySummary[];
  onEdit: (categoryId: string) => void;
  onContinue: () => void;
  onBackToEdit?: () => void;
  isGenerating?: boolean;
  className?: string;
}

export function QuoteReviewBoard({ 
  data, 
  categories, 
  onEdit, 
  onContinue,
  onBackToEdit,
  isGenerating = false,
  className
}: QuoteReviewBoardProps) {
  const completedCategories = categories.filter(cat => cat.status === 'completed').length;
  const totalCategories = categories.length;
  const isComplete = completedCategories === totalCategories;
  
  const totalRooms = data.rooms.length;
  const totalQuantities = data.quantities.reduce((sum, item) => sum + item.quantity, 0);
  const totalSurfaces = data.surfaces.length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Quote</h2>
        <p className="text-gray-600">
          Review all details below, then generate your professional quote
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
              <p className="text-sm text-gray-600">
                {isComplete ? "Ready to generate quote!" : `${completedCategories} of ${totalCategories} sections complete`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedCategories / totalCategories) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
          <Progress 
            value={(completedCategories / totalCategories) * 100} 
            className="h-3" 
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 p-2 bg-blue-100 rounded-lg">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-semibold text-lg">{totalRooms}</div>
            <div className="text-xs text-gray-600">Rooms</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 p-2 bg-green-100 rounded-lg">
              <Square className="w-4 h-4 text-green-600" />
            </div>
            <div className="font-semibold text-lg">{totalSurfaces}</div>
            <div className="text-xs text-gray-600">Surfaces</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 p-2 bg-orange-100 rounded-lg">
              <DoorOpen className="w-4 h-4 text-orange-600" />
            </div>
            <div className="font-semibold text-lg">{totalQuantities}</div>
            <div className="text-xs text-gray-600">Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 p-2 bg-purple-100 rounded-lg">
              <Calculator className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-semibold text-lg">{data.markup}%</div>
            <div className="text-xs text-gray-600">Markup</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Customer & Project Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer & Project
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('customer_info')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-700">Customer</div>
              <div className="text-gray-900">{data.customerInfo.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Address</div>
              <div className="text-gray-900">{data.customerInfo.address}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Project Type</div>
              <Badge variant="secondary" className="capitalize">
                {data.projectType}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Rooms */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                Rooms ({totalRooms})
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('rooms')}
                className="text-green-600 hover:text-green-700"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.rooms.slice(0, 3).map((room, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{room.name}</span>
                  <span className="text-gray-600">
                    {room.typicalDimensions.length}' × {room.typicalDimensions.width}'
                  </span>
                </div>
              ))}
              {data.rooms.length > 3 && (
                <div className="text-xs text-gray-500 pt-1">
                  +{data.rooms.length - 3} more rooms
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quantities */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-orange-600" />
                Quantities
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('quantities')}
                className="text-orange-600 hover:text-orange-700"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.quantities.filter(item => item.quantity > 0).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{item.name}</span>
                  <span className="text-gray-600">{item.quantity}</span>
                </div>
              ))}
              {data.quantities.filter(item => item.quantity > 0).length === 0 && (
                <div className="text-sm text-gray-500 italic">No additional quantities specified</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paint Selections */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Paint Selection
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('paint_selection')}
                className="text-purple-600 hover:text-purple-700"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.paintSelections).map(([category, paint], index) => (
                <div key={index} className="space-y-1">
                  <div className="text-sm font-medium text-gray-700 capitalize">{category}</div>
                  <div className="text-sm text-gray-900">
                    {paint.brand} - {paint.product} (${paint.pricePerGallon}/gal)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Review Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            All Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryGrid 
            categories={categories}
            onCategoryClick={onEdit}
            variant="compact"
          />
        </CardContent>
      </Card>

      {/* Estimated Total */}
      {data.estimatedTotal && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-sm text-gray-600 mb-1">Estimated Total</div>
            <div className="text-3xl font-bold text-green-700">
              ${data.estimatedTotal.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Based on current selections and {data.markup}% markup
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {onBackToEdit && (
          <Button 
            variant="outline" 
            onClick={onBackToEdit}
            disabled={isGenerating}
          >
            Back to Editing
          </Button>
        )}
        
        <Button 
          onClick={onContinue}
          disabled={!isComplete || isGenerating}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating Quote...
            </>
          ) : (
            <>
              Generate Professional Quote
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Incomplete Warning */}
      {!isComplete && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">Almost Ready!</div>
                <div className="text-sm">
                  Complete the highlighted sections above to generate your quote.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to create review data from state
export function createQuoteReviewData(
  customerName: string,
  address: string,
  projectType: 'interior' | 'exterior' | 'both',
  rooms: RoomTemplate[],
  surfaces: string[],
  quantities: QuantityItem[],
  paintSelections: any,
  markup: number,
  estimatedTotal?: number
): QuoteReviewData {
  return {
    customerInfo: {
      name: customerName,
      address: address
    },
    projectType,
    rooms,
    surfaces,
    quantities,
    paintSelections,
    markup,
    estimatedTotal
  };
}