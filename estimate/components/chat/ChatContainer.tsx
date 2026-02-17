"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types/estimate";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatContainerProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  typingMessage?: string;
  children?: React.ReactNode;
}

export default function ChatContainer({
  messages,
  isTyping = false,
  typingMessage,
  children,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function scrollToBottom() {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollToBottom();
  }, [messages.length, isTyping]);

  return (
    <div className="v-stack flex-1 overflow-y-auto px-4 py-6">
      <div className="v-stack mx-auto w-full max-w-2xl gap-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        <AnimatePresence>
          {isTyping && <TypingIndicator message={typingMessage} />}
        </AnimatePresence>

        {children}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
