"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Palette, 
  Shield, 
  Award, 
  Clock,
  CheckCircle2,
  Download,
  Share2,
  FileText,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteData {
  id: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  projectType: string;
  rooms: Array<{
    name: string;
    dimensions: string;
    surfaces: string[];
    paintProduct: string;
    area: number;
    cost: number;
  }>;
  totals: {
    materials: number;
    labor: number;
    subtotal: number;
    markup: number;
    total: number;
  };
  timeline: {
    estimatedDays: number;
    startDate?: string;
    completionDate?: string;
  };
  terms: {
    validUntil: string;
    deposit: number;
    paymentTerms: string;
    warranty: string;
  };
  companyInfo: {
    name: string;
    phone: string;
    email: string;
    website: string;
    license: string;
    insurance: string;
    address: string;
  };
}

interface ProfessionalQuotePresentationProps {
  quote: QuoteData;
  onDownload: () => void;
  onShare: () => void;
  onAccept?: () => void;
  isClientView?: boolean;
  className?: string;
}

const SAMPLE_QUOTE: QuoteData = {
  id: "Q-2024-001",
  customerName: "Sarah Johnson",
  customerAddress: "123 Oak Street, Hometown, ST 12345",
  customerPhone: "(555) 123-4567",
  customerEmail: "sarah.johnson@email.com",
  projectType: "Interior Painting - 3 Rooms",
  rooms: [
    {
      name: "Master Bedroom",
      dimensions: "12' × 14' × 9'",
      surfaces: ["Walls", "Ceilings"],
      paintProduct: "Sherwin-Williams ProClassic Interior Acrylic",
      area: 468,
      cost: 1850
    },
    {
      name: "Living Room", 
      dimensions: "16' × 20' × 9'",
      surfaces: ["Walls", "Ceilings"],
      paintProduct: "Sherwin-Williams ProClassic Interior Acrylic",
      area: 648,
      cost: 2450
    },
    {
      name: "Bathroom",
      dimensions: "8' × 10' × 9'",
      surfaces: ["Walls", "Ceilings", "Trim"],
      paintProduct: "Benjamin Moore Advance Waterborne Alkyd",
      area: 324,
      cost: 1200
    }
  ],
  totals: {
    materials: 890,
    labor: 4610,
    subtotal: 5500,
    markup: 1100,
    total: 6600
  },
  timeline: {
    estimatedDays: 3,
    startDate: "March 15, 2024",
    completionDate: "March 18, 2024"
  },
  terms: {
    validUntil: "February 15, 2024",
    deposit: 1980, // 30%
    paymentTerms: "30% deposit, 70% upon completion",
    warranty: "2-year warranty on workmanship"
  },
  companyInfo: {
    name: "Elite Painting Solutions",
    phone: "(555) 987-6543",
    email: "info@elitepainting.com",
    website: "www.elitepainting.com",
    license: "License #PC-123456",
    insurance: "Insured up to $2M",
    address: "456 Business Ave, Hometown, ST 12345"
  }
};

