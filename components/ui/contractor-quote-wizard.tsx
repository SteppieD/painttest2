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
          <div>
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
            <div>
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
          <div>
            <div>
              <Label>Project Type *</Label>
              <div>
                {[
                  { value: 'interior', label: 'Interior Only', desc: 'Inside walls, ceilings, trim' },
                  { value: 'exterior', label: 'Exterior Only', desc: 'Siding, trim, doors, windows' },
                  { value: 'both', label: 'Interior + Exterior', desc: 'Complete project' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateQuoteData('projectType', type.value)}
                   `}
                  >
                    <div>{type.label}</div>
                    <div>{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Surfaces to Paint *</Label>
              <div>
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
                     `}
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
          <div>
            <div>
              <Label>Room Measurements *</Label>
              <Button onClick={addRoom} size="sm" variant="outline">
                <Plus />
                Add Room
              </Button>
            </div>
            
            {quoteData.rooms.length === 0 ? (
              <div>
                <Home />
                <p>No rooms added yet. Click "Add Room" to start measuring.</p>
              </div>
            ) : (
              <div>
                {quoteData.rooms.map((room) => (
                  <Card key={room.id}>
                    <CardHeader>
                      <div>
                        <Input
                          value={room.name}
                          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                         
                          placeholder="Room name"
                        />
                        <Button
                          onClick={() => removeRoom(room.id)}
                          size="sm"
                          variant="ghost"
                         
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <div>
                          <Label>Length (ft)</Label>
                          <Input
                            type="number"
                            value={room.length || ''}
                            onChange={(e) => updateRoom(room.id, 'length', parseFloat(e.target.value) || 0)}
                            placeholder="12"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label>Width (ft)</Label>
                          <Input
                            type="number"
                            value={room.width || ''}
                            onChange={(e) => updateRoom(room.id, 'width', parseFloat(e.target.value) || 0)}
                            placeholder="10"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label>Height (ft)</Label>
                          <Input
                            type="number"
                            value={room.height || ''}
                            onChange={(e) => updateRoom(room.id, 'height', parseFloat(e.target.value) || 8)}
                            placeholder="8"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label>Doors</Label>
                          <Input
                            type="number"
                            value={room.doors || ''}
                            onChange={(e) => updateRoom(room.id, 'doors', parseInt(e.target.value) || 0)}
                            placeholder="1"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Windows</Label>
                          <Input
                            type="number"
                            value={room.windows || ''}
                            onChange={(e) => updateRoom(room.id, 'windows', parseInt(e.target.value) || 0)}
                            placeholder="2"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        Floor area: {(room.length * room.width).toFixed(1)} sq ft
                        {room.length > 0 && room.width > 0 && room.height > 0 && (
                          <span>
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
          <div>
            <Label>Paint Products for Selected Surfaces</Label>
            
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
                <Card key={surface}>
                  <CardHeader>
                    <CardTitle>{surfaceLabels[surface]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div>
                        <Label>Brand</Label>
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
                         
                        >
                          <option value="">Select Brand</option>
                          <option value="Sherwin-Williams">Sherwin-Williams</option>
                          <option value="Benjamin Moore">Benjamin Moore</option>
                          <option value="Behr">Behr Premium</option>
                          <option value="PPG">PPG Professional</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label>Quality Level</Label>
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
            
            <Card>
              <CardContent>
                <div>
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
                    <p>Industry standard: 25-45%</p>
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
                    <p>Your hourly rate</p>
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
          <div>
            <div>
              <h3>Professional Quote Summary</h3>
              
              <div>
                <div>
                  <h4>Project Details</h4>
                  <div>
                    <div><span>Customer:</span> {quoteData.customerName}</div>
                    <div><span>Address:</span> {quoteData.address}</div>
                    <div><span>Project Type:</span> {quoteData.projectType}</div>
                    <div><span>Rooms:</span> {quoteData.rooms.length}</div>
                    <div><span>Total Floor Area:</span> {totalRoomSqFt.toFixed(1)} sq ft</div>
                    <div><span>Wall Area:</span> {totalWallSqFt.toFixed(1)} sq ft</div>
                  </div>
                </div>
                
                <div>
                  <h4>Cost Breakdown</h4>
                  <div>
                    <div>
                      <span>Materials:</span>
                      <span>${estimatedMaterialCost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span>Labor ({estimatedLaborHours.toFixed(1)} hrs @ ${quoteData.laborRate}/hr):</span>
                      <span>${estimatedLaborCost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div>
                      <span>Markup ({quoteData.markup}%):</span>
                      <span>${markupAmount.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div>
                      <span>Total Quote:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4>Room Details</h4>
                <div>
                  {quoteData.rooms.map((room) => (
                    <div key={room.id}>
                      <span>{room.name}:</span>
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
    <div>
      {/* Progress Header */}
      <div>
        <div>
          <h1>Professional Quote Builder</h1>
          <button
            onClick={onCancel}
           
          >
            Cancel
          </button>
        </div>
        
        <div>
          <div>
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div>
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number}>
                <div`}>
                  {isCompleted ? (
                    <CheckCircle />
                  ) : (
                    <StepIcon />
                  )}
                </div>
                <span`}>
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
      <div>
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button
            onClick={() => onComplete(quoteData)}
            disabled={!canProceed()}
           
          >
            Generate Professional Quote
            <FileText />
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
           
          >
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}