'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function TestClaudePage() {
  const [input, setInput] = useState('500 by 9');
  const [category, setCategory] = useState('walls');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  const testExamples = [
    { input: '500 by 9', category: 'walls', description: 'Natural wall dimensions' },
    { input: '9', category: 'walls', description: 'Just ceiling height' },
    { input: 'Just 3', category: 'doors', description: 'Casual door count' },
    { input: 'no windows', category: 'windows', description: 'Zero windows naturally' },
    { input: '1200 square feet', category: 'ceilings', description: 'Ceiling area' },
    { input: 'ceiling height is 9, 300 linear feet', category: 'walls', description: 'Mixed order' }
  ];

  const runComparison = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-claude-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          stage: 'category_measurement_collection',
          category,
          existingData: {}
        })
      });

      const data = await response.json();
      setComparison(data);
      
      // Check if we have an API key error
      if (data.comparison?.responses?.claude?.includes('API key not configured')) {
        setHasApiKey(false);
      }
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Claude 3.5 Haiku vs Current System Comparison</CardTitle>
            <p className="text-sm text-gray-600">
              See how Claude understands contractor language compared to our current parsing
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasApiKey && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>OpenRouter API Key Required:</strong> Add OPENROUTER_API_KEY to your .env file
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Get one at <a href="https://openrouter.ai" className="underline" target="_blank">openrouter.ai</a>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walls">Walls</SelectItem>
                    <SelectItem value="ceilings">Ceilings</SelectItem>
                    <SelectItem value="doors">Doors</SelectItem>
                    <SelectItem value="windows">Windows</SelectItem>
                    <SelectItem value="trim">Trim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Contractor Input</label>
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter contractor language..."
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={runComparison}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    'Compare Responses'
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Quick Examples:</p>
              <div className="flex flex-wrap gap-2">
                {testExamples.map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(example.input);
                      setCategory(example.category);
                    }}
                  >
                    {example.description}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparison && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parsing Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parsing Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Current Parser Output:</h4>
                  <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(comparison.comparison?.parsing?.current || {}, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Claude 3.5 Haiku Output:</h4>
                  <pre className="mt-1 p-3 bg-blue-50 rounded text-xs overflow-auto">
                    {JSON.stringify(comparison.comparison?.parsing?.claude || 'API Key Required', null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Response Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Current Response:</h4>
                  <div className="mt-1 p-3 bg-gray-100 rounded">
                    <p className="text-sm whitespace-pre-wrap">{comparison.comparison?.responses?.current}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Claude 3.5 Haiku Response:</h4>
                  <div className="mt-1 p-3 bg-blue-50 rounded">
                    <p className="text-sm whitespace-pre-wrap">
                      {comparison.comparison?.responses?.claude || 'Set OPENROUTER_API_KEY to see Claude responses'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis */}
        {comparison && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-sm">Current System</p>
                    <p className="text-sm text-gray-600">
                      Template-based responses, rigid parsing patterns, sometimes misses context
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-sm">Claude 3.5 Haiku</p>
                    <p className="text-sm text-gray-600">
                      Natural conversation flow, understands context and contractor language, adapts responses
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}