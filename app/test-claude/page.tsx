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
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Claude 3.5 Haiku vs Current System Comparison</CardTitle>
            <p>
              See how Claude understands contractor language compared to our current parsing
            </p>
          </CardHeader>
          <CardContent>
            {!hasApiKey && (
              <div>
                <p>
                  <strong>OpenRouter API Key Required:</strong> Add OPENROUTER_API_KEY to your .env file
                </p>
                <p>
                  Get one at <a href="https://openrouter.ai" target="_blank">openrouter.ai</a>
                </p>
              </div>
            )}

            <div>
              <div>
                <label>Category</label>
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
                <label>Contractor Input</label>
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter contractor language..."
                />
              </div>

              <div>
                <Button 
                  onClick={runComparison}
                  disabled={loading}
                 
                >
                  {loading ? (
                    <>
                      <Loader2 />
                      Comparing...
                    </>
                  ) : (
                    'Compare Responses'
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Examples */}
            <div>
              <p>Quick Examples:</p>
              <div>
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
          <div>
            {/* Parsing Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Parsing Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4>Current Parser Output:</h4>
                  <pre>
                    {JSON.stringify(comparison.comparison?.parsing?.current || {}, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4>Claude 3.5 Haiku Output:</h4>
                  <pre>
                    {JSON.stringify(comparison.comparison?.parsing?.claude || 'API Key Required', null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Response Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Response Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4>Current Response:</h4>
                  <div>
                    <p>{comparison.comparison?.responses?.current}</p>
                  </div>
                </div>
                <div>
                  <h4>Claude 3.5 Haiku Response:</h4>
                  <div>
                    <p>
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
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div></div>
                  <div>
                    <p>Current System</p>
                    <p>
                      Template-based responses, rigid parsing patterns, sometimes misses context
                    </p>
                  </div>
                </div>
                <div>
                  <div></div>
                  <div>
                    <p>Claude 3.5 Haiku</p>
                    <p>
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