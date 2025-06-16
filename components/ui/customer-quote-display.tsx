"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { CheckCircle, Clock, Home, Palette, Phone, Mail, MapPin } from "lucide-react";

interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
}

interface CustomerQuoteDisplayProps {
  quote: {
    id: string;
    quote_id: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    address: string;
    project_type: string;
    rooms_data?: string;
    surfaces: string[];
    quote_amount: number;
    timeline?: string;
    company_name?: string;
    company_phone?: string;
    company_email?: string;
    created_at: string;
    status: string;
  };
  onAccept?: () => void;
  onReject?: () => void;
  onRequestChanges?: () => void;
}

export function CustomerQuoteDisplay({ quote, onAccept, onReject, onRequestChanges }: CustomerQuoteDisplayProps) {
  const rooms = quote.rooms_data ? JSON.parse(quote.rooms_data) : [];
  const totalRooms = rooms.length;
  const totalSqFt = rooms.reduce((sum: number, room: Room) => sum + (room.length * room.width), 0);
  
  const formatProjectType = (type: string) => {
    switch (type) {
      case 'interior': return 'Interior Painting';
      case 'exterior': return 'Exterior Painting'; 
      case 'both': return 'Interior & Exterior Painting';
      default: return type;
    }
  };

  const formatSurfaces = (surfaces: string[]) => {
    const surfaceLabels: { [key: string]: string } = {
      walls: 'Walls',
      ceilings: 'Ceilings',
      trim: 'Trim & Baseboards',
      doors: 'Doors',
      windows: 'Window Frames',
      cabinets: 'Cabinets',
      exteriorSiding: 'Exterior Siding',
      exteriorTrim: 'Exterior Trim',
    };
    
    return surfaces.map(surface => surfaceLabels[surface] || surface).join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-t-4 border-t-green-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-green-900">
                Painting Quote #{quote.quote_id}
              </CardTitle>
              <p className="text-gray-600 mt-1">Professional estimate for your painting project</p>
            </div>
            <Badge className={getStatusColor(quote.status)}>
              {quote.status === 'pending' || quote.status === 'sent' ? 'Awaiting Your Response' : quote.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Customer & Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Customer:</span>
              <p className="font-medium">{quote.customer_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Property Address:</span>
              <p className="font-medium flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                {quote.address}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Project Type:</span>
              <p className="font-medium">{formatProjectType(quote.project_type)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Surfaces to Paint:</span>
              <p className="font-medium">{formatSurfaces(quote.surfaces)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Project Scope
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Total Rooms:</span>
                <p className="text-xl font-bold text-gray-900">{totalRooms}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Floor Area:</span>
                <p className="text-xl font-bold text-gray-900">{totalSqFt.toFixed(0)} sq ft</p>
              </div>
            </div>
            
            {rooms.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 block mb-2">Room Breakdown:</span>
                <div className="space-y-1">
                  {rooms.map((room: Room) => (
                    <div key={room.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{room.name}</span>
                      <span className="text-gray-500">{room.length}' × {room.width}' ({(room.length * room.width).toFixed(0)} sq ft)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quote Amount - The Star of the Show */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-2">
            Total Project Cost
          </h2>
          <p className="text-5xl font-bold text-green-600 mb-4">
            ${quote.quote_amount.toLocaleString()}
          </p>
          <p className="text-gray-600 mb-6">
            This comprehensive quote includes all materials, professional labor, and project coordination
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Premium Materials</p>
              <p className="text-xs text-gray-600">High-quality paint & supplies</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Professional Service</p>
              <p className="text-xs text-gray-600">Experienced painting crew</p>
            </div>
            <div className="text-center">
              <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Complete Project</p>
              <p className="text-xs text-gray-600">Setup, painting & cleanup</p>
            </div>
          </div>

          {quote.timeline && (
            <div className="bg-white rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Estimated Timeline:</p>
              <p className="text-lg font-semibold text-gray-900">{quote.timeline}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>What's Included in This Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Materials & Supplies</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Premium quality interior/exterior paint</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Primer and specialty coatings as needed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Brushes, rollers, and application tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Drop cloths and protective materials</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Professional Services</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Surface preparation and cleaning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Expert application by trained painters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Quality control and touch-ups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Complete cleanup and restoration</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Contact */}
      {(quote.company_name || quote.company_phone || quote.company_email) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Painting Contractor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quote.company_name && (
                <div>
                  <p className="font-semibold text-lg text-gray-900">{quote.company_name}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                {quote.company_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{quote.company_phone}</span>
                  </div>
                )}
                {quote.company_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{quote.company_email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - Only show if quote is pending */}
      {(quote.status === 'pending' || quote.status === 'sent') && (onAccept || onReject || onRequestChanges) && (
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Ready to Move Forward?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onAccept && (
                <Button 
                  onClick={onAccept} 
                  className="bg-green-600 hover:bg-green-700 px-8"
                  size="lg"
                >
                  Accept Quote & Schedule Project
                </Button>
              )}
              {onRequestChanges && (
                <Button 
                  onClick={onRequestChanges} 
                  variant="outline" 
                  className="px-8"
                  size="lg"
                >
                  Request Changes
                </Button>
              )}
              {onReject && (
                <Button 
                  onClick={onReject} 
                  variant="ghost" 
                  className="px-8 text-gray-600"
                  size="lg"
                >
                  Decline Quote
                </Button>
              )}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Questions about this quote? Contact us using the information above.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quote Footer */}
      <Card>
        <CardContent className="p-4 text-center text-sm text-gray-500">
          <p>Quote generated on {new Date(quote.created_at).toLocaleDateString()}</p>
          <p className="mt-1">Quote ID: {quote.quote_id} • Valid for 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}