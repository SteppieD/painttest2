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
    <div>
      <div>
        <h1>
          <Brain />
          Intelligent Quote Parser Demo
        </h1>
        <p>
          Advanced multi-LLM system for extracting structured quote data from natural language input
        </p>
      </div>

      <div>
        {/* Input Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Natural Language Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter painting project details in natural language..."
               
              />
              
              <Button 
                onClick={handleParse} 
                disabled={!input.trim() || loading}
               
              >
                {loading ? (
                  <>
                    <Loader2 />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Brain />
                    Parse Quote
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TestTube />
                Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Button 
                  onClick={loadTestCases} 
                  variant="outline" 
                  size="sm"
                 
                >
                  Load Test Cases
                </Button>
                
                {testCases.map((testCase, index) => (
                  <div key={index}>
                    <div>
                      Test Case {index + 1}
                    </div>
                    <div>
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
              <div>
                <div>
                  <span></span>
                  <span><strong>Primary Parser:</strong> Claude 3.5 Sonnet (high accuracy)</span>
                </div>
                <div>
                  <span></span>
                  <span><strong>Validator:</strong> GPT-4o (consistency checking)</span>
                </div>
                <div>
                  <span></span>
                  <span><strong>Calculator:</strong> Modular quote engine</span>
                </div>
                <div>
                  <span></span>
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
              <CardContent>
                <Brain />
                <p>
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