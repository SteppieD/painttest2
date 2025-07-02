/**
 * Unified Quote Interface
 * 
 * Consolidates all quote creation flows into a single, optimized interface
 */

'use client';

import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, MessageSquare, ClipboardList, Sparkles, CheckCircle2 } from 'lucide-react';
import { QuoteWizard } from './quote-wizard';
import { IntelligentChatInterface } from './intelligent-chat-interface';
import { ErrorBoundary } from './error-boundary';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useToast } from '@/hooks/use-toast';

export type QuoteCreationMode = 'guided' | 'chat' | 'wizard';

export interface UnifiedQuoteState {
  mode: QuoteCreationMode;
  step: number;
  isLoading: boolean;
  error: string | null;
  progress: number;
  quoteData: any;
  hasUnsavedChanges: boolean;
}

type UnifiedQuoteAction = 
  | { type: 'SET_MODE'; payload: QuoteCreationMode }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'UPDATE_QUOTE_DATA'; payload: any }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_UNSAVED' }
  | { type: 'RESET' };

const initialState: UnifiedQuoteState = {
  mode: 'guided',
  step: 0,
  isLoading: false,
  error: null,
  progress: 0,
  quoteData: null,
  hasUnsavedChanges: false
};

function quoteReducer(state: UnifiedQuoteState, action: UnifiedQuoteAction): UnifiedQuoteState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, step: 0, progress: 0 };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'UPDATE_QUOTE_DATA':
      return { 
        ...state, 
        quoteData: { ...state.quoteData, ...action.payload },
        hasUnsavedChanges: true
      };
    case 'MARK_SAVED':
      return { ...state, hasUnsavedChanges: false };
    case 'MARK_UNSAVED':
      return { ...state, hasUnsavedChanges: true };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export interface UnifiedQuoteInterfaceProps {
  initialMode?: QuoteCreationMode;
  onQuoteCreated?: (quote: any) => void;
  onCancel?: () => void;
}

