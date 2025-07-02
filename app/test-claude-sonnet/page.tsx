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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧠 Claude 3.5 Sonnet Quote Assistant Test
        </h1>
        <p className="text-gray-600">
          Test the upgraded AI system with natural conversation. Try saying things like:
        </p>
        <div className="mt-2 text-sm text-gray-500 space-y-1">
          <div>"I need a quote for painting my living room and kitchen"</div>
          <div>"It's about 300 linear feet with 9 foot ceilings, 3 doors and 5 windows"</div>
          <div>"The customer is John Smith at 123 Main Street"</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chat with Claude 3.5 Sonnet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
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
              <div className="space-y-2 text-sm">
                {Object.keys(projectData).length === 0 ? (
                  <p className="text-gray-500 italic">No data extracted yet</p>
                ) : (
                  Object.entries(projectData).map(([key, value]) => (
                    <div key={key} className="border-b pb-1">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Natural conversation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Smart data extraction</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Context awareness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Contractor expertise</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 How to Test</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. Start with basic project info: "I need a quote for painting my house"</p>
          <p>2. Give measurements naturally: "It's about 300 linear feet with 9 foot ceilings"</p>
          <p>3. Add details: "3 doors and 5 windows, customer is John at 123 Main St"</p>
          <p>4. Watch how Claude extracts and understands the information</p>
        </div>
      </div>
    </div>
  );
}