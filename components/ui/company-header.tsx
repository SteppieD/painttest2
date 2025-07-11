import React from 'react';
import { Phone, Mail, MapPin, Globe, Shield, Award } from 'lucide-react';
import Image from 'next/image';

interface CompanyHeaderProps {
  companyName: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  licenseNumber?: string;
  insuranceInfo?: string;
  tagline?: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyName,
  logoUrl,
  phone,
  email,
  address,
  website,
  licenseNumber,
  insuranceInfo,
  tagline
}) => {
  return (
    <div>
      <div>
        <div>
          {/* Company Logo */}
          <div>
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${companyName} Logo`}
               
              />
            ) : (
              <div>
                <span>
                  {companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div>
            <h1>{companyName}</h1>
            {tagline && (
              <p>{tagline}</p>
            )}
            
            {/* Contact Info Grid */}
            <div>
              {phone && (
                <div>
                  <Phone />
                  <a href={`tel:${phone}`}>
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div>
                  <Mail />
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              )}
              {address && (
                <div>
                  <MapPin />
                  <span>{address}</span>
                </div>
              )}
              {website && (
                <div>
                  <Globe />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* License & Insurance Badges */}
        <div>
          {licenseNumber && (
            <div>
              <Shield />
              <span>License #{licenseNumber}</span>
            </div>
          )}
          {insuranceInfo && (
            <div>
              <Award />
              <span>Fully Insured</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};