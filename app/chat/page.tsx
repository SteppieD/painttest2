"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface ChatItem {
  id: number;
  quote_id: string;
  customer_name: string;
  address: string;
  created_at: string;
  quote_amount: number;
  last_message?: string;
}

const BRAND_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500'
];

export default function ChatListPage() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const company = localStorage.getItem("paintquote_company");
    if (!company) {
      router.push("/access-code");
      return;
    }

    try {
      const parsedCompany = JSON.parse(company);
      if (Date.now() - parsedCompany.loginTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("paintquote_company");
        router.push("/access-code");
        return;
      }
      setCompanyData(parsedCompany);
      loadChats(parsedCompany.id);
    } catch (e) {
      localStorage.removeItem("paintquote_company");
      router.push("/access-code");
    }
  }, [router]);

  const loadChats = async (companyId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotes?company_id=${companyId}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Transform quotes into chat items
        const chatItems = data.map((quote: any) => ({
          id: quote.id,
          quote_id: quote.quote_id,
          customer_name: quote.customer_name,
          address: quote.address,
          created_at: quote.created_at,
          quote_amount: quote.quote_amount || 0,
          last_message: quote.status === 'pending' ? 'Quote ready for review' : 'Quote completed'
        }));
        
        setChats(chatItems);
        setFilteredChats(chatItems);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter chats based on search
  useEffect(() => {
    const filtered = chats.filter(chat =>
      chat.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [chats, searchTerm]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const index = name.charCodeAt(0) % BRAND_COLORS.length;
    return BRAND_COLORS[index];
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleChatClick = (chatId: number) => {
    router.push(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    router.push('/assistant');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="w-9 h-9"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>
            
            <Button
              onClick={handleNewChat}
              size="icon"
              className="w-9 h-9 bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 border-0 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-200">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No conversations yet</p>
            <p className="text-sm text-gray-400 mb-6">Start your first quote to begin chatting</p>
            <Button 
              onClick={handleNewChat}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Start New Quote
            </Button>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(chat.customer_name)}`}>
                {getInitials(chat.customer_name)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.customer_name}
                  </h3>
                  <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(chat.created_at)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 truncate">
                  {chat.address}
                </p>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-400 truncate">
                    {chat.last_message}
                  </p>
                  <span className="text-sm font-medium text-green-600 flex-shrink-0 ml-2">
                    ${chat.quote_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}