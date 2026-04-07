"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Trophy } from "lucide-react";

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
}

interface GuideChecklistProps {
  title?: string;
  items: ChecklistItem[];
}

export default function GuideChecklist({
  title = "Deine Checkliste",
  items,
}: GuideChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = items.length > 0 ? (checked.size / items.length) * 100 : 0;
  const allDone = checked.size === items.length && items.length > 0;

  return (
    <div className="my-8 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-darkerGray font-bold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primaryOrange" />
            {title}
          </h4>
          <span className="text-xs text-lightGray">
            {checked.size}/{items.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: allDone ? "#22c55e" : "#eb8a26" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="px-5 pb-5 space-y-1">
        {items.map((item) => {
          const isDone = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                isDone
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 group-hover:text-primaryOrange/60 transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium transition-colors ${
                    isDone ? "text-green-700 line-through" : "text-darkerGray"
                  }`}
                >
                  {item.label}
                </span>
                {item.hint && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {item.hint}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                <Trophy className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-700 font-bold text-sm">Geschafft!</p>
                  <p className="text-green-600 text-xs">
                    Alle Schritte abgehakt — weiter so!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
