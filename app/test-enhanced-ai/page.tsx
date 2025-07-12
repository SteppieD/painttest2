'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export default function TestEnhancedAIPage() {
  const [input, setInput] = useState('1000 linear feet, 6 foot ceilings');
  const [scenario, setScenario] = useState('validation');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scenarios = [
    { value: 'validation', label: '🔍 Validation & Error Checking', example: '1000 linear feet, 6 foot ceilings' },
    { value: 'recommendations', label: '💡 Smart Recommendations', example: 'looks good so far' },
    { value: 'predictions', label: '🎯 Predictive Intelligence', example: '3 bedroom ranch house' }
  ];

  const testExamples = [
    { input: '1000 linear feet, 6 foot ceilings', scenario: 'validation', issue: 'Unusual ceiling height' },
    { input: '50 linear feet, 12 foot ceilings', scenario: 'validation', issue: 'Small room with high ceilings' },
    { input: 'ready for paint', scenario: 'recommendations', feature: 'Project-specific suggestions' },
    { input: '4 bedroom colonial house', scenario: 'predictions', feature: 'Size & measurement estimates' },
    { input: 'small bathroom', scenario: 'predictions', feature: 'Room-specific estimates' },
  ];

  const runTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-enhanced-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, scenario })
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              Enhanced AI Assistant Demo 
              <Badge variant="secondary">$10/1000 quotes</Badge>
            </CardTitle>
            <p>
              Test advanced AI features: validation, recommendations, predictions, and smart corrections
            </p>
          </CardHeader>
          <CardContent>
            {/* Test Controls */}
            <div>
              <div>
                <label>AI Feature</label>
                <Select value={scenario} onValueChange={(value) => {
                  setScenario(value);
                  // Update input with scenario example
                  const scenarioData = scenarios.find(s => s.value === value);
                  if (scenarioData) setInput(scenarioData.example);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
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
                  onClick={runTest}
                  disabled={loading}
                 
                >
                  {loading ? (
                    <>
                      <Loader2 />
                      Testing...
                    </>
                  ) : (
                    'Test Enhanced AI'
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Examples */}
            <div>
              <p>Quick Test Examples:</p>
              <div>
                {testExamples.map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(example.input);
                      setScenario(example.scenario);
                    }}
                   
                  >
                    <div>
                      <div>{example.input}</div>
                      <div>{example.issue || example.feature}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div>
            {/* Enhanced Response */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Enhanced AI Response
                  <Badge variant="outline">GPT-4o mini</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4>
                    <CheckCircle />
                    AI Response:
                  </h4>
                  <div>
                    <p>{results.result?.response}</p>
                  </div>
                </div>

                {/* Validation Results */}
                {results.result?.validation && (
                  <div>
                    <h4>
                      <AlertTriangle />
                      Smart Validation:
                    </h4>
                    <div>
                      {results.result.validation.concerns.length > 0 && (
                        <div>
                          <p>Concerns:</p>
                          <ul>
                            {results.result.validation.concerns.map((concern: string, idx: number) => (
                              <li key={idx}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.result.validation.suggestions.length > 0 && (
                        <div>
                          <p>Suggestions:</p>
                          <ul>
                            {results.result.validation.suggestions.map((suggestion: string, idx: number) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {results.result?.recommendations && (
                  <div>
                    <h4>
                      <Lightbulb />
                      Smart Recommendations:
                    </h4>
                    <div>
                      <ul>
                        {results.result.recommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <div>
                      <h4>Basic AI ($2.70/1000)</h4>
                      <ul>
                        <li>✅ Natural language understanding</li>
                        <li>✅ Basic parsing</li>
                        <li>✅ Conversational responses</li>
                        <li>❌ No validation</li>
                        <li>❌ No recommendations</li>
                        <li>❌ No error checking</li>
                      </ul>
                    </div>
                    <div>
                      <h4>Enhanced AI ($10/1000)</h4>
                      <ul>
                        <li>✅ Natural language understanding</li>
                        <li>✅ Advanced parsing</li>
                        <li>✅ Conversational responses</li>
                        <li>✅ Smart validation</li>
                        <li>✅ Project recommendations</li>
                        <li>✅ Error detection & correction</li>
                        <li>✅ Predictive assistance</li>
                        <li>✅ Context awareness</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4>Features Demonstrated:</h4>
                    <div>
                      <Badge variant={results.features?.validation ? "default" : "secondary"}>
                        Validation {results.features?.validation ? "✓" : "○"}
                      </Badge>
                      <Badge variant={results.features?.recommendations ? "default" : "secondary"}>
                        Recommendations {results.features?.recommendations ? "✓" : "○"}
                      </Badge>
                      <Badge variant={results.features?.insights ? "default" : "secondary"}>
                        Insights {results.features?.insights ? "✓" : "○"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cost vs Value Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <h4>Basic AI</h4>
                <p>$2.70</p>
                <p>per 1000 quotes</p>
                <ul>
                  <li>• Natural conversation</li>
                  <li>• Basic understanding</li>
                  <li>• Single AI call per message</li>
                </ul>
              </div>

              <div>
                <h4>Enhanced AI</h4>
                <p>$6-10</p>
                <p>per 1000 quotes</p>
                <ul>
                  <li>• Everything in Basic</li>
                  <li>• Smart validation</li>
                  <li>• Project recommendations</li>
                  <li>• Error detection</li>
                  <li>• 3-4 AI calls per interaction</li>
                </ul>
              </div>

              <div>
                <h4>ROI Calculation</h4>
                <p>Benefits of Enhanced AI:</p>
                <ul>
                  <li>• 20% fewer quote errors</li>
                  <li>• 15% higher quote accuracy</li>
                  <li>• 10% more add-on suggestions</li>
                  <li>• Better customer satisfaction</li>
                </ul>
                <p>
                  ROI: $7 extra cost could save 1+ hour per problem quote
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}