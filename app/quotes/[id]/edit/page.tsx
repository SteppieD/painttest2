"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit3, 
  Home, 
  Palette, 
  Ruler, 
  DollarSign, 
  Save, 
  Undo,
  User,
  MapPin,
  Settings,
  Package
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { calculateQuote, calculateSurfaceArea } from "@/lib/quote-calculator";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  ceiling_area: number;
  wall_area: number;
  number_of_doors: number;
  number_of_windows: number;
}

interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address: string;
  project_type: string;
  sqft: number;
  paint_quality: string;
  total_cost: number;
  final_price: number;
  timeline: string;
  created_at: string;
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
  prep_work?: string;
  special_requests?: string;
  wall_linear_feet?: number;
  ceiling_height?: number;
  number_of_doors?: number;
  number_of_windows?: number;
  markup_amount?: number;
  room_data?: string;
  room_count?: number;
  base_costs?: any;
  details?: any;
  // Paint product fields
  primer_cost?: number;
  wall_paint_cost?: number;
  ceiling_paint_cost?: number;
  trim_paint_cost?: number;
  primer_name?: string;
  wall_paint_name?: string;
  ceiling_paint_name?: string;
  trim_paint_name?: string;
}

type EditModalType = 
  | "customer_info"
  | "project_details" 
  | "room"
  | "paint_quality"
  | "paint_products"
  | "measurements"
  | "pricing"
  | "timeline"
  | "other"
  | null;

