'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <>
      <SchemaMarkup 
        type="BreadcrumbList" 
        data={{ items }} 
      />
      
      <nav 
        aria-label="Breadcrumb" 
        className={`py-4 ${className}`}
      >
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
              {item.url && index < items.length - 1 ? (
                <Link 
                  href={item.url} 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span 
                  className={index === items.length - 1 ? "text-gray-700 font-medium" : "text-gray-500"}
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}