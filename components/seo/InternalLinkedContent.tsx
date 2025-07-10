'use client'

import React from 'react'
import { InternalLinkedContent as BaseInternalLinkedContent } from '@/lib/seo/internal-linking-engine'

interface InternalLinkedContentProps {
  children: string
  currentPath?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  maxLinks?: number
}

/**
 * Wrapper component that exports the internal linking functionality
 * This makes it easy to use throughout the application
 */
export function InternalLinkedContent({
  children,
  currentPath,
  className,
  as = 'div',
  maxLinks
}: InternalLinkedContentProps) {
  return (
    <BaseInternalLinkedContent
      currentPath={currentPath}
      className={className}
      as={as}
    >
      {children}
    </BaseInternalLinkedContent>
  )
}

// Export a hook for programmatic usage
export { useInternalLinks } from '@/lib/seo/internal-linking-engine'