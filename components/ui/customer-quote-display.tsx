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
    <div>
      {/* Header */}
      <Card>
        <CardHeader>
          <div>
            <div>
              <CardTitle>
                Painting Quote #{quote.quote_id}
              </CardTitle>
              <p>Professional estimate for your painting project</p>
            </div>
            <Badge>
              {quote.status === 'pending' || quote.status === 'sent' ? 'Awaiting Your Response' : quote.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Customer & Project Info */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Home />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span>Customer:</span>
              <p>{quote.customer_name}</p>
            </div>
            <div>
              <span>Property Address:</span>
              <p>
                <MapPin />
                {quote.address}
              </p>
            </div>
            <div>
              <span>Project Type:</span>
              <p>{formatProjectType(quote.project_type)}</p>
            </div>
            <div>
              <span>Surfaces to Paint:</span>
              <p>{formatSurfaces(quote.surfaces)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Palette />
              Project Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <span>Total Rooms:</span>
                <p>{totalRooms}</p>
              </div>
              <div>
                <span>Floor Area:</span>
                <p>{totalSqFt.toFixed(0)} sq ft</p>
              </div>
            </div>
            
            {rooms.length > 0 && (
              <div>
                <span>Room Breakdown:</span>
                <div>
                  {rooms.map((room: Room) => (
                    <div key={room.id}>
                      <span>{room.name}</span>
                      <span>{room.length}' × {room.width}' ({(room.length * room.width).toFixed(0)} sq ft)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quote Amount - The Star of the Show */}
      <Card>
        <CardContent>
          <h2>
            Total Project Cost
          </h2>
          <p>
            ${quote.quote_amount.toLocaleString()}
          </p>
          <p>
            This comprehensive quote includes all materials, professional labor, and project coordination
          </p>
          
          <div>
            <div>
              <CheckCircle />
              <p>Premium Materials</p>
              <p>High-quality paint & supplies</p>
            </div>
            <div>
              <Clock />
              <p>Professional Service</p>
              <p>Experienced painting crew</p>
            </div>
            <div>
              <Home />
              <p>Complete Project</p>
              <p>Setup, painting & cleanup</p>
            </div>
          </div>

          {quote.timeline && (
            <div>
              <p>Estimated Timeline:</p>
              <p>{quote.timeline}</p>
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
          <div>
            <div>
              <h4>Materials & Supplies</h4>
              <ul>
                <li>
                  <CheckCircle />
                  <span>Premium quality interior/exterior paint</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Primer and specialty coatings as needed</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Brushes, rollers, and application tools</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Drop cloths and protective materials</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4>Professional Services</h4>
              <ul>
                <li>
                  <CheckCircle />
                  <span>Surface preparation and cleaning</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Expert application by trained painters</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Quality control and touch-ups</span>
                </li>
                <li>
                  <CheckCircle />
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
            <div>
              {quote.company_name && (
                <div>
                  <p>{quote.company_name}</p>
                </div>
              )}
              <div>
                {quote.company_phone && (
                  <div>
                    <Phone />
                    <span>{quote.company_phone}</span>
                  </div>
                )}
                {quote.company_email && (
                  <div>
                    <Mail />
                    <span>{quote.company_email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - Only show if quote is pending */}
      {(quote.status === 'pending' || quote.status === 'sent') && (onAccept || onReject || onRequestChanges) && (
        <Card>
          <CardContent>
            <h3>
              Ready to Move Forward?
            </h3>
            <div>
              {onAccept && (
                <Button 
                  onClick={onAccept} 
                 
                  size="lg"
                >
                  Accept Quote & Schedule Project
                </Button>
              )}
              {onRequestChanges && (
                <Button 
                  onClick={onRequestChanges} 
                  variant="outline" 
                 
                  size="lg"
                >
                  Request Changes
                </Button>
              )}
              {onReject && (
                <Button 
                  onClick={onReject} 
                  variant="ghost" 
                 
                  size="lg"
                >
                  Decline Quote
                </Button>
              )}
            </div>
            <p>
              Questions about this quote? Contact us using the information above.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quote Footer */}
      <Card>
        <CardContent>
          <p>Quote generated on {new Date(quote.created_at).toLocaleDateString()}</p>
          <p>Quote ID: {quote.quote_id} • Valid for 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}