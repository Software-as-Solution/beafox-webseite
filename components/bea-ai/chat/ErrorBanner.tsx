"use client";

// ─── ErrorBanner ──────────────────────────────────────────
// Inline error notification with retry + dismiss controls.

import { motion } from "framer-motion";
import { RotateCcw, X as XIcon } from "lucide-react";

interface Props {
  error: string;
  canRetry: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}

export default function ErrorBanner({
  error,
  canRetry,
  onRetry,
  onDismiss,
}: Props) {
  return (
    <motion.div
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border-t border-red-100 bg-red-50"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <span className="flex-1 text-sm text-red-600">{error}</span>
        <div className="flex shrink-0 items-center gap-1">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <RotateCcw className="h-3 w-3" />
              Erneut versuchen
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fehler schließen"
            className="rounded-full p-1 text-red-600 transition-colors hover:bg-red-100"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
