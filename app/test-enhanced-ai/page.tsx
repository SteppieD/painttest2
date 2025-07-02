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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Enhanced AI Assistant Demo 
              <Badge variant="secondary">$10/1000 quotes</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Test advanced AI features: validation, recommendations, predictions, and smart corrections
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">AI Feature</label>
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
                <label className="text-sm font-medium">Contractor Input</label>
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter contractor language..."
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={runTest}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Enhanced AI'
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Quick Test Examples:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {testExamples.map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(example.input);
                      setScenario(example.scenario);
                    }}
                    className="text-left justify-start h-auto p-2"
                  >
                    <div>
                      <div className="font-medium text-xs">{example.input}</div>
                      <div className="text-xs text-gray-500">{example.issue || example.feature}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Response */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Enhanced AI Response
                  <Badge variant="outline" className="text-blue-600">GPT-4o mini</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    AI Response:
                  </h4>
                  <div className="mt-1 p-3 bg-blue-50 rounded">
                    <p className="text-sm">{results.result?.response}</p>
                  </div>
                </div>

                {/* Validation Results */}
                {results.result?.validation && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Smart Validation:
                    </h4>
                    <div className="mt-1 space-y-2">
                      {results.result.validation.concerns.length > 0 && (
                        <div className="p-2 bg-yellow-50 rounded">
                          <p className="text-xs font-medium text-yellow-800">Concerns:</p>
                          <ul className="text-xs text-yellow-700 list-disc list-inside">
                            {results.result.validation.concerns.map((concern: string, idx: number) => (
                              <li key={idx}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.result.validation.suggestions.length > 0 && (
                        <div className="p-2 bg-blue-50 rounded">
                          <p className="text-xs font-medium text-blue-800">Suggestions:</p>
                          <ul className="text-xs text-blue-700 list-disc list-inside">
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
                    <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-orange-500" />
                      Smart Recommendations:
                    </h4>
                    <div className="mt-1 p-3 bg-orange-50 rounded">
                      <ul className="text-xs text-orange-700 list-disc list-inside space-y-1">
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
                <CardTitle className="text-lg">Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Basic AI ($2.70/1000)</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>✅ Natural language understanding</li>
                        <li>✅ Basic parsing</li>
                        <li>✅ Conversational responses</li>
                        <li>❌ No validation</li>
                        <li>❌ No recommendations</li>
                        <li>❌ No error checking</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Enhanced AI ($10/1000)</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
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

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Features Demonstrated:</h4>
                    <div className="grid grid-cols-3 gap-2">
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
            <CardTitle className="text-lg">Cost vs Value Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium">Basic AI</h4>
                <p className="text-2xl font-bold text-green-600">$2.70</p>
                <p className="text-sm text-gray-600">per 1000 quotes</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Natural conversation</li>
                  <li>• Basic understanding</li>
                  <li>• Single AI call per message</li>
                </ul>
              </div>

              <div className="p-4 border rounded border-blue-500 bg-blue-50">
                <h4 className="font-medium text-blue-700">Enhanced AI</h4>
                <p className="text-2xl font-bold text-blue-600">$6-10</p>
                <p className="text-sm text-gray-600">per 1000 quotes</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Everything in Basic</li>
                  <li>• Smart validation</li>
                  <li>• Project recommendations</li>
                  <li>• Error detection</li>
                  <li>• 3-4 AI calls per interaction</li>
                </ul>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium">ROI Calculation</h4>
                <p className="text-sm text-gray-600 mb-2">Benefits of Enhanced AI:</p>
                <ul className="text-xs space-y-1">
                  <li>• 20% fewer quote errors</li>
                  <li>• 15% higher quote accuracy</li>
                  <li>• 10% more add-on suggestions</li>
                  <li>• Better customer satisfaction</li>
                </ul>
                <p className="text-xs mt-2 font-medium text-green-600">
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