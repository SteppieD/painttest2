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
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <h1>Professional Painting Quote</h1>
            <p>Quote #{quote.id}</p>
          </div>
          <div>
            <div>${quote.totals.total.toLocaleString()}</div>
            <div>Total Investment</div>
          </div>
        </div>

        <div>
          <div>
            <h3>Customer Information</h3>
            <div>
              <div>
                <MapPin />
                <span>{quote.customerName}</span>
              </div>
              <div>
                <MapPin />
                <span>{quote.customerAddress}</span>
              </div>
              {quote.customerPhone && (
                <div>
                  <Phone />
                  <span>{quote.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3>Company Information</h3>
            <div>
              <div>
                <Award />
                <span>{quote.companyInfo.name}</span>
              </div>
              <div>
                <Phone />
                <span>{quote.companyInfo.phone}</span>
              </div>
              <div>
                <Shield />
                <span>{quote.companyInfo.license}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <div>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
             
            >
              <section.icon />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div>
          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <h4>Scope of Work</h4>
                  <div>
                    <div>
                      <Palette />
                      <span>{quote.projectType}</span>
                    </div>
                    <div>
                      <CheckCircle2 />
                      <span>{quote.rooms.length} rooms included</span>
                    </div>
                    <div>
                      <Clock />
                      <span>{quote.timeline.estimatedDays} days estimated</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4>Investment Breakdown</h4>
                  <div>
                    <div>
                      <span>Materials</span>
                      <span>${quote.totals.materials.toLocaleString()}</span>
                    </div>
                    <div>
                      <span>Labor</span>
                      <span>${quote.totals.labor.toLocaleString()}</span>
                    </div>
                    <div>
                      <span>Total</span>
                      <span>${quote.totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose {quote.companyInfo.name}?</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <Shield />
                  <h4>Fully Licensed & Insured</h4>
                  <p>{quote.companyInfo.insurance}</p>
                </div>
                <div>
                  <Award />
                  <h4>2-Year Warranty</h4>
                  <p>Guaranteed workmanship</p>
                </div>
                <div>
                  <Star />
                  <h4>Premium Materials</h4>
                  <p>Professional-grade paints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'details' && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Room-by-Room Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {quote.rooms.map((room, index) => (
                  <div key={index}>
                    <div>
                      <h4>{room.name}</h4>
                      <Badge>
                        ${room.cost.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <div>
                      <div>
                        <p>Dimensions & Area</p>
                        <p>{room.dimensions}</p>
                        <p>{room.area} sq ft</p>
                      </div>
                      <div>
                        <p>Paint Product</p>
                        <p>{room.paintProduct}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p>Surfaces Included</p>
                      <div>
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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <Calendar />
                  <div>
                    <h4>Estimated Duration</h4>
                    <p>{quote.timeline.estimatedDays} working days</p>
                  </div>
                </div>

                {quote.timeline.startDate && (
                  <div>
                    <div>
                      <h4>Proposed Start Date</h4>
                      <p>{quote.timeline.startDate}</p>
                    </div>
                    <div>
                      <h4>Estimated Completion</h4>
                      <p>{quote.timeline.completionDate}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4>Weather Considerations</h4>
                  <p>
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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <h4>Payment Terms</h4>
                    <div>
                      <div>
                        <span>Deposit Required</span>
                        <span>${quote.terms.deposit.toLocaleString()}</span>
                      </div>
                      <p>{quote.terms.paymentTerms}</p>
                    </div>
                  </div>

                  <div>
                    <h4>Quote Validity</h4>
                    <div>
                      <div>
                        <span>Valid Until</span>
                        <span>{quote.terms.validUntil}</span>
                      </div>
                      <p>
                        Prices subject to change after this date
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4>Our Guarantee</h4>
                  <p>
                    {quote.terms.warranty}. We stand behind our work with complete confidence.
                  </p>
                </div>

                <div>
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
      <div>
        <div>
          <div>
            <Button
              onClick={onDownload}
             
            >
              <Download />
              Download PDF
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
             
            >
              <Share2 />
              Share Quote
            </Button>
          </div>

          {isClientView && onAccept && (
            <div>
              <Button
                onClick={onAccept}
               
              >
                <CheckCircle2 />
                Accept This Quote
              </Button>
              <p>
                By accepting, you agree to the terms and conditions outlined above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}