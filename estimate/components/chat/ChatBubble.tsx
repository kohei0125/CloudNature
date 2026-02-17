"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import type { ChatMessage } from "@/types/estimate";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default memo(function ChatBubble({ message }: ChatBubbleProps) {
  const isSystem = message.role === "system";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "h-stack gap-3",
        isSystem ? "justify-start" : "justify-end"
      )}
    >
      {isSystem && (
        <div className="center h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-sage to-forest">
          <Leaf className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isSystem
            ? "glass-card rounded-tl-md text-forest"
            : "rounded-tr-md bg-forest text-white"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
});
