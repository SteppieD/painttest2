"use client";

import React from 'react';
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
    <div key={index}>
      {row.map((cell, cellIndex) => (
        <div key={cellIndex}>
          <span>{headers[cellIndex]}:</span>
          <div>{cell}</div>
        </div>
      ))}
    </div>
  );

  const renderMobileCard = mobileCardRenderer || defaultMobileCard;

  return (
    <div>
      {/* Desktop Table View */}
      <div>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div>
        {rows.map((row, index) => renderMobileCard(row, index))}
      </div>
    </div>
  );
}