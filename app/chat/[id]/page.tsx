"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface QuoteData {
  id: number;
  quote_id: string;
  customer_name: string;
  address: string;
  project_type: string;
  quote_amount: number;
  status: string;
  created_at: string;
  conversation_summary?: string;
}

export default function IndividualChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadQuoteAndMessages();
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadQuoteAndMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
        
        // Parse conversation history if available
        if (data.conversation_summary && typeof data.conversation_summary === 'string') {
          try {
            const conversationHistory = JSON.parse(data.conversation_summary);
            if (Array.isArray(conversationHistory)) {
              setMessages(conversationHistory);
            }
          } catch (e) {
            console.error('Error parsing conversation:', e);
            // Create a basic conversation if parsing fails
            setMessages([
              {
                id: '1',
                role: 'assistant',
                content: `Hi! I've prepared a quote for your ${data.project_type} painting project at ${data.address}. The total estimate is $${data.quote_amount?.toLocaleString()}. Would you like to see the detailed breakdown?`,
                timestamp: data.created_at
              }
            ]);
          }
        } else {
          // Create initial conversation
          setMessages([
            {
              id: '1',
              role: 'assistant',
              content: `Hi! I've prepared a quote for your ${data.project_type} painting project at ${data.address}. The total estimate is $${data.quote_amount?.toLocaleString()}. Would you like to see the detailed breakdown?`,
              timestamp: data.created_at
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    // Auto-resize textarea back to original size
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Simple auto-response based on input
      const response = generateAutoResponse(inputValue.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsSending(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  const generateAutoResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('breakdown') || lowerInput.includes('detail')) {
      return `Here's the detailed breakdown for your project:\n\n• Labor: $${Math.round((quote?.quote_amount || 0) * 0.45).toLocaleString()}\n• Materials: $${Math.round((quote?.quote_amount || 0) * 0.35).toLocaleString()}\n• Markup: $${Math.round((quote?.quote_amount || 0) * 0.20).toLocaleString()}\n\nWould you like to proceed with this quote?`;
    }
    
    if (lowerInput.includes('yes') || lowerInput.includes('proceed') || lowerInput.includes('accept')) {
      return "Great! I'll mark this quote as accepted. You can view the full quote details by tapping 'View Quote' above. Is there anything else you'd like to know about the project?";
    }
    
    if (lowerInput.includes('change') || lowerInput.includes('modify') || lowerInput.includes('adjust')) {
      return "I understand you'd like to make some changes. For quote modifications, please use the 'View Quote' button above to access the detailed quote page where you can adjust pricing and specifications.";
    }
    
    if (lowerInput.includes('when') || lowerInput.includes('timeline') || lowerInput.includes('schedule')) {
      return "We typically schedule projects 1-2 weeks out. The actual painting work for your project should take about 3-5 business days. We'll coordinate the exact start date once you approve the quote.";
    }
    
    return "Thanks for your message! For detailed quote adjustments and final approval, please use the 'View Quote' button above. Is there anything specific about the project you'd like to discuss?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quote not found</p>
          <Button onClick={() => router.push("/chat")}>
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/chat")}
                className="w-9 h-9"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(quote.customer_name)}
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">
                    {quote.customer_name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {quote.address}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => router.push(`/quotes/${quote.id}/review`)}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              disabled={isSending}
              className="min-h-[44px] max-h-[120px] resize-none border-gray-300 rounded-2xl pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            size="icon"
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}