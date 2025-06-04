"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  clientName: string;
  address: string;
  timestamp: Date;
  projectType?: string;
  projectId?: string;
  quoteId?: string;
}

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Open sidebar by default on desktop
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load chat history from localStorage
    const loadChatHistory = async () => {
      const history = localStorage.getItem('paintquote_chat_history');
      if (history) {
        try {
          const parsed = JSON.parse(history);
          
          // Clean up invalid entries (remove sessions for deleted quotes)
          const validSessions = [];
          for (const session of parsed) {
            if (session.quoteId) {
              try {
                const response = await fetch(`/api/quotes/${session.quoteId}`);
                if (response.ok) {
                  validSessions.push(session);
                }
                // If quote doesn't exist, don't include the session
              } catch (error) {
                // Keep session if there's a network error (could be temporary)
                validSessions.push(session);
              }
            } else {
              // Keep older sessions without quote IDs
              validSessions.push(session);
            }
          }
          
          // Update localStorage if we removed any invalid entries
          if (validSessions.length !== parsed.length) {
            localStorage.setItem('paintquote_chat_history', JSON.stringify(validSessions));
          }
          
          setChatHistory(validSessions.sort((a: ChatSession, b: ChatSession) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        } catch (e) {
          console.error('Failed to load chat history:', e);
        }
      }
    };

    loadChatHistory();
    // Listen for updates to chat history
    window.addEventListener('storage', loadChatHistory);
    return () => window.removeEventListener('storage', loadChatHistory);
  }, []);

  const getInitialLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getBackgroundColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 bg-gray-50 border-r transform transition-transform duration-200 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Chat History</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-8">
                No previous chats
              </p>
            ) : (
              chatHistory.map((session, index) => (
                <button
                  key={session.id}
                  onClick={async () => {
                    // Navigate to the quote review page if we have a quote ID
                    if (session.quoteId) {
                      try {
                        // Check if quote still exists before navigating
                        const response = await fetch(`/api/quotes/${session.quoteId}`);
                        if (response.ok) {
                          router.push(`/quotes/${session.quoteId}/review`);
                        } else {
                          // Quote doesn't exist, search instead
                          router.push(`/quotes?search=${encodeURIComponent(session.clientName)}`);
                        }
                      } catch (error) {
                        // Network error, fallback to search
                        router.push(`/quotes?search=${encodeURIComponent(session.clientName)}`);
                      }
                    } else {
                      // For older sessions without quote ID, search by client name
                      router.push(`/quotes?search=${encodeURIComponent(session.clientName)}`);
                    }
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  className="w-full p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 flex items-start gap-3 text-left group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0",
                    getBackgroundColor(index)
                  )}>
                    {getInitialLetter(session.clientName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {session.clientName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {session.address}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-t bg-white">
            <Button
              onClick={() => {
                // Clear current chat and start new
                window.location.reload();
              }}
              className="w-full"
            >
              Start New Chat
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar for collapsed sidebar */}
        {!isSidebarOpen && (
          <div className="bg-white border-b px-4 py-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="shrink-0"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <span className="text-sm text-gray-600">Chat History</span>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}