"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  mobileCardRenderer?: (row: (string | React.ReactNode)[], index: number) => React.ReactNode;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export function ResponsiveTable({
  headers,
  rows,
  mobileCardRenderer,
  className,
  tableClassName,
  headerClassName,
  cellClassName
}: ResponsiveTableProps) {
  // Default mobile card renderer
  const defaultMobileCard = (row: (string | React.ReactNode)[], index: number) => (
    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      {row.map((cell, cellIndex) => (
        <div key={cellIndex} className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{headers[cellIndex]}:</span>
          <div className="text-sm text-gray-900">{cell}</div>
        </div>
      ))}
    </div>
  );

  const renderMobileCard = mobileCardRenderer || defaultMobileCard;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className={cn("w-full", tableClassName)}>
          <thead>
            <tr className={headerClassName}>
              {headers.map((header, index) => (
                <th key={index} className={cn("px-6 py-4 text-left text-sm font-medium", cellClassName)}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={cn("px-6 py-4 text-sm", cellClassName)}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {rows.map((row, index) => renderMobileCard(row, index))}
      </div>
    </div>
  );
}