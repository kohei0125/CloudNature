"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, X } from "lucide-react";

interface NavigationControlsProps {
  canGoBack: boolean;
  onBack: () => void;
  onExit: () => void;
}

export default function NavigationControls({
  canGoBack,
  onBack,
  onExit,
}: NavigationControlsProps) {
  return (
    <div className="h-stack items-center justify-between px-4 py-3 md:px-6">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="前のステップに戻る"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition-colors",
          canGoBack
            ? "text-gray-600 hover:text-gray-900"
            : "cursor-not-allowed text-transparent select-none"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>戻る</span>
      </button>

      <button
        type="button"
        onClick={onExit}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <X className="h-4 w-4" />
        <span>終了する</span>
      </button>
    </div>
  );
}
