/**
 * Unified Quote Creator Component
 * 
 * Single component that handles all quote creation methods:
 * - Manual form-based creation
 * - AI-assisted conversational creation  
 * - Quick quote creation
 * - Import from existing data
 */

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calculator, MessageSquare, Zap, Upload } from 'lucide-react';
import { 
  UnifiedQuoteData, 
  CreateQuoteRequest,
  QuoteOperationResponse 
} from '@/lib/unified-quote-types';

interface UnifiedQuoteCreatorProps {
  companyId: string;
  onQuoteCreated?: (quote: UnifiedQuoteData) => void;
  onCancel?: () => void;
  defaultMode?: 'manual' | 'ai' | 'quick' | 'import';
}

export function UnifiedQuoteCreator({
  companyId,
  onQuoteCreated,
  onCancel,
  defaultMode = 'manual'
}: UnifiedQuoteCreatorProps) {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState(defaultMode);
  const [isCreating, setIsCreating] = useState(false);

  // Manual form state
  const [manualForm, setManualForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    projectType: 'interior' as 'interior' | 'exterior' | 'both',
    wallsSquareFootage: '',
    ceilingsSquareFootage: '',
    trimSquareFootage: '',
    paintQuality: 'better' as 'good' | 'better' | 'best' | 'premium',
    specialRequests: '',
    timeline: ''
  });

  // AI conversation state
  const [aiSession, setAiSession] = useState({
    sessionId: '',
    messages: [] as Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>,
    currentMessage: '',
    provider: 'gemini' as 'claude' | 'gpt4' | 'gemini',
    isProcessing: false,
    partialQuote: null as any
  });

  // Quick quote state
  const [quickForm, setQuickForm] = useState({
    customerName: '',
    totalSqft: '',
    projectType: 'interior' as 'interior' | 'exterior' | 'both',
    paintQuality: 'better' as 'good' | 'better' | 'best' | 'premium'
  });

  // Initialize AI session
  useEffect(() => {
    if (activeMode === 'ai' && !aiSession.sessionId) {
      setAiSession(prev => ({
        ...prev,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    }
  }, [activeMode]);

  /**
   * Create quote using manual form
   */
  const createManualQuote = async () => {
    if (!manualForm.customerName || !manualForm.wallsSquareFootage) {
      toast({
        title: "Missing Information",
        description: "Please provide customer name and wall measurements.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const request: CreateQuoteRequest = {
        companyId: parseInt(companyId),
        customerName: manualForm.customerName,
        customerEmail: manualForm.customerEmail || undefined,
        customerPhone: manualForm.customerPhone || undefined,
        address: manualForm.address || undefined,
        projectType: manualForm.projectType,
        wallsSquareFootage: parseFloat(manualForm.wallsSquareFootage),
        ceilingsSquareFootage: parseFloat(manualForm.ceilingsSquareFootage) || 0,
        trimSquareFootage: parseFloat(manualForm.trimSquareFootage) || 0,
        paintQuality: manualForm.paintQuality,
        specialRequests: manualForm.specialRequests || undefined,
        timeline: manualForm.timeline || undefined,
        creationMethod: 'wizard'
      };

      const response = await fetch('/api/unified-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result: QuoteOperationResponse = await response.json();

      if (result.success && result.data) {
        toast({
          title: "Quote Created",
          description: `Quote ${result.data.metadata.quoteId} created successfully!`
        });
        onQuoteCreated?.(result.data);
      } else {
        throw new Error(result.error || 'Failed to create quote');
      }

    } catch (error) {
      console.error('Manual quote creation error:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : 'Failed to create quote',
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Create quote using quick estimation
   */
  const createQuickQuote = async () => {
    if (!quickForm.customerName || !quickForm.totalSqft) {
      toast({
        title: "Missing Information", 
        description: "Please provide customer name and total square footage.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Estimate individual measurements from total square footage
      const totalSqft = parseFloat(quickForm.totalSqft);
      const wallsEstimate = Math.round(totalSqft * 2.5); // 2.5x floor space for walls
      const ceilingsEstimate = quickForm.projectType === 'interior' ? totalSqft : 0;
      const trimEstimate = Math.round(totalSqft * 0.5); // 0.5x floor space for trim

      const request: CreateQuoteRequest = {
        companyId: parseInt(companyId),
        customerName: quickForm.customerName,
        projectType: quickForm.projectType,
        wallsSquareFootage: wallsEstimate,
        ceilingsSquareFootage: ceilingsEstimate,
        trimSquareFootage: trimEstimate,
        paintQuality: quickForm.paintQuality,
        creationMethod: 'quick'
      };

      const response = await fetch('/api/unified-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result: QuoteOperationResponse = await response.json();

      if (result.success && result.data) {
        toast({
          title: "Quick Quote Created",
          description: `Quote ${result.data.metadata.quoteId} created with estimated measurements!`
        });
        onQuoteCreated?.(result.data);
      } else {
        throw new Error(result.error || 'Failed to create quick quote');
      }

    } catch (error) {
      console.error('Quick quote creation error:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : 'Failed to create quick quote',
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Send message to AI for quote processing
   */
  const sendAIMessage = async () => {
    if (!aiSession.currentMessage.trim()) return;

    const userMessage = aiSession.currentMessage.trim();
    setAiSession(prev => ({
      ...prev,
      currentMessage: '',
      isProcessing: true,
      messages: [...prev.messages, {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      }]
    }));

    try {
      const response = await fetch('/api/unified-quotes?action=ai-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: aiSession.sessionId,
          provider: aiSession.provider,
          companyId: parseInt(companyId)
        })
      });

      const result = await response.json();

      setAiSession(prev => ({
        ...prev,
        isProcessing: false,
        messages: [...prev.messages, {
          role: 'assistant',
          content: result.response || 'I need more information to help you.',
          timestamp: new Date().toISOString()
        }],
        partialQuote: result.partialQuote
      }));

      // If AI completed the quote, handle it
      if (result.savedQuote) {
        toast({
          title: "Quote Completed!",
          description: `AI successfully created quote ${result.savedQuote.metadata.quoteId}`
        });
        onQuoteCreated?.(result.savedQuote);
      }

    } catch (error) {
      console.error('AI processing error:', error);
      setAiSession(prev => ({
        ...prev,
        isProcessing: false,
        messages: [...prev.messages, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        }]
      }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Manual
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Quote
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </TabsTrigger>
            </TabsList>

            {/* Manual Form Mode */}
            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={manualForm.customerName}
                    onChange={(e) => setManualForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={manualForm.customerEmail}
                    onChange={(e) => setManualForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={manualForm.customerPhone}
                    onChange={(e) => setManualForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={manualForm.projectType} onValueChange={(value) => setManualForm(prev => ({ ...prev, projectType: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  value={manualForm.address}
                  onChange={(e) => setManualForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="wallsSquareFootage">Walls (sq ft) *</Label>
                  <Input
                    id="wallsSquareFootage"
                    type="number"
                    value={manualForm.wallsSquareFootage}
                    onChange={(e) => setManualForm(prev => ({ ...prev, wallsSquareFootage: e.target.value }))}
                    placeholder="1200"
                  />
                </div>
                <div>
                  <Label htmlFor="ceilingsSquareFootage">Ceilings (sq ft)</Label>
                  <Input
                    id="ceilingsSquareFootage"
                    type="number"
                    value={manualForm.ceilingsSquareFootage}
                    onChange={(e) => setManualForm(prev => ({ ...prev, ceilingsSquareFootage: e.target.value }))}
                    placeholder="400"
                  />
                </div>
                <div>
                  <Label htmlFor="trimSquareFootage">Trim (sq ft)</Label>
                  <Input
                    id="trimSquareFootage"
                    type="number"
                    value={manualForm.trimSquareFootage}
                    onChange={(e) => setManualForm(prev => ({ ...prev, trimSquareFootage: e.target.value }))}
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paintQuality">Paint Quality</Label>
                <Select value={manualForm.paintQuality} onValueChange={(value) => setManualForm(prev => ({ ...prev, paintQuality: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="better">Better</SelectItem>
                    <SelectItem value="best">Best</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={manualForm.specialRequests}
                  onChange={(e) => setManualForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={manualForm.timeline}
                  onChange={(e) => setManualForm(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="2 weeks"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={createManualQuote} disabled={isCreating}>
                  {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Quote
                </Button>
                {onCancel && (
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* AI Assistant Mode */}
            <TabsContent value="ai" className="space-y-4">
              <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">
                {aiSession.messages.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    Hi! I'm here to help you create a quote. What project details can you tell me about?
                  </p>
                ) : (
                  <div className="space-y-3">
                    {aiSession.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-blue-100 ml-8' 
                            : 'bg-white mr-8'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                    {aiSession.isProcessing && (
                      <div className="bg-white mr-8 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={aiSession.currentMessage}
                  onChange={(e) => setAiSession(prev => ({ ...prev, currentMessage: e.target.value }))}
                  placeholder="Tell me about your painting project..."
                  onKeyPress={(e) => e.key === 'Enter' && !aiSession.isProcessing && sendAIMessage()}
                  disabled={aiSession.isProcessing}
                />
                <Button 
                  onClick={sendAIMessage} 
                  disabled={aiSession.isProcessing || !aiSession.currentMessage.trim()}
                >
                  Send
                </Button>
              </div>

              <div className="flex gap-2">
                <Label htmlFor="aiProvider">AI Provider:</Label>
                <Select value={aiSession.provider} onValueChange={(value) => setAiSession(prev => ({ ...prev, provider: value as any }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gpt4">GPT-4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Quick Quote Mode */}
            <TabsContent value="quick" className="space-y-4">
              <p className="text-sm text-gray-600">
                Create a quick estimate using total square footage. Perfect for ballpark quotes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quickCustomerName">Customer Name *</Label>
                  <Input
                    id="quickCustomerName"
                    value={quickForm.customerName}
                    onChange={(e) => setQuickForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="quickTotalSqft">Total Square Footage *</Label>
                  <Input
                    id="quickTotalSqft"
                    type="number"
                    value={quickForm.totalSqft}
                    onChange={(e) => setQuickForm(prev => ({ ...prev, totalSqft: e.target.value }))}
                    placeholder="1500"
                  />
                </div>
                <div>
                  <Label htmlFor="quickProjectType">Project Type</Label>
                  <Select value={quickForm.projectType} onValueChange={(value) => setQuickForm(prev => ({ ...prev, projectType: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quickPaintQuality">Paint Quality</Label>
                  <Select value={quickForm.paintQuality} onValueChange={(value) => setQuickForm(prev => ({ ...prev, paintQuality: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="better">Better</SelectItem>
                      <SelectItem value="best">Best</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Estimation:</strong> We'll automatically calculate walls, ceilings, and trim based on your total square footage using industry standards.
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={createQuickQuote} disabled={isCreating}>
                  {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Quick Quote
                </Button>
                {onCancel && (
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Import Mode */}
            <TabsContent value="import" className="space-y-4">
              <p className="text-gray-600">Import functionality coming soon. You can:</p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Import from CSV files</li>
                <li>Import from existing estimates</li>
                <li>Bulk import multiple quotes</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}