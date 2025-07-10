'use client'

import React from 'react'
import { InternalLinkedContent } from '@/components/seo/InternalLinkedContent'
import { addInternalLinks, suggestInternalLinks, extractKeywords } from '@/lib/seo/internal-linking-engine'

export const dynamic = 'force-dynamic'

export default function InternalLinkingDemo() {
  // Sample content for demonstration
  const sampleContent = `
    Looking for the best painting quote software to streamline your business? 
    Our interior painting calculator helps contractors create accurate estimates in seconds. 
    Whether you need a commercial painting calculator or cabinet painting calculator, 
    we have all the tools you need. Start your free trial today and see why thousands 
    of contractors trust our painting estimating software. Our mobile app makes it easy 
    to create quotes on the go, and our ROI calculator shows you exactly how much 
    time and money you'll save.
  `

  const shortContent = `
    Professional painting contractors need reliable painting quote software. 
    Try our free trial to see the difference.
  `

  // Get link suggestions for this page
  const suggestions = suggestInternalLinks(sampleContent, '/internal-linking-demo')
  const keywords = extractKeywords(sampleContent)

  // Process content with manual linking
  const linkedHtml = addInternalLinks(sampleContent, '/internal-linking-demo')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Internal Linking Engine Demo</h1>

      <div className="grid gap-8">
        {/* Component Demo */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Component Usage</h2>
          <p className="text-gray-600 mb-4">
            The InternalLinkedContent component automatically adds contextual links:
          </p>
          <div className="prose max-w-none">
            <InternalLinkedContent currentPath="/internal-linking-demo">
              {sampleContent}
            </InternalLinkedContent>
          </div>
        </section>

        {/* Short Content Example */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Short Content Example</h2>
          <p className="text-gray-600 mb-4">
            Even short content gets appropriate links:
          </p>
          <div className="prose max-w-none">
            <InternalLinkedContent currentPath="/internal-linking-demo">
              {shortContent}
            </InternalLinkedContent>
          </div>
        </section>

        {/* Manual HTML Processing */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Manual HTML Processing</h2>
          <p className="text-gray-600 mb-4">
            You can also process HTML strings directly:
          </p>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: linkedHtml }}
          />
        </section>

        {/* Link Suggestions */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Link Suggestions</h2>
          <p className="text-gray-600 mb-4">
            Keywords found and suggested links for this content:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Suggested Internal Links:</h3>
              <ul className="space-y-2">
                {suggestions.slice(0, 10).map((suggestion, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>
                      <strong>{suggestion.keyword}</strong> → {suggestion.url}
                    </span>
                    <span className="text-sm text-gray-500">
                      {suggestion.count} occurrence{suggestion.count > 1 ? 's' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Extracted Keywords */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Extracted Keywords</h2>
          <p className="text-gray-600 mb-4">
            Common phrases extracted from the content:
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">1. In React Components:</h3>
              <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`import { InternalLinkedContent } from '@/components/seo/InternalLinkedContent'

<InternalLinkedContent currentPath="/your-page">
  Your content with painting quote software and other keywords...
</InternalLinkedContent>`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">2. In HTML/Markdown:</h3>
              <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`import { addInternalLinks } from '@/lib/seo/internal-linking-engine'

const linkedContent = addInternalLinks(
  yourContent, 
  currentPath,
  { maxLinksPerPage: 5 } // optional rules
)`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">3. Get Link Suggestions:</h3>
              <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`import { suggestInternalLinks } from '@/lib/seo/internal-linking-engine'

const suggestions = suggestInternalLinks(content, currentPath)
// Returns array of { keyword, url, count }`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}