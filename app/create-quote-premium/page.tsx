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
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <h1>Premium AI Quote Assistant</h1>
              <p>Multi-agent system with business optimization</p>
            </div>
            <div>
              <Badge variant="default">
                Premium
              </Badge>
              <Badge variant="outline">$100/1000 quotes</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Activity Indicator */}
      {agentActivity.length > 0 && (
        <div>
          <Card>
            <CardContent>
              <div>
                <Loader2 />
                <div>
                  {agentActivity.map((activity, idx) => (
                    <Badge key={idx} variant="secondary">
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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quote Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <p>Customer</p>
                  <p>{quoteData.customer_name}</p>
                </div>
                <div>
                  <p>Project</p>
                  <p>{quoteData.project_type || 'Determining...'}</p>
                </div>
                <div>
                  <p>Surfaces</p>
                  <p>{quoteData.surfaces?.join(', ') || 'Not selected'}</p>
                </div>
                <div>
                  <p>Estimate</p>
                  <p>{quoteData.quote_amount ? `$${quoteData.quote_amount.toLocaleString()}` : 'Calculating...'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Messages */}
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div>
              {/* Avatar */}
              <div>
                {message.type === 'user' ? (
                  <User />
                ) : message.type === 'system' ? (
                  <Target />
                ) : (
                  <Bot />
                )}
              </div>

              {/* Message Content */}
              <div>
                <div>
                  <div>{message.content}</div>
                </div>

                {/* Agent Insights */}
                {message.agentInsights && (
                  <div>
                    <div>
                      <Badge variant="outline">
                        <CheckCircle />
                        Confidence: {Math.round(message.agentInsights.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <div>
                      {message.agentInsights.validation && (
                        <details>
                          <summary>
                            <AlertTriangle />
                            Validation Check
                          </summary>
                          <p>{message.agentInsights.validation}</p>
                        </details>
                      )}

                      {message.agentInsights.strategy && (
                        <details>
                          <summary>
                            <Lightbulb />
                            Business Strategy
                          </summary>
                          <p>{message.agentInsights.strategy}</p>
                        </details>
                      )}

                      {message.agentInsights.pricing && (
                        <details>
                          <summary>
                            <DollarSign />
                            Pricing Intelligence
                          </summary>
                          <p>{message.agentInsights.pricing}</p>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div>
        <div>
          <div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your painting project or ask for business advice..."
              disabled={loading}
             
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
             
            >
              {loading ? (
                <Loader2 />
              ) : (
                <Send />
              )}
            </Button>
          </div>
          
          <div>
            <div>
              <span>
                <Clock />
                Multi-agent processing
              </span>
              <span>
                <TrendingUp />
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