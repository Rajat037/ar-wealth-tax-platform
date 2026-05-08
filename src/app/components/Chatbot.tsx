import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getApiUrl } from "../lib/api";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm ARia, your AI Tax Assistant. How can I help you with your Indian taxes today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = getApiUrl();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchCsrfToken = async () => {
    const response = await fetch(`${API_URL}/api/csrf-token`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to retrieve CSRF token.");
    }
    return data.csrfToken;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const csrfToken = await fetchCsrfToken();
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to chat server.');
      }

      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev, 
        { role: 'model', content: `**Error:** ${error.message || 'Something went wrong.'} Please try again later.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-green-700 transition-colors ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Tax Assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[90vw] max-w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-500 p-4 flex items-center justify-between text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">ARia</h3>
                  <p className="text-xs text-green-100 font-medium">AI Tax Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-600'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none'}`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {/* Simple basic markdown bold rendering for the response */}
                      {msg.content.split('**').map((text, i) => (
                        i % 2 === 1 ? <strong key={i}>{text}</strong> : text
                      ))}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-xs text-gray-500 font-medium">ARia is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about ITR, deductions..."
                  className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                ARia can make mistakes. Verify critical tax advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
