"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ParsedQuoteConfirmation } from '@/components/ui/parsed-quote-confirmation';
import { Brain, Loader2, TestTube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function QuoteParserDemo() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testCases, setTestCases] = useState<any[]>([]);
  const { toast } = useToast();

  const handleParse = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/quote-parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        toast({
          title: "Parsing Complete",
          description: `Extracted data with ${data.confidence_score}% confidence`,
        });
      } else {
        toast({
          title: "Parsing Failed",
          description: data.error || 'Unknown error',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse input",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTestCases = async () => {
    try {
      const response = await fetch('/api/quote-parser');
      const data = await response.json();
      setTestCases(data.test_cases || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test cases",
        variant: "destructive"
      });
    }
  };

  const runTestCase = (testInput: string) => {
    setInput(testInput);
    setResult(null);
  };

  const handleFieldUpdate = (field: string, value: any) => {
    if (result) {
      setResult({
        ...result,
        parsed_data: {
          ...result.parsed_data,
          [field]: value
        }
      });
      
      toast({
        title: "Field Updated",
        description: `${field} has been updated`,
      });
    }
  };

  const handleConfirm = () => {
    toast({
      title: "Quote Confirmed",
      description: "Quote has been generated and saved",
    });
    // Integration point for saving to database
  };

  const handleRequestClarification = (questions: string[]) => {
    toast({
      title: "Clarification Needed",
      description: `${questions.length} questions require answers`,
    });
    // Integration point for clarification workflow
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-blue-600" />
          Intelligent Quote Parser Demo
        </h1>
        <p className="text-gray-600">
          Advanced multi-LLM system for extracting structured quote data from natural language input
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Natural Language Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter painting project details in natural language..."
                className="min-h-32"
              />
              
              <Button 
                onClick={handleParse} 
                disabled={!input.trim() || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Parse Quote
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={loadTestCases} 
                  variant="outline" 
                  size="sm"
                  className="mb-4"
                >
                  Load Test Cases
                </Button>
                
                {testCases.map((testCase, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">
                      Test Case {index + 1}
                    </div>
                    <div className="text-sm mb-2 line-clamp-3">
                      {testCase.input}
                    </div>
                    <Button 
                      onClick={() => runTestCase(testCase.input)}
                      size="sm"
                      variant="outline"
                    >
                      Use This Input
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Architecture Info */}
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span><strong>Primary Parser:</strong> Claude 3.5 Sonnet (high accuracy)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span><strong>Validator:</strong> GPT-4o (consistency checking)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span><strong>Calculator:</strong> Modular quote engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>Routing:</strong> OpenRouter for optimal model selection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <ParsedQuoteConfirmation
              parsedData={result.parsed_data}
              canCalculate={result.can_calculate}
              quoteCalculation={result.quote_calculation}
              onFieldUpdate={handleFieldUpdate}
              onConfirm={handleConfirm}
              onRequestClarification={handleRequestClarification}
              clarificationQuestions={result.clarification_questions || []}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter project details and click "Parse Quote" to see intelligent extraction results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}