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
    <div className="bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="shrink-0">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${companyName} Logo`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{companyName}</h1>
            {tagline && (
              <p className="text-gray-600 mt-1">{tagline}</p>
            )}
            
            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
              {phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <a href={`tel:${phone}`} className="hover:text-blue-600 transition-colors">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a href={`mailto:${email}`} className="hover:text-blue-600 transition-colors">
                    {email}
                  </a>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{address}</span>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* License & Insurance Badges */}
        <div className="flex flex-col gap-2 text-sm">
          {licenseNumber && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="font-medium">License #{licenseNumber}</span>
            </div>
          )}
          {insuranceInfo && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4" />
              <span className="font-medium">Fully Insured</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};