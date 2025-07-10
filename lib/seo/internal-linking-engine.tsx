/**
 * Internal Linking Engine
 * Automatically adds contextual internal links to content
 */

import React from 'react'

// Define internal link mappings with keywords and their target URLs
export const internalLinks = {
  // Product/Software Links
  'painting quote software': '/painting-quote-software',
  'painting estimating software': '/painting-estimating-software',
  'painting business software': '/painting-business-software',
  'professional painting software': '/professional-painting-software',
  'commercial painting software': '/commercial-painting-estimating-software',
  'painting contractor software': '/painting-estimating-software-contractors',
  'painting estimate software': '/painting-estimate-software',
  
  // Calculator Links
  'painting calculator': '/calculators',
  'painting calculators': '/calculators',
  'interior painting calculator': '/calculators/interior-painting',
  'exterior painting calculator': '/calculators/exterior-painting',
  'commercial painting calculator': '/calculators/commercial-painting',
  'cabinet painting calculator': '/calculators/cabinet-painting',
  'paint calculator': '/calculators',
  'painting cost calculator': '/calculators',
  'painting estimate calculator': '/painting-estimate-calculator-free',
  
  // Feature Links
  'AI painting quotes': '/features#ai-powered',
  'digital quote acceptance': '/features#digital-acceptance',
  'professional PDF quotes': '/features#pdf-quotes',
  '30-second quotes': '/features#express-quotes',
  'express quotes': '/features#express-quotes',
  
  // Educational Content
  'how to quote painting jobs': '/how-to-quote-painting-jobs-professionally',
  'quoting painting jobs': '/how-to-quote-painting-jobs-professionally',
  'painting quote templates': '/painting-quote-templates-free',
  'quote templates': '/painting-quote-templates-free',
  'painting business tips': '/painting-business-tips',
  'scale painting business': '/how-to-scale-painting-business',
  
  // Case Studies
  'case studies': '/case-studies',
  'success stories': '/painting-contractor-software-case-study',
  'ROI calculator': '/roi-calculator',
  'painting business growth': '/small-painting-business-growth-software',
  
  // Trial/Demo
  'free trial': '/trial-signup',
  'start free trial': '/trial-signup',
  '14-day trial': '/trial-signup',
  'watch demo': '/demo',
  'see demo': '/demo',
  'demo': '/demo',
  
  // Pricing
  'pricing': '/pricing',
  'pricing plans': '/pricing',
  'enterprise': '/enterprise',
  
  // Mobile
  'mobile app': '/mobile-app',
  'painting app': '/mobile-painting-estimate-app',
  'contractor app': '/painting-contractor-app',
}

// Define linking rules and priorities
interface LinkingRule {
  maxLinksPerPage: number
  maxLinksPerKeyword: number
  minWordsBetweenLinks: number
  priorityKeywords: string[]
  excludePatterns: RegExp[]
}

const defaultRules: LinkingRule = {
  maxLinksPerPage: 10,
  maxLinksPerKeyword: 2,
  minWordsBetweenLinks: 50,
  priorityKeywords: [
    'painting quote software',
    'painting calculator',
    'free trial',
    'interior painting calculator',
    'exterior painting calculator'
  ],
  excludePatterns: [
    /^https?:\/\//i, // Already has external links
    /<a\s+[^>]*>.*?<\/a>/gi, // Already has anchor tags
    /\[.*?\]\(.*?\)/g, // Markdown links
  ]
}

/**
 * Add internal links to content
 * @param content - The HTML or text content to add links to
 * @param currentPath - The current page path (to avoid self-links)
 * @param rules - Optional custom linking rules
 * @returns Content with internal links added
 */
