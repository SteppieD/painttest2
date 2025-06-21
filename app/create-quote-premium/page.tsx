'use client'

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Send, 
  User, 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  agentInsights?: {
    validation?: string;
    strategy?: string;
    pricing?: string;
    confidence: number;
  };
}

interface QuoteData {
  customer_name?: string;
  address?: string;
  project_type?: string;
  surfaces?: string[];
  dimensions?: any;
  quote_amount?: number;
  stage: string;
}

export default function PremiumQuoteCreationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '🚀 **Premium AI Assistant Active** - Multi-agent system ready with business optimization, validation, and market intelligence.',
      timestamp: new Date()
    },
    {
      id: '2', 
      type: 'ai',
      content: 'Welcome to the premium quote assistant! I have a team of AI experts ready to help: conversation specialist, validation expert, business strategist, and pricing analyst. What project are we quoting today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData>({ stage: 'initial' });
  const [agentActivity, setAgentActivity] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addAgentActivity = (activity: string) => {
    setAgentActivity(prev => [...prev.slice(-2), activity]); // Keep last 3 activities
    setTimeout(() => {
      setAgentActivity(prev => prev.filter(a => a !== activity));
    }, 3000);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Show agent activity
    addAgentActivity('🧠 Understanding Agent analyzing...');
    
    try {
      const response = await fetch('/api/premium-ai-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: {
            stage: quoteData.stage,
            conversationHistory: messages.slice(-10), // Last 10 messages for context
            currentData: quoteData,
            customerProfile: {
              name: quoteData.customer_name,
              address: quoteData.address
            }
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show additional agent activities based on response
        if (data.validation_notes) {
          addAgentActivity('🔍 Validation Agent checking quality...');
        }
        if (data.strategy_suggestions) {
          addAgentActivity('💡 Strategy Agent optimizing...');
        }
        if (data.pricing_insights) {
          addAgentActivity('💰 Pricing Agent analyzing market...');
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.primary_response,
          timestamp: new Date(),
          agentInsights: {
            validation: data.validation_notes,
            strategy: data.strategy_suggestions,
            pricing: data.pricing_insights,
            confidence: data.confidence || 0.8
          }
        };

        setMessages(prev => [...prev, aiMessage]);

        // Update quote data if provided
        if (data.updated_data) {
          setQuoteData(prev => ({ ...prev, ...data.updated_data }));
        }

        // Show agent insights as separate messages if they exist
        if (data.validation_notes || data.strategy_suggestions || data.pricing_insights) {
          setTimeout(() => {
            const insightsMessage: Message = {
              id: (Date.now() + 2).toString(),
              type: 'system',
              content: 'Agent insights available - click the badges below to see recommendations from each specialist.',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, insightsMessage]);
          }, 1000);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I apologize, but I encountered an issue processing your request. Could you please try again?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Premium AI error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai', 
        content: 'I\'m having trouble connecting to my specialist team right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100\">
      {/* Header */}
      <div className=\"bg-white border-b shadow-sm\">
        <div className=\"max-w-4xl mx-auto p-4\">
          <div className=\"flex items-center justify-between\">
            <div>
              <h1 className=\"text-2xl font-bold text-gray-900\">Premium AI Quote Assistant</h1>
              <p className=\"text-sm text-gray-600\">Multi-agent system with business optimization</p>
            </div>
            <div className=\"flex items-center gap-2\">
              <Badge variant=\"default\" className=\"bg-gradient-to-r from-blue-600 to-purple-600 text-white\">
                Premium
              </Badge>
              <Badge variant=\"outline\">$100/1000 quotes</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Activity Indicator */}
      {agentActivity.length > 0 && (
        <div className=\"max-w-4xl mx-auto p-4\">
          <Card className=\"bg-blue-50 border-blue-200\">
            <CardContent className=\"p-3\">
              <div className=\"flex items-center gap-2\">
                <Loader2 className=\"w-4 h-4 animate-spin text-blue-600\" />
                <div className=\"flex flex-wrap gap-2\">
                  {agentActivity.map((activity, idx) => (
                    <Badge key={idx} variant=\"secondary\" className=\"text-xs\">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quote Progress */}
      {quoteData.customer_name && (
        <div className=\"max-w-4xl mx-auto p-4\">
          <Card>
            <CardHeader className=\"pb-3\">
              <CardTitle className=\"text-lg\">Quote Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm\">
                <div>
                  <p className=\"text-gray-600\">Customer</p>
                  <p className=\"font-medium\">{quoteData.customer_name}</p>
                </div>
                <div>
                  <p className=\"text-gray-600\">Project</p>
                  <p className=\"font-medium\">{quoteData.project_type || 'Determining...'}</p>
                </div>
                <div>
                  <p className=\"text-gray-600\">Surfaces</p>
                  <p className=\"font-medium\">{quoteData.surfaces?.join(', ') || 'Not selected'}</p>
                </div>
                <div>
                  <p className=\"text-gray-600\">Estimate</p>
                  <p className=\"font-medium\">{quoteData.quote_amount ? `$${quoteData.quote_amount.toLocaleString()}` : 'Calculating...'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Messages */}
      <div className=\"max-w-4xl mx-auto p-4 space-y-4 pb-32\">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : message.type === 'system'
                  ? 'bg-purple-600'
                  : 'bg-gradient-to-r from-green-500 to-blue-500'
              }`}>
                {message.type === 'user' ? (
                  <User className=\"w-4 h-4 text-white\" />
                ) : message.type === 'system' ? (
                  <Target className=\"w-4 h-4 text-white\" />
                ) : (
                  <Bot className=\"w-4 h-4 text-white\" />
                )}
              </div>

              {/* Message Content */}
              <div className={`space-y-2 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-lg max-w-full ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'system'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-white border shadow-sm'
                }`}>
                  <div className=\"whitespace-pre-wrap\">{message.content}</div>
                </div>

                {/* Agent Insights */}
                {message.agentInsights && (
                  <div className=\"space-y-2\">
                    <div className=\"flex flex-wrap gap-2\">
                      <Badge variant=\"outline\" className=\"text-xs\">
                        <CheckCircle className=\"w-3 h-3 mr-1\" />
                        Confidence: {Math.round(message.agentInsights.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <div className=\"grid gap-2\">
                      {message.agentInsights.validation && (
                        <details className=\"bg-yellow-50 border border-yellow-200 rounded p-2\">
                          <summary className=\"cursor-pointer text-xs font-medium text-yellow-800 flex items-center gap-1\">
                            <AlertTriangle className=\"w-3 h-3\" />
                            Validation Check
                          </summary>
                          <p className=\"text-xs text-yellow-700 mt-1\">{message.agentInsights.validation}</p>
                        </details>
                      )}

                      {message.agentInsights.strategy && (
                        <details className=\"bg-green-50 border border-green-200 rounded p-2\">
                          <summary className=\"cursor-pointer text-xs font-medium text-green-800 flex items-center gap-1\">
                            <Lightbulb className=\"w-3 h-3\" />
                            Business Strategy
                          </summary>
                          <p className=\"text-xs text-green-700 mt-1\">{message.agentInsights.strategy}</p>
                        </details>
                      )}

                      {message.agentInsights.pricing && (
                        <details className=\"bg-blue-50 border border-blue-200 rounded p-2\">
                          <summary className=\"cursor-pointer text-xs font-medium text-blue-800 flex items-center gap-1\">
                            <DollarSign className=\"w-3 h-3\" />
                            Pricing Intelligence
                          </summary>
                          <p className=\"text-xs text-blue-700 mt-1\">{message.agentInsights.pricing}</p>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                <div className=\"text-xs text-gray-500\">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className=\"fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg\">
        <div className=\"max-w-4xl mx-auto p-4\">
          <div className=\"flex gap-2\">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=\"Describe your painting project or ask for business advice...\"
              disabled={loading}
              className=\"flex-1\"
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              className=\"bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700\"
            >
              {loading ? (
                <Loader2 className=\"w-4 h-4 animate-spin\" />
              ) : (
                <Send className=\"w-4 h-4\" />
              )}
            </Button>
          </div>
          
          <div className=\"mt-2 flex items-center justify-between text-xs text-gray-500\">
            <div className=\"flex items-center gap-4\">
              <span className=\"flex items-center gap-1\">
                <Clock className=\"w-3 h-3\" />
                Multi-agent processing
              </span>
              <span className=\"flex items-center gap-1\">
                <TrendingUp className=\"w-3 h-3\" />
                Business optimization
              </span>
            </div>
            <span>Premium AI - $0.10 per interaction</span>
          </div>
        </div>
      </div>
    </div>
  );
}