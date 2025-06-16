"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { ArrowLeft, ArrowRight, CheckCircle, Home, Calculator, Palette, FileText, Plus, Trash2 } from "lucide-react";

interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
}

interface ContractorQuoteData {
  // Customer Info
  customerName: string;
  address: string;
  email: string;
  phone: string;
  
  // Project Details
  projectType: 'interior' | 'exterior' | 'both';
  
  // Room Measurements (how contractors actually work)
  rooms: Room[];
  
  // Surface Selection (based on project type)
  surfaces: {
    walls: boolean;
    ceilings: boolean;
    trim: boolean;
    doors: boolean;
    windows: boolean;
    cabinets: boolean;
    exteriorSiding: boolean;
    exteriorTrim: boolean;
  };
  
  // Paint Selection (professional products)
  paintSelections: {
    [surface: string]: {
      brand: string;
      product: string;
      quality: 'good' | 'better' | 'best';
      pricePerGallon: number;
    };
  };
  
  // Business Details
  markup: number;
  laborRate: number;
}

interface ContractorQuoteWizardProps {
  onComplete: (quoteData: ContractorQuoteData) => void;
  onCancel: () => void;
}

export function ContractorQuoteWizard({ onComplete, onCancel }: ContractorQuoteWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<ContractorQuoteData>({
    customerName: "",
    address: "",
    email: "",
    phone: "",
    projectType: 'interior',
    rooms: [],
    surfaces: {
      walls: false,
      ceilings: false,
      trim: false,
      doors: false,
      windows: false,
      cabinets: false,
      exteriorSiding: false,
      exteriorTrim: false,
    },
    paintSelections: {},
    markup: 35, // Professional 35% markup default
    laborRate: 45, // $45/hour default
  });

  const steps = [
    { number: 1, title: "Customer Info", icon: Home },
    { number: 2, title: "Project Type", icon: Home },
    { number: 3, title: "Room Measurements", icon: Calculator },
    { number: 4, title: "Paint Products", icon: Palette },
    { number: 5, title: "Final Quote", icon: FileText }
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateQuoteData = (field: string, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `Room ${quoteData.rooms.length + 1}`,
      length: 0,
      width: 0,
      height: 8, // Default 8ft ceiling
      doors: 1,
      windows: 1,
    };
    setQuoteData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
  };

  const updateRoom = (roomId: string, field: keyof Room, value: any) => {
    setQuoteData(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => 
        room.id === roomId ? { ...room, [field]: value } : room
      )
    }));
  };

  const removeRoom = (roomId: string) => {
    setQuoteData(prev => ({
      ...prev,
      rooms: prev.rooms.filter(room => room.id !== roomId)
    }));
  };

  const getAvailableSurfaces = () => {
    if (quoteData.projectType === 'interior') {
      return ['walls', 'ceilings', 'trim', 'doors', 'windows', 'cabinets'];
    } else if (quoteData.projectType === 'exterior') {
      return ['exteriorSiding', 'exteriorTrim', 'doors', 'windows'];
    } else {
      return ['walls', 'ceilings', 'trim', 'doors', 'windows', 'cabinets', 'exteriorSiding', 'exteriorTrim'];
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quoteData.customerName && quoteData.address;
      case 2:
        return quoteData.projectType && Object.values(quoteData.surfaces).some(Boolean);
      case 3:
        return quoteData.rooms.length > 0 && quoteData.rooms.every(room => 
          room.length > 0 && room.width > 0 && room.height > 0
        );
      case 4:
        return Object.keys(quoteData.paintSelections).length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={quoteData.customerName}
                onChange={(e) => updateQuoteData('customerName', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                value={quoteData.address}
                onChange={(e) => updateQuoteData('address', e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={quoteData.email}
                  onChange={(e) => updateQuoteData('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={quoteData.phone}
                  onChange={(e) => updateQuoteData('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Project Type *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'interior', label: 'Interior Only', desc: 'Inside walls, ceilings, trim' },
                  { value: 'exterior', label: 'Exterior Only', desc: 'Siding, trim, doors, windows' },
                  { value: 'both', label: 'Interior + Exterior', desc: 'Complete project' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateQuoteData('projectType', type.value)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      quoteData.projectType === type.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium mb-4 block">Surfaces to Paint *</Label>
              <div className="grid grid-cols-2 gap-3">
                {getAvailableSurfaces().map((surface) => {
                  const isSelected = quoteData.surfaces[surface as keyof typeof quoteData.surfaces];
                  const surfaceLabels: { [key: string]: string } = {
                    walls: 'Walls',
                    ceilings: 'Ceilings',
                    trim: 'Interior Trim',
                    doors: 'Doors',
                    windows: 'Window Frames',
                    cabinets: 'Cabinets',
                    exteriorSiding: 'Exterior Siding',
                    exteriorTrim: 'Exterior Trim',
                  };
                  
                  return (
                    <button
                      key={surface}
                      onClick={() => {
                        const newSurfaces = {
                          ...quoteData.surfaces,
                          [surface]: !isSelected
                        };
                        updateQuoteData('surfaces', newSurfaces);
                      }}
                      className={`p-3 border rounded-lg text-sm transition-colors ${
                        isSelected
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {surfaceLabels[surface]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Room Measurements *</Label>
              <Button onClick={addRoom} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </div>
            
            {quoteData.rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Home className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No rooms added yet. Click "Add Room" to start measuring.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quoteData.rooms.map((room) => (
                  <Card key={room.id} className="border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={room.name}
                          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                          className="text-base font-medium border-none p-0 h-auto focus:ring-0"
                          placeholder="Room name"
                        />
                        <Button
                          onClick={() => removeRoom(room.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div>
                          <Label className="text-xs">Length (ft)</Label>
                          <Input
                            type="number"
                            value={room.length || ''}
                            onChange={(e) => updateRoom(room.id, 'length', parseFloat(e.target.value) || 0)}
                            placeholder="12"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Width (ft)</Label>
                          <Input
                            type="number"
                            value={room.width || ''}
                            onChange={(e) => updateRoom(room.id, 'width', parseFloat(e.target.value) || 0)}
                            placeholder="10"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Height (ft)</Label>
                          <Input
                            type="number"
                            value={room.height || ''}
                            onChange={(e) => updateRoom(room.id, 'height', parseFloat(e.target.value) || 8)}
                            placeholder="8"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Doors</Label>
                          <Input
                            type="number"
                            value={room.doors || ''}
                            onChange={(e) => updateRoom(room.id, 'doors', parseInt(e.target.value) || 0)}
                            placeholder="1"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Windows</Label>
                          <Input
                            type="number"
                            value={room.windows || ''}
                            onChange={(e) => updateRoom(room.id, 'windows', parseInt(e.target.value) || 0)}
                            placeholder="2"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Floor area: {(room.length * room.width).toFixed(1)} sq ft
                        {room.length > 0 && room.width > 0 && room.height > 0 && (
                          <span className="ml-4">
                            Wall area: {(2 * (room.length + room.width) * room.height - (room.doors * 20) - (room.windows * 15)).toFixed(1)} sq ft
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        const selectedSurfaces = Object.entries(quoteData.surfaces)
          .filter(([_, selected]) => selected)
          .map(([surface, _]) => surface);

        return (
          <div className="space-y-6">
            <Label className="text-base font-medium">Paint Products for Selected Surfaces</Label>
            
            {selectedSurfaces.map((surface) => {
              const surfaceLabels: { [key: string]: string } = {
                walls: 'Wall Paint',
                ceilings: 'Ceiling Paint',
                trim: 'Trim Paint',
                doors: 'Door Paint',
                windows: 'Window Paint',
                cabinets: 'Cabinet Paint',
                exteriorSiding: 'Exterior Siding Paint',
                exteriorTrim: 'Exterior Trim Paint',
              };

              return (
                <Card key={surface} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{surfaceLabels[surface]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Brand</Label>
                        <select
                          value={quoteData.paintSelections[surface]?.brand || ''}
                          onChange={(e) => {
                            const newSelections = {
                              ...quoteData.paintSelections,
                              [surface]: {
                                ...quoteData.paintSelections[surface],
                                brand: e.target.value,
                                product: '', // Reset product when brand changes
                              }
                            };
                            updateQuoteData('paintSelections', newSelections);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Brand</option>
                          <option value="Sherwin-Williams">Sherwin-Williams</option>
                          <option value="Benjamin Moore">Benjamin Moore</option>
                          <option value="Behr">Behr Premium</option>
                          <option value="PPG">PPG Professional</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Quality Level</Label>
                        <select
                          value={quoteData.paintSelections[surface]?.quality || 'better'}
                          onChange={(e) => {
                            const quality = e.target.value as 'good' | 'better' | 'best';
                            const priceMap = {
                              good: 45,
                              better: 65,
                              best: 85
                            };
                            
                            const newSelections = {
                              ...quoteData.paintSelections,
                              [surface]: {
                                ...quoteData.paintSelections[surface],
                                quality,
                                pricePerGallon: priceMap[quality],
                                product: `${quality.charAt(0).toUpperCase() + quality.slice(1)} Quality`
                              }
                            };
                            updateQuoteData('paintSelections', newSelections);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="good">Good ($45/gal)</option>
                          <option value="better">Better ($65/gal)</option>
                          <option value="best">Best ($85/gal)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="markup">Markup Percentage</Label>
                    <Input
                      id="markup"
                      type="number"
                      value={quoteData.markup}
                      onChange={(e) => updateQuoteData('markup', parseInt(e.target.value) || 35)}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-600 mt-1">Industry standard: 25-45%</p>
                  </div>
                  <div>
                    <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
                    <Input
                      id="laborRate"
                      type="number"
                      value={quoteData.laborRate}
                      onChange={(e) => updateQuoteData('laborRate', parseInt(e.target.value) || 45)}
                      min="0"
                    />
                    <p className="text-xs text-gray-600 mt-1">Your hourly rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        // Calculate totals (simplified for now)
        const totalRoomSqFt = quoteData.rooms.reduce((sum, room) => sum + (room.length * room.width), 0);
        const totalWallSqFt = quoteData.rooms.reduce((sum, room) => 
          sum + (2 * (room.length + room.width) * room.height - (room.doors * 20) - (room.windows * 15)), 0);
        
        const estimatedMaterialCost = Object.keys(quoteData.paintSelections).length * 200; // Rough estimate
        const estimatedLaborHours = totalWallSqFt / 150; // ~150 sqft per hour
        const estimatedLaborCost = estimatedLaborHours * quoteData.laborRate;
        const subtotal = estimatedMaterialCost + estimatedLaborCost;
        const markupAmount = subtotal * (quoteData.markup / 100);
        const total = subtotal + markupAmount;

        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Professional Quote Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-500">Customer:</span> {quoteData.customerName}</div>
                    <div><span className="text-gray-500">Address:</span> {quoteData.address}</div>
                    <div><span className="text-gray-500">Project Type:</span> {quoteData.projectType}</div>
                    <div><span className="text-gray-500">Rooms:</span> {quoteData.rooms.length}</div>
                    <div><span className="text-gray-500">Total Floor Area:</span> {totalRoomSqFt.toFixed(1)} sq ft</div>
                    <div><span className="text-gray-500">Wall Area:</span> {totalWallSqFt.toFixed(1)} sq ft</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Materials:</span>
                      <span>${estimatedMaterialCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Labor ({estimatedLaborHours.toFixed(1)} hrs @ ${quoteData.laborRate}/hr):</span>
                      <span>${estimatedLaborCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Markup ({quoteData.markup}%):</span>
                      <span>${markupAmount.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-green-900">
                      <span>Total Quote:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Room Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {quoteData.rooms.map((room) => (
                    <div key={room.id} className="flex justify-between">
                      <span className="text-gray-500">{room.name}:</span>
                      <span>{room.length}' × {room.width}' × {room.height}' ({(room.length * room.width).toFixed(1)} sq ft)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Professional Quote Builder</h1>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${
                  isActive ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button
            onClick={() => onComplete(quoteData)}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            Generate Professional Quote
            <FileText className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}