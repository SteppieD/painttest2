"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
    <div>
      {/* Header */}
      <div>
        <h2>Review Your Quote</h2>
        <p>
          Review all details below, then generate your professional quote
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent>
          <div>
            <div>
              <h3>Progress Overview</h3>
              <p>
                {isComplete ? "Ready to generate quote!" : `${completedCategories} of ${totalCategories} sections complete`}
              </p>
            </div>
            <div>
              <div>
                {Math.round((completedCategories / totalCategories) * 100)}%
              </div>
              <div>Complete</div>
            </div>
          </div>
          <Progress 
            value={(completedCategories / totalCategories) * 100} 
            
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div>
        <Card>
          <CardContent>
            <div>
              <Layers />
            </div>
            <div>{totalRooms}</div>
            <div>Rooms</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div>
              <Square />
            </div>
            <div>{totalSurfaces}</div>
            <div>Surfaces</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div>
              <DoorOpen />
            </div>
            <div>{totalQuantities}</div>
            <div>Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div>
              <Calculator />
            </div>
            <div>{data.markup}%</div>
            <div>Markup</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div>
        
        {/* Customer & Project Info */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <User />
                Customer & Project
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('customer_info')}
               
              >
                <Edit3 />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <div>Customer</div>
              <div>{data.customerInfo.name}</div>
            </div>
            <div>
              <div>Address</div>
              <div>{data.customerInfo.address}</div>
            </div>
            <div>
              <div>Project Type</div>
              <Badge variant="secondary">
                {data.projectType}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Rooms */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Home />
                Rooms ({totalRooms})
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('rooms')}
               
              >
                <Edit3 />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {data.rooms.slice(0, 3).map((room, index) => (
                <div key={index}>
                  <span>{room.name}</span>
                  <span>
                    {room.typicalDimensions.length}' × {room.typicalDimensions.width}'
                  </span>
                </div>
              ))}
              {data.rooms.length > 3 && (
                <div>
                  +{data.rooms.length - 3} more rooms
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quantities */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <DoorOpen />
                Quantities
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('quantities')}
               
              >
                <Edit3 />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {data.quantities.filter(item => item.quantity > 0).map((item, index) => (
                <div key={index}>
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
              ))}
              {data.quantities.filter(item => item.quantity > 0).length === 0 && (
                <div>No additional quantities specified</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paint Selections */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Palette />
                Paint Selection
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit('paint_selection')}
               
              >
                <Edit3 />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {Object.entries(data.paintSelections).map(([category, paint], index) => (
                <div key={index}>
                  <div>{category}</div>
                  <div>
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
          <CardTitle>
            <FileText />
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
        <Card>
          <CardContent>
            <div>Estimated Total</div>
            <div>
              ${data.estimatedTotal.toLocaleString()}
            </div>
            <div>
              Based on current selections and {data.markup}% markup
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div>
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
         
        >
          {isGenerating ? (
            <>
              <div />
              Generating Quote...
            </>
          ) : (
            <>
              Generate Professional Quote
              <ChevronRight />
            </>
          )}
        </Button>
      </div>

      {/* Incomplete Warning */}
      {!isComplete && (
        <Card>
          <CardContent>
            <div>
              <AlertCircle />
              <div>
                <div>Almost Ready!</div>
                <div>
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