export function ProfessionalQuotePresentation({ 
  quote = SAMPLE_QUOTE,
  onDownload,
  onShare,
  onAccept,
  isClientView = false,
  className 
}: ProfessionalQuotePresentationProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'details', label: 'Project Details', icon: Palette },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'terms', label: 'Terms', icon: Shield }
  ];

  return (
    <div className={cn("design-container max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-8 p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white">
        <div className="design-inline mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Professional Painting Quote</h1>
            <p className="text-blue-100">Quote #{quote.id}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${quote.totals.total.toLocaleString()}</div>
            <div className="text-blue-100">Total Investment</div>
          </div>
        </div>

        <div className="design-grid design-grid-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1 text-blue-100">
              <div className="design-inline">
                <MapPin className="w-4 h-4" />
                <span>{quote.customerName}</span>
              </div>
              <div className="design-inline">
                <MapPin className="w-4 h-4" />
                <span>{quote.customerAddress}</span>
              </div>
              {quote.customerPhone && (
                <div className="design-inline">
                  <Phone className="w-4 h-4" />
                  <span>{quote.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Company Information</h3>
            <div className="space-y-1 text-blue-100">
              <div className="design-inline">
                <Award className="w-4 h-4" />
                <span>{quote.companyInfo.name}</span>
              </div>
              <div className="design-inline">
                <Phone className="w-4 h-4" />
                <span>{quote.companyInfo.phone}</span>
              </div>
              <div className="design-inline">
                <Shield className="w-4 h-4" />
                <span>{quote.companyInfo.license}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all duration-200",
                "text-sm font-medium",
                activeSection === section.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <section.icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="design-stack">
          {/* Project Summary */}
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="design-grid design-grid-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Scope of Work</h4>
                  <div className="space-y-2">
                    <div className="design-inline">
                      <Palette className="w-5 h-5 text-blue-600" />
                      <span>{quote.projectType}</span>
                    </div>
                    <div className="design-inline">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span>{quote.rooms.length} rooms included</span>
                    </div>
                    <div className="design-inline">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span>{quote.timeline.estimatedDays} days estimated</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Investment Breakdown</h4>
                  <div className="space-y-2">
                    <div className="design-inline">
                      <span>Materials</span>
                      <span>${quote.totals.materials.toLocaleString()}</span>
                    </div>
                    <div className="design-inline">
                      <span>Labor</span>
                      <span>${quote.totals.labor.toLocaleString()}</span>
                    </div>
                    <div className="design-inline font-semibold">
                      <span>Total</span>
                      <span>${quote.totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Why Choose {quote.companyInfo.name}?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="design-grid design-grid-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Fully Licensed & Insured</h4>
                  <p className="text-sm text-gray-600 mt-1">{quote.companyInfo.insurance}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold">2-Year Warranty</h4>
                  <p className="text-sm text-gray-600 mt-1">Guaranteed workmanship</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Premium Materials</h4>
                  <p className="text-sm text-gray-600 mt-1">Professional-grade paints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'details' && (
        <div className="design-stack">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Room-by-Room Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quote.rooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="design-inline mb-4">
                      <h4 className="font-semibold text-lg">{room.name}</h4>
                      <Badge className="bg-green-100 text-green-700">
                        ${room.cost.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <div className="design-grid design-grid-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Dimensions & Area</p>
                        <p className="font-medium">{room.dimensions}</p>
                        <p className="text-sm text-gray-500">{room.area} sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Paint Product</p>
                        <p className="font-medium">{room.paintProduct}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Surfaces Included</p>
                      <div className="flex flex-wrap gap-2">
                        {room.surfaces.map((surface) => (
                          <Badge key={surface} variant="outline">
                            {surface}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'timeline' && (
        <div className="design-stack">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="design-inline p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Estimated Duration</h4>
                    <p className="text-sm text-gray-600">{quote.timeline.estimatedDays} working days</p>
                  </div>
                </div>

                {quote.timeline.startDate && (
                  <div className="design-grid design-grid-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Proposed Start Date</h4>
                      <p className="text-lg">{quote.timeline.startDate}</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Estimated Completion</h4>
                      <p className="text-lg">{quote.timeline.completionDate}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Weather Considerations</h4>
                  <p className="text-sm text-yellow-700">
                    Timeline may vary based on weather conditions and material availability.
                    We will communicate any adjustments promptly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'terms' && (
        <div className="design-stack">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="design-grid design-grid-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Payment Terms</h4>
                    <div className="space-y-2">
                      <div className="design-inline">
                        <span>Deposit Required</span>
                        <span className="font-semibold">${quote.terms.deposit.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{quote.terms.paymentTerms}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Quote Validity</h4>
                    <div className="space-y-2">
                      <div className="design-inline">
                        <span>Valid Until</span>
                        <span className="font-semibold">{quote.terms.validUntil}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Prices subject to change after this date
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Our Guarantee</h4>
                  <p className="text-sm text-green-700">
                    {quote.terms.warranty}. We stand behind our work with complete confidence.
                  </p>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Materials and labor costs included as specified</p>
                  <p>• Color matching guaranteed to approved samples</p>
                  <p>• Clean-up and debris removal included</p>
                  <p>• All work performed by licensed professionals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <div className="design-grid design-grid-2 gap-4">
          <div className="space-y-3">
            <Button
              onClick={onDownload}
              className="design-button design-button-secondary w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="design-button design-button-secondary w-full"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Quote
            </Button>
          </div>

          {isClientView && onAccept && (
            <div className="space-y-3">
              <Button
                onClick={onAccept}
                className="design-button design-button-primary design-button-large w-full"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Accept This Quote
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By accepting, you agree to the terms and conditions outlined above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}