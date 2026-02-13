'use client';

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_COPY } from "@/content/ai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: AI_COPY.initial }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', text: AI_COPY.placeholderReply }]);
      setIsLoading(false);
    }, 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] v-stack overflow-hidden border border-pebble animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-4 flex justify-between items-center bg-forest text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sunset" />
              <div>
                <h3 className="font-bold text-sm">CloudNature AI</h3>
                <p className="text-xs opacity-80">24時間対応コンシェルジュ</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 v-stack gap-4 bg-mist">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user'
                      ? "bg-sage text-white rounded-tr-none"
                      : "bg-white text-forest border border-gray-100 shadow-sm rounded-tl-none"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sage" />
                  <span className="text-xs text-gray-500">AIが入力中...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={AI_COPY.inputPlaceholder}
                className="w-full bg-pebble text-forest rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sunset text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              {AI_COPY.typingNote}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 p-4 rounded-full bg-sage text-white shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="font-bold hidden group-hover:block whitespace-nowrap">AIに相談する</span>
        </button>
      )}
    </div>
  );
};

export default AIConcierge;