export function UnifiedQuoteInterface({
  initialMode = 'guided',
  onQuoteCreated,
  onCancel
}: UnifiedQuoteInterfaceProps) {
  const [state, dispatch] = useReducer(quoteReducer, {
    ...initialState,
    mode: initialMode
  });

  const { auth } = useAuthContext();
  const { toast } = useToast();
  const [showModeSelector, setShowModeSelector] = useState(true);

  // Auto-save functionality
  useEffect(() => {
    if (state.hasUnsavedChanges && state.quoteData) {
      const saveTimer = setTimeout(() => {
        // Auto-save to localStorage
        localStorage.setItem('quote-draft', JSON.stringify({
          ...state.quoteData,
          mode: state.mode,
          step: state.step,
          timestamp: Date.now()
        }));
        dispatch({ type: 'MARK_SAVED' });
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [state.hasUnsavedChanges, state.quoteData, state.mode, state.step]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('quote-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        // Only load if draft is less than 24 hours old
        if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) {
          dispatch({ type: 'UPDATE_QUOTE_DATA', payload: draftData });
          dispatch({ type: 'SET_MODE', payload: draftData.mode || 'guided' });
          dispatch({ type: 'SET_STEP', payload: draftData.step || 0 });
          setShowModeSelector(false);
          toast({
            title: 'Draft Loaded',
            description: 'Your previous quote draft has been restored.'
          });
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [toast]);

  const handleModeSelect = useCallback((mode: QuoteCreationMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
    setShowModeSelector(false);
    dispatch({ type: 'SET_PROGRESS', payload: 10 });
  }, []);

  const handleQuoteUpdate = useCallback((data: any) => {
    dispatch({ type: 'UPDATE_QUOTE_DATA', payload: data });
  }, []);

  const handleQuoteComplete = useCallback(async (quote: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Clear draft
      localStorage.removeItem('quote-draft');
      dispatch({ type: 'MARK_SAVED' });
      dispatch({ type: 'SET_PROGRESS', payload: 100 });
      
      toast({
        title: 'Quote Created Successfully',
        description: `Quote for ${quote.customer_name} has been created.`
      });

      if (onQuoteCreated) {
        onQuoteCreated(quote);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save quote' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [onQuoteCreated, toast]);

  const handleError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    toast({
      title: 'Error',
      description: error,
      variant: 'destructive'
    });
  }, [toast]);

  const handleReset = useCallback(() => {
    if (state.hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to start over?')) {
        return;
      }
    }
    
    localStorage.removeItem('quote-draft');
    dispatch({ type: 'RESET' });
    setShowModeSelector(true);
  }, [state.hasUnsavedChanges]);

  const handleCancel = useCallback(() => {
    if (state.hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    
    localStorage.removeItem('quote-draft');
    if (onCancel) {
      onCancel();
    }
  }, [state.hasUnsavedChanges, onCancel]);

  if (!auth?.isAuthenticated) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground">
          Please sign in to create quotes.
        </p>
      </Card>
    );
  }

  if (showModeSelector) {
    return (
      <ErrorBoundary>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Create a New Quote</h1>
            <p className="text-lg text-muted-foreground">
              Choose your preferred method for creating a paint quote
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Guided Chat Mode */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20">
              <div 
                className="text-center space-y-4"
                onClick={() => handleModeSelect('guided')}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">AI-Guided Chat</h3>
                  <Badge className="mt-2">Recommended</Badge>
                </div>
                <p className="text-muted-foreground">
                  Have a conversation with our AI assistant to create your quote naturally.
                  Perfect for complex projects or when you're not sure about measurements.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Natural conversation flow</li>
                  <li>✓ Smart measurement assistance</li>
                  <li>✓ Room-by-room guidance</li>
                  <li>✓ Automatic calculations</li>
                </ul>
                <Button className="w-full">Start AI Chat</Button>
              </div>
            </Card>

            {/* Chat Mode */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div 
                className="text-center space-y-4"
                onClick={() => handleModeSelect('chat')}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Simple Chat</h3>
                </div>
                <p className="text-muted-foreground">
                  Basic chat interface for quick quotes when you know what you need.
                  Faster for experienced users.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Quick and simple</li>
                  <li>✓ Direct input</li>
                  <li>✓ Fast processing</li>
                  <li>✓ No extra questions</li>
                </ul>
                <Button variant="outline" className="w-full">Simple Chat</Button>
              </div>
            </Card>

            {/* Wizard Mode */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div 
                className="text-center space-y-4"
                onClick={() => handleModeSelect('wizard')}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <ClipboardList className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Step-by-Step Form</h3>
                </div>
                <p className="text-muted-foreground">
                  Traditional form-based approach with clear steps and validation.
                  Great for precise control over all details.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Structured approach</li>
                  <li>✓ Field validation</li>
                  <li>✓ Progress tracking</li>
                  <li>✓ Review before submit</li>
                </ul>
                <Button variant="outline" className="w-full">Step-by-Step</Button>
              </div>
            </Card>
          </div>

          {/* Show draft notice if exists */}
          {state.quoteData && (
            <Card className="p-4 border-amber-200 bg-amber-50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    You have a saved draft from your previous session.
                  </p>
                  <p className="text-xs text-amber-600">
                    It will be automatically loaded when you select a mode.
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem('quote-draft');
                    dispatch({ type: 'RESET' });
                  }}
                >
                  Discard Draft
                </Button>
              </div>
            </Card>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with progress */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Create Quote</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {state.mode === 'guided' ? 'AI-Guided Chat' : 
                 state.mode === 'chat' ? 'Simple Chat' : 'Step-by-Step Form'}
              </Badge>
              {state.hasUnsavedChanges && (
                <Badge variant="secondary">Unsaved Changes</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Start Over
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {state.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{state.progress}%</span>
            </div>
            <Progress value={state.progress} className="h-2" />
          </div>
        )}

        {/* Error display */}
        {state.error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{state.error}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
              >
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        {/* Main interface */}
        <div className="min-h-[600px]">
          {state.mode === 'guided' && (
            <IntelligentChatInterface
              onQuoteUpdate={handleQuoteUpdate}
              onQuoteComplete={handleQuoteComplete}
              onError={handleError}
              initialData={state.quoteData}
              onProgressChange={(progress) => dispatch({ type: 'SET_PROGRESS', payload: progress })}
            />
          )}

          {state.mode === 'chat' && (
            <IntelligentChatInterface
              mode="simple"
              onQuoteUpdate={handleQuoteUpdate}
              onQuoteComplete={handleQuoteComplete}
              onError={handleError}
              initialData={state.quoteData}
              onProgressChange={(progress) => dispatch({ type: 'SET_PROGRESS', payload: progress })}
            />
          )}

          {state.mode === 'wizard' && (
            <QuoteWizard
              onQuoteComplete={handleQuoteComplete}
              onError={handleError}
              initialData={state.quoteData}
              onDataChange={handleQuoteUpdate}
              onProgressChange={(progress) => dispatch({ type: 'SET_PROGRESS', payload: progress })}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}