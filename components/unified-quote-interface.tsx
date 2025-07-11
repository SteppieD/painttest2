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
// import { IntelligentChatInterface } from './intelligent-chat-interface';
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
      <Card>
        <AlertCircle />
        <h3>Authentication Required</h3>
        <p>
          Please sign in to create quotes.
        </p>
      </Card>
    );
  }

  if (showModeSelector) {
    return (
      <ErrorBoundary>
        <div>
          <div>
            <h1>Create a New Quote</h1>
            <p>
              Choose your preferred method for creating a paint quote
            </p>
          </div>

          <div>
            {/* Guided Chat Mode */}
            <Card>
              <div 
               
                onClick={() => handleModeSelect('guided')}
              >
                <div>
                  <Sparkles />
                </div>
                <div>
                  <h3>AI-Guided Chat</h3>
                  <Badge>Recommended</Badge>
                </div>
                <p>
                  Have a conversation with our AI assistant to create your quote naturally.
                  Perfect for complex projects or when you're not sure about measurements.
                </p>
                <ul>
                  <li>✓ Natural conversation flow</li>
                  <li>✓ Smart measurement assistance</li>
                  <li>✓ Room-by-room guidance</li>
                  <li>✓ Automatic calculations</li>
                </ul>
                <Button>Start AI Chat</Button>
              </div>
            </Card>

            {/* Chat Mode */}
            <Card>
              <div 
               
                onClick={() => handleModeSelect('chat')}
              >
                <div>
                  <MessageSquare />
                </div>
                <div>
                  <h3>Simple Chat</h3>
                </div>
                <p>
                  Basic chat interface for quick quotes when you know what you need.
                  Faster for experienced users.
                </p>
                <ul>
                  <li>✓ Quick and simple</li>
                  <li>✓ Direct input</li>
                  <li>✓ Fast processing</li>
                  <li>✓ No extra questions</li>
                </ul>
                <Button variant="outline">Simple Chat</Button>
              </div>
            </Card>

            {/* Wizard Mode */}
            <Card>
              <div 
               
                onClick={() => handleModeSelect('wizard')}
              >
                <div>
                  <ClipboardList />
                </div>
                <div>
                  <h3>Step-by-Step Form</h3>
                </div>
                <p>
                  Traditional form-based approach with clear steps and validation.
                  Great for precise control over all details.
                </p>
                <ul>
                  <li>✓ Structured approach</li>
                  <li>✓ Field validation</li>
                  <li>✓ Progress tracking</li>
                  <li>✓ Review before submit</li>
                </ul>
                <Button variant="outline">Step-by-Step</Button>
              </div>
            </Card>
          </div>

          {/* Show draft notice if exists */}
          {state.quoteData && (
            <Card>
              <div>
                <AlertCircle />
                <div>
                  <p>
                    You have a saved draft from your previous session.
                  </p>
                  <p>
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
      <div>
        {/* Header with progress */}
        <div>
          <div>
            <h1>Create Quote</h1>
            <div>
              <Badge variant="outline">
                {state.mode === 'guided' ? 'AI-Guided Chat' : 
                 state.mode === 'chat' ? 'Simple Chat' : 'Step-by-Step Form'}
              </Badge>
              {state.hasUnsavedChanges && (
                <Badge variant="secondary">Unsaved Changes</Badge>
              )}
            </div>
          </div>
          
          <div>
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
          <div>
            <div>
              <span>Progress</span>
              <span>{state.progress}%</span>
            </div>
            <Progress value={state.progress} />
          </div>
        )}

        {/* Error display */}
        {state.error && (
          <Card>
            <div>
              <AlertCircle />
              <div>
                <p>Error</p>
                <p>{state.error}</p>
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
        <div>
          {state.mode === 'guided' && (
            <div>
              <p>Guided mode temporarily unavailable</p>
            </div>
          )}

          {state.mode === 'chat' && (
            <div>
              <p>Chat mode temporarily unavailable</p>
            </div>
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