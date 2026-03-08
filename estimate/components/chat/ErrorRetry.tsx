"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, MessageCircle } from "lucide-react";
import { ERROR_MESSAGES } from "@/content/estimate";

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorRetry({
  message = ERROR_MESSAGES.networkError,
  onRetry,
}: ErrorRetryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="v-stack items-center gap-3 rounded-xl border border-sunset/30 bg-sunset/5 px-6 py-4"
    >
      <p className="text-sm text-forest/80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        もう一度試す
      </button>
      <Link
        href="https://cloudnature.jp/contact"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-forest/60 underline-offset-2 hover:text-forest hover:underline"
      >
        <MessageCircle className="h-3 w-3" />
        解決しない場合はお問い合わせください
      </Link>
    </motion.div>
  );
}