export default function QuoteEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editModal, setEditModal] = useState<EditModalType>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
        
        // Parse room data if available
        if (data.room_data && typeof data.room_data === 'string') {
          try {
            const roomData = JSON.parse(data.room_data);
            if (Array.isArray(roomData)) {
              setRooms(roomData);
            }
          } catch (e) {
            console.error('Error parsing room data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (type: EditModalType, data?: any) => {
    setEditModal(type);
    setEditForm(data || {});
    if (type === "room" && data) {
      setEditingRoom(data);
    }
  };

  const closeEditModal = () => {
    setEditModal(null);
    setEditingRoom(null);
    setEditForm({});
  };

  const saveChanges = async () => {
    if (!editModal || !quote) return;
    
    setIsSaving(true);
    try {
      let updateData: any = {};

      switch (editModal) {
        case "customer_info":
          updateData = {
            customer_name: editForm.customer_name || quote.customer_name,
            customer_email: editForm.customer_email || quote.customer_email,
            customer_phone: editForm.customer_phone || quote.customer_phone,
            address: editForm.address || quote.address,
          };
          break;

        case "project_details":
          updateData = {
            project_type: editForm.project_type || quote.project_type,
            special_requests: editForm.special_requests || quote.special_requests,
            prep_work: editForm.prep_work || quote.prep_work,
          };
          break;

        case "paint_quality":
          updateData = {
            paint_quality: editForm.paint_quality || quote.paint_quality,
          };
          break;

        case "paint_products":
          updateData = {
            primer_cost: parseFloat(editForm.primer_cost) || quote.primer_cost,
            wall_paint_cost: parseFloat(editForm.wall_paint_cost) || quote.wall_paint_cost,
            ceiling_paint_cost: parseFloat(editForm.ceiling_paint_cost) || quote.ceiling_paint_cost,
            trim_paint_cost: parseFloat(editForm.trim_paint_cost) || quote.trim_paint_cost,
            primer_name: editForm.primer_name || quote.primer_name,
            wall_paint_name: editForm.wall_paint_name || quote.wall_paint_name,
            ceiling_paint_name: editForm.ceiling_paint_name || quote.ceiling_paint_name,
            trim_paint_name: editForm.trim_paint_name || quote.trim_paint_name,
          };
          break;

        case "measurements":
          const newMeasurements = {
            walls_sqft: parseFloat(editForm.walls_sqft) || quote.walls_sqft,
            ceilings_sqft: parseFloat(editForm.ceilings_sqft) || quote.ceilings_sqft,
            trim_sqft: parseFloat(editForm.trim_sqft) || quote.trim_sqft,
            wall_linear_feet: parseFloat(editForm.wall_linear_feet) || quote.wall_linear_feet,
            ceiling_height: parseFloat(editForm.ceiling_height) || quote.ceiling_height,
            number_of_doors: parseInt(editForm.number_of_doors) || quote.number_of_doors,
            number_of_windows: parseInt(editForm.number_of_windows) || quote.number_of_windows,
          };

          // Recalculate quote with new measurements
          const newQuoteCalc = calculateQuote({
            walls_sqft: newMeasurements.walls_sqft,
            ceilings_sqft: newMeasurements.ceilings_sqft,
            trim_sqft: newMeasurements.trim_sqft,
            number_of_doors: newMeasurements.number_of_doors,
            number_of_windows: newMeasurements.number_of_windows,
            paint_quality: quote.paint_quality,
            markup_percentage: 30
          });

          updateData = {
            ...newMeasurements,
            final_price: newQuoteCalc.total,
          };
          break;

        case "timeline":
          updateData = {
            timeline: editForm.timeline || quote.timeline,
          };
          break;

        case "room":
          if (editingRoom) {
            // Recalculate room areas if dimensions changed
            const updatedRoom = { ...editingRoom, ...editForm };
            if (editForm.length || editForm.width || editForm.height) {
              const areas = calculateSurfaceArea(
                updatedRoom.length,
                updatedRoom.width,
                updatedRoom.height,
                updatedRoom.number_of_doors || 0,
                updatedRoom.number_of_windows || 0
              );
              updatedRoom.wall_area = areas.walls;
              updatedRoom.ceiling_area = areas.ceiling;
            }

            const updatedRooms = rooms.map(room => 
              room.id === editingRoom.id ? updatedRoom : room
            );
            setRooms(updatedRooms);

            // Recalculate quote totals based on updated room data
            let totalWalls = 0, totalCeilings = 0, totalDoors = 0, totalWindows = 0;
            updatedRooms.forEach(room => {
              totalWalls += room.wall_area || 0;
              totalCeilings += room.ceiling_area || 0;
              totalDoors += room.number_of_doors || 0;
              totalWindows += room.number_of_windows || 0;
            });

            const newQuoteCalc = calculateQuote({
              walls_sqft: totalWalls,
              ceilings_sqft: totalCeilings,
              number_of_doors: totalDoors,
              number_of_windows: totalWindows,
              paint_quality: quote.paint_quality,
              markup_percentage: 30
            });

            updateData = {
              room_data: JSON.stringify(updatedRooms),
              room_count: updatedRooms.length,
              walls_sqft: totalWalls,
              ceilings_sqft: totalCeilings,
              number_of_doors: totalDoors,
              number_of_windows: totalWindows,
              final_price: newQuoteCalc.total,
            };
          }
          break;

        case "other":
          updateData = editForm;
          break;
      }

      const response = await fetch(`/api/quotes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedQuote = await response.json();
        setQuote(updatedQuote);
        setHasChanges(true);
        closeEditModal();
        toast({
          title: "Changes Saved",
          description: "Quote has been updated successfully.",
        });
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quote not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/quotes/${params.id}`)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Edit Quote</h1>
                <p className="text-sm text-gray-500">#{quote.quote_id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Save className="w-3 h-3 mr-1" />
                  Changes Saved
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={() => router.push(`/quotes/${params.id}/customer`)}
              >
                Preview Customer View
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <CardTitle>Customer Information</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("customer_info", {
                  customer_name: quote.customer_name,
                  customer_email: quote.customer_email,
                  customer_phone: quote.customer_phone,
                  address: quote.address,
                })}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-medium">{quote.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{quote.address}</p>
              </div>
              {quote.customer_email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{quote.customer_email}</p>
                </div>
              )}
              {quote.customer_phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{quote.customer_phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                <CardTitle>Project Details</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("project_details", {
                  project_type: quote.project_type,
                  special_requests: quote.special_requests,
                  prep_work: quote.prep_work,
                })}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Project Type</p>
                <p className="font-medium capitalize">{quote.project_type} Painting</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="font-medium">{quote.timeline || 'Not specified'}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal("timeline", { timeline: quote.timeline })}
                  className="mt-1 p-0 h-auto text-blue-600"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit Timeline
                </Button>
              </div>
              {quote.prep_work && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Prep Work</p>
                  <p className="font-medium">{quote.prep_work}</p>
                </div>
              )}
              {quote.special_requests && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Special Requests</p>
                  <p className="font-medium">{quote.special_requests}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paint Quality */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <CardTitle>Paint Quality & Specifications</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("paint_quality", {
                  paint_quality: quote.paint_quality,
                })}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600">Paint Quality Level</p>
              <Badge variant="secondary" className="capitalize mt-1">
                {quote.paint_quality || 'Premium'} Grade
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Paint Products & Costs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <CardTitle>Paint Products & Costs</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("paint_products", {
                  primer_cost: quote.primer_cost,
                  wall_paint_cost: quote.wall_paint_cost,
                  ceiling_paint_cost: quote.ceiling_paint_cost,
                  trim_paint_cost: quote.trim_paint_cost,
                  primer_name: quote.primer_name,
                  wall_paint_name: quote.wall_paint_name,
                  ceiling_paint_name: quote.ceiling_paint_name,
                  trim_paint_name: quote.trim_paint_name,
                })}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit Products
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Primer</p>
                <p className="font-medium">{quote.primer_name || 'Standard Primer'}</p>
                <p className="text-sm text-green-600">${quote.primer_cost || 25}/gallon</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Wall Paint</p>
                <p className="font-medium">{quote.wall_paint_name || 'Standard Wall Paint'}</p>
                <p className="text-sm text-green-600">${quote.wall_paint_cost || 45}/gallon</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ceiling Paint</p>
                <p className="font-medium">{quote.ceiling_paint_name || 'Standard Ceiling Paint'}</p>
                <p className="text-sm text-green-600">${quote.ceiling_paint_cost || 35}/gallon</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trim Paint</p>
                <p className="font-medium">{quote.trim_paint_name || 'Standard Trim Paint'}</p>
                <p className="text-sm text-green-600">${quote.trim_paint_cost || 55}/gallon</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> These costs are specific to this quote and won't affect your global product settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-orange-600" />
                <CardTitle>Measurements & Areas</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("measurements", {
                  walls_sqft: quote.walls_sqft,
                  ceilings_sqft: quote.ceilings_sqft,
                  trim_sqft: quote.trim_sqft,
                  wall_linear_feet: quote.wall_linear_feet,
                  ceiling_height: quote.ceiling_height,
                  number_of_doors: quote.number_of_doors,
                  number_of_windows: quote.number_of_windows,
                })}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quote.walls_sqft && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{quote.walls_sqft.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Walls (sq ft)</p>
                </div>
              )}
              {quote.ceilings_sqft && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{quote.ceilings_sqft.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Ceilings (sq ft)</p>
                </div>
              )}
              {quote.trim_sqft && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{quote.trim_sqft.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Trim (sq ft)</p>
                </div>
              )}
              {(quote.number_of_doors || quote.number_of_windows) && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">
                    {(quote.number_of_doors || 0) + (quote.number_of_windows || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Doors & Windows</p>
                </div>
              )}
            </div>
            {quote.wall_linear_feet && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Linear Feet</p>
                  <p className="font-medium">{quote.wall_linear_feet} ft</p>
                </div>
                {quote.ceiling_height && (
                  <div>
                    <p className="text-sm text-gray-600">Ceiling Height</p>
                    <p className="font-medium">{quote.ceiling_height} ft</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Room Breakdown */}
        {rooms.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-600" />
                  <CardTitle>Room Breakdown ({rooms.length} rooms)</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room, index) => (
                  <div key={room.id || index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{room.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal("room", room)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span>{room.length}' × {room.width}' × {room.height}'</span>
                      </div>
                      {room.ceiling_area > 0 && (
                        <div className="flex justify-between">
                          <span>Ceiling:</span>
                          <span>{room.ceiling_area} sq ft</span>
                        </div>
                      )}
                      {room.wall_area > 0 && (
                        <div className="flex justify-between">
                          <span>Walls:</span>
                          <span>{room.wall_area} sq ft</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <CardTitle>Pricing</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("other", {
                  final_price: quote.final_price,
                  total_cost: quote.total_cost,
                  markup_amount: quote.markup_amount,
                })}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit Pricing
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(quote.final_price || quote.total_cost)}
                </p>
                <p className="text-sm text-gray-600">Total Price</p>
              </div>
              {quote.markup_amount && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(quote.markup_amount)}
                  </p>
                  <p className="text-sm text-gray-600">Markup</p>
                </div>
              )}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-600">
                  Created {new Date(quote.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Quote Date</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modals */}
      <Dialog open={editModal !== null} onOpenChange={() => closeEditModal()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editModal === "customer_info" && "Edit Customer Information"}
              {editModal === "project_details" && "Edit Project Details"}
              {editModal === "paint_quality" && "Edit Paint Quality"}
              {editModal === "paint_products" && "Edit Paint Products & Costs"}
              {editModal === "measurements" && "Edit Measurements"}
              {editModal === "timeline" && "Edit Timeline"}
              {editModal === "room" && `Edit ${editingRoom?.name || 'Room'}`}
              {editModal === "other" && "Edit Quote Details"}
            </DialogTitle>
            <DialogDescription>
              Make changes to this section of the quote.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {editModal === "customer_info" && (
              <>
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={editForm.customer_name || ""}
                    onChange={(e) => setEditForm({...editForm, customer_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editForm.customer_email || ""}
                    onChange={(e) => setEditForm({...editForm, customer_email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editForm.customer_phone || ""}
                    onChange={(e) => setEditForm({...editForm, customer_phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={editForm.address || ""}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  />
                </div>
              </>
            )}

            {editModal === "project_details" && (
              <>
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Select
                    value={editForm.project_type || ""}
                    onValueChange={(value) => setEditForm({...editForm, project_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="both">Interior & Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prep Work</Label>
                  <Textarea
                    value={editForm.prep_work || ""}
                    onChange={(e) => setEditForm({...editForm, prep_work: e.target.value})}
                    placeholder="Describe any special preparation work needed..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Special Requests</Label>
                  <Textarea
                    value={editForm.special_requests || ""}
                    onChange={(e) => setEditForm({...editForm, special_requests: e.target.value})}
                    placeholder="Any special customer requests..."
                  />
                </div>
              </>
            )}

            {editModal === "paint_quality" && (
              <div className="space-y-2">
                <Label>Paint Quality Level</Label>
                <Select
                  value={editForm.paint_quality || ""}
                  onValueChange={(value) => setEditForm({...editForm, paint_quality: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="better">Better</SelectItem>
                    <SelectItem value="best">Best</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {editModal === "paint_products" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primer Name</Label>
                    <Input
                      value={editForm.primer_name || ""}
                      onChange={(e) => setEditForm({...editForm, primer_name: e.target.value})}
                      placeholder="e.g., Zinsser Bulls Eye 1-2-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primer Cost per Gallon</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.primer_cost || ""}
                        onChange={(e) => setEditForm({...editForm, primer_cost: e.target.value})}
                        placeholder="25.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Wall Paint Name</Label>
                    <Input
                      value={editForm.wall_paint_name || ""}
                      onChange={(e) => setEditForm({...editForm, wall_paint_name: e.target.value})}
                      placeholder="e.g., Benjamin Moore Regal Select"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Wall Paint Cost per Gallon</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.wall_paint_cost || ""}
                        onChange={(e) => setEditForm({...editForm, wall_paint_cost: e.target.value})}
                        placeholder="45.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ceiling Paint Name</Label>
                    <Input
                      value={editForm.ceiling_paint_name || ""}
                      onChange={(e) => setEditForm({...editForm, ceiling_paint_name: e.target.value})}
                      placeholder="e.g., Sherwin-Williams ProMar 200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ceiling Paint Cost per Gallon</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.ceiling_paint_cost || ""}
                        onChange={(e) => setEditForm({...editForm, ceiling_paint_cost: e.target.value})}
                        placeholder="35.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Trim Paint Name</Label>
                    <Input
                      value={editForm.trim_paint_name || ""}
                      onChange={(e) => setEditForm({...editForm, trim_paint_name: e.target.value})}
                      placeholder="e.g., Benjamin Moore Advance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trim Paint Cost per Gallon</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.trim_paint_cost || ""}
                        onChange={(e) => setEditForm({...editForm, trim_paint_cost: e.target.value})}
                        placeholder="55.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">
                    <strong>Note:</strong> These changes only apply to this specific quote and won't modify your global product settings.
                  </p>
                </div>
              </div>
            )}

            {editModal === "measurements" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Walls (sq ft)</Label>
                    <Input
                      type="number"
                      value={editForm.walls_sqft || ""}
                      onChange={(e) => setEditForm({...editForm, walls_sqft: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ceilings (sq ft)</Label>
                    <Input
                      type="number"
                      value={editForm.ceilings_sqft || ""}
                      onChange={(e) => setEditForm({...editForm, ceilings_sqft: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trim (sq ft)</Label>
                    <Input
                      type="number"
                      value={editForm.trim_sqft || ""}
                      onChange={(e) => setEditForm({...editForm, trim_sqft: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Linear Feet</Label>
                    <Input
                      type="number"
                      value={editForm.wall_linear_feet || ""}
                      onChange={(e) => setEditForm({...editForm, wall_linear_feet: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ceiling Height (ft)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.ceiling_height || ""}
                      onChange={(e) => setEditForm({...editForm, ceiling_height: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Doors</Label>
                    <Input
                      type="number"
                      value={editForm.number_of_doors || ""}
                      onChange={(e) => setEditForm({...editForm, number_of_doors: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Windows</Label>
                    <Input
                      type="number"
                      value={editForm.number_of_windows || ""}
                      onChange={(e) => setEditForm({...editForm, number_of_windows: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            {editModal === "timeline" && (
              <div className="space-y-2">
                <Label>Project Timeline</Label>
                <Input
                  value={editForm.timeline || ""}
                  onChange={(e) => setEditForm({...editForm, timeline: e.target.value})}
                  placeholder="e.g., 3-5 business days"
                />
              </div>
            )}

            {editModal === "room" && editingRoom && (
              <>
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input
                    value={editForm.name || editingRoom.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Length (ft)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.length || editingRoom.length}
                      onChange={(e) => setEditForm({...editForm, length: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Width (ft)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.width || editingRoom.width}
                      onChange={(e) => setEditForm({...editForm, width: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (ft)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.height || editingRoom.height}
                      onChange={(e) => setEditForm({...editForm, height: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Doors</Label>
                    <Input
                      type="number"
                      value={editForm.number_of_doors || editingRoom.number_of_doors}
                      onChange={(e) => setEditForm({...editForm, number_of_doors: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Windows</Label>
                    <Input
                      type="number"
                      value={editForm.number_of_windows || editingRoom.number_of_windows}
                      onChange={(e) => setEditForm({...editForm, number_of_windows: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </>
            )}

            {editModal === "other" && (
              <>
                <div className="space-y-2">
                  <Label>Final Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.final_price || ""}
                      onChange={(e) => setEditForm({...editForm, final_price: parseFloat(e.target.value)})}
                      className="pl-8"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={saveChanges} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}