export function addInternalLinks(
  content: string,
  currentPath: string,
  rules: Partial<LinkingRule> = {}
): string {
  const linkingRules = { ...defaultRules, ...rules }
  let linkedContent = content
  let totalLinksAdded = 0
  const keywordUsage: Record<string, number> = {}
  
  // Sort keywords by length (longest first) to avoid partial matches
  const sortedKeywords = Object.keys(internalLinks).sort((a, b) => b.length - a.length)
  
  // Priority keywords get linked first
  const orderedKeywords = [
    ...linkingRules.priorityKeywords.filter(k => sortedKeywords.includes(k)),
    ...sortedKeywords.filter(k => !linkingRules.priorityKeywords.includes(k))
  ]
  
  for (const keyword of orderedKeywords) {
    if (totalLinksAdded >= linkingRules.maxLinksPerPage) break
    
    const targetUrl = internalLinks[keyword as keyof typeof internalLinks]
    
    // Skip if linking to current page
    if (targetUrl === currentPath) continue
    
    // Skip if keyword already used max times
    if ((keywordUsage[keyword] || 0) >= linkingRules.maxLinksPerKeyword) continue
    
    // Create case-insensitive regex for the keyword
    const keywordRegex = new RegExp(`\\b(${escapeRegex(keyword)})\\b`, 'gi')
    
    // Find all matches
    const matches = Array.from(linkedContent.matchAll(keywordRegex))
    
    // Process matches (up to max per keyword)
    let keywordLinksAdded = 0
    for (const match of matches) {
      if (keywordLinksAdded >= linkingRules.maxLinksPerKeyword) break
      if (totalLinksAdded >= linkingRules.maxLinksPerPage) break
      
      const matchIndex = match.index!
      const matchedText = match[0]
      
      // Check if match is within an excluded pattern
      let isExcluded = false
      for (const pattern of linkingRules.excludePatterns) {
        const excludeMatches = Array.from(content.matchAll(pattern))
        for (const excludeMatch of excludeMatches) {
          const excludeStart = excludeMatch.index!
          const excludeEnd = excludeStart + excludeMatch[0].length
          if (matchIndex >= excludeStart && matchIndex <= excludeEnd) {
            isExcluded = true
            break
          }
        }
        if (isExcluded) break
      }
      
      if (isExcluded) continue
      
      // Check minimum word distance from previous links
      const beforeText = linkedContent.substring(0, matchIndex)
      const lastLinkIndex = beforeText.lastIndexOf('</a>')
      if (lastLinkIndex !== -1) {
        const textBetween = beforeText.substring(lastLinkIndex)
        const wordCount = textBetween.split(/\s+/).length
        if (wordCount < linkingRules.minWordsBetweenLinks) continue
      }
      
      // Add the link
      const linkHtml = `<a href="${targetUrl}" class="text-blue-600 hover:text-blue-800 underline">${matchedText}</a>`
      linkedContent = linkedContent.substring(0, matchIndex) + 
                      linkHtml + 
                      linkedContent.substring(matchIndex + matchedText.length)
      
      keywordLinksAdded++
      totalLinksAdded++
      keywordUsage[keyword] = (keywordUsage[keyword] || 0) + 1
    }
  }
  
  return linkedContent
}

/**
 * Add internal links to React content (returns JSX)
 * @param content - The text content to add links to
 * @param currentPath - The current page path
 * @param className - Optional CSS class for links
 */
export function addInternalLinksReact(
  content: string,
  currentPath: string,
  className: string = 'text-blue-600 hover:text-blue-800 underline'
): React.ReactNode[] {
  const linkedContent = addInternalLinks(content, currentPath)
  
  // Parse the HTML string into React elements
  const parts = linkedContent.split(/(<a\s+[^>]*>.*?<\/a>)/gi)
  
  return parts.map((part, index) => {
    if (part.match(/<a\s+[^>]*>.*?<\/a>/i)) {
      // Extract href and text from anchor tag
      const hrefMatch = part.match(/href="([^"]+)"/)
      const textMatch = part.match(/>([^<]+)</)
      
      if (hrefMatch && textMatch) {
        const href = hrefMatch[1]
        const text = textMatch[1]
        
        return (
          <a key={index} href={href} className={className}>
            {text}
          </a>
        )
      }
    }
    
    return <span key={index}>{part}</span>
  })
}

/**
 * Component wrapper for automatic internal linking
 */
interface InternalLinkedContentProps {
  children: string
  currentPath?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function InternalLinkedContent({
  children,
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/',
  className,
  as: Component = 'div'
}: InternalLinkedContentProps) {
  const linkedContent = addInternalLinksReact(children, currentPath)
  
  return <Component className={className}>{linkedContent}</Component>
}

// Helper function to escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Export types for external use
export type { LinkingRule }

// Utility function to extract keywords from content for SEO analysis
export function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().split(/\s+/)
  const keywordCounts: Record<string, number> = {}
  
  // Count occurrences of potential keywords (2-4 word phrases)
  for (let i = 0; i < words.length; i++) {
    for (let j = 2; j <= 4 && i + j <= words.length; j++) {
      const phrase = words.slice(i, i + j).join(' ')
      if (phrase.length > 10) { // Minimum phrase length
        keywordCounts[phrase] = (keywordCounts[phrase] || 0) + 1
      }
    }
  }
  
  // Sort by frequency and return top keywords
  return Object.entries(keywordCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword]) => keyword)
}

// Utility function to suggest internal links for a page
export function suggestInternalLinks(
  content: string,
  currentPath: string
): Array<{ keyword: string; url: string; count: number }> {
  const suggestions: Array<{ keyword: string; url: string; count: number }> = []
  
  for (const [keyword, url] of Object.entries(internalLinks)) {
    if (url === currentPath) continue
    
    const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi')
    const matches = content.match(regex)
    
    if (matches && matches.length > 0) {
      suggestions.push({
        keyword,
        url,
        count: matches.length
      })
    }
  }
  
  return suggestions.sort((a, b) => b.count - a.count)
}

// React Hook for easy usage
import { useMemo } from 'react'

export function useInternalLinks(content: string, currentPath?: string) {
  const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
  
  const linkedContent = useMemo(() => {
    return addInternalLinks(content, path)
  }, [content, path])
  
  const suggestions = useMemo(() => {
    return suggestInternalLinks(content, path)
  }, [content, path])
  
  const keywords = useMemo(() => {
    return extractKeywords(content)
  }, [content])
  
  return {
    linkedContent,
    suggestions,
    keywords
  }
}