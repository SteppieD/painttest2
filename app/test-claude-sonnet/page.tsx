"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function TestClaudeSonnet() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your upgraded Claude 3.5 Sonnet quote assistant. I'm much better at understanding natural conversation and extracting project details. Try telling me about a painting project!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState({});

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('/api/claude-sonnet-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stage: 'information_gathering',
          userInput: input,
          projectData,
          conversationHistory: messages.slice(-6) // Last 6 messages for context
        })
      });

      const data = await response.json();

      if (data.extractedData && Object.keys(data.extractedData).length > 0) {
        setProjectData(prev => ({ ...prev, ...data.extractedData }));
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || data.fallback || "I'm having trouble right now. Could you try rephrasing that?",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I'm having connection issues. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <div>
        <h1>
          🧠 Claude 3.5 Sonnet Quote Assistant Test
        </h1>
        <p>
          Test the upgraded AI system with natural conversation. Try saying things like:
        </p>
        <div>
          <div>"I need a quote for painting my living room and kitchen"</div>
          <div>"It's about 300 linear feet with 9 foot ceilings, 3 doors and 5 windows"</div>
          <div>"The customer is John Smith at 123 Main Street"</div>
        </div>
      </div>

      <div>
        {/* Chat Interface */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Chat with Claude 3.5 Sonnet</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {messages.map((message, index) => (
                  <div
                    key={index}
                  >
                    <div>
                      <div>{message.content}</div>
                      <div>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div>
                    <div>
                      <div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                 
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !input.trim()}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Extracted Data Display */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Extracted Project Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {Object.keys(projectData).length === 0 ? (
                  <p>No data extracted yet</p>
                ) : (
                  Object.entries(projectData).map(([key, value]) => (
                    <div key={key}>
                      <span>
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div></div>
                <span>Natural conversation</span>
              </div>
              <div>
                <div></div>
                <span>Smart data extraction</span>
              </div>
              <div>
                <div></div>
                <span>Context awareness</span>
              </div>
              <div>
                <div></div>
                <span>Contractor expertise</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3>💡 How to Test</h3>
        <div>
          <p>1. Start with basic project info: "I need a quote for painting my house"</p>
          <p>2. Give measurements naturally: "It's about 300 linear feet with 9 foot ceilings"</p>
          <p>3. Add details: "3 doors and 5 windows, customer is John at 123 Main St"</p>
          <p>4. Watch how Claude extracts and understands the information</p>
        </div>
      </div>
    </div>
  );
}