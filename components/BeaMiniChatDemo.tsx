"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// CONSTANTS
interface Message {
  sender: "user" | "bea";
  text: string;
}

const CONVERSATION: Message[] = [
  {
    sender: "user",
    text: "Ich hab 200€ über. Was soll ich damit machen?",
  },
  {
    sender: "bea",
    text: "Bei deinem Gehalt würde ich 50€ als Notgroschen weglegen und 150€ in einen ETF-Sparplan stecken.",
  },
  {
    sender: "user",
    text: "Welcher ETF passt zu mir?",
  },
  {
    sender: "bea",
    text: "Für dich passt der MSCI World — breit gestreut, langfristig stabil. Den kannst du z.B. bei Trade Republic oder Scalable Capital besparen.",
  },
  {
    sender: "user",
    text: "Und wo bekomme ich den am günstigsten?",
  },
  {
    sender: "bea",
    text: "Trade Republic hat aktuell die niedrigsten Gebühren (1€ pro Sparplan). Soll ich dir den direkten Link schicken?",
  },
];

export default function BeaMiniChatDemo() {
  // Start with first message ALWAYS visible to avoid empty state on initial render
  const [visibleCount, setVisibleCount] = useState(1);
  const [typingFor, setTypingFor] = useState<number | null>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Bea typing → message 2
    timers.push(setTimeout(() => setTypingFor(2), 1000));
    timers.push(
      setTimeout(() => {
        setTypingFor(null);
        setVisibleCount(2);
      }, 2400),
    );

    // User message 3
    timers.push(setTimeout(() => setVisibleCount(3), 3800));

    // Bea typing → message 4
    timers.push(setTimeout(() => setTypingFor(4), 4500));
    timers.push(
      setTimeout(() => {
        setTypingFor(null);
        setVisibleCount(4);
      }, 6000),
    );

    // User message 5
    timers.push(setTimeout(() => setVisibleCount(5), 7800));

    // Bea typing → message 6
    timers.push(setTimeout(() => setTypingFor(6), 8500));
    timers.push(
      setTimeout(() => {
        setTypingFor(null);
        setVisibleCount(6);
      }, 10200),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="relative bg-white rounded-3xl overflow-hidden"
      style={{
        border: "1px solid #F0E5D8",
        boxShadow:
          "0 4px 6px rgba(232,119,32,0.04), 0 24px 60px rgba(232,119,32,0.12)",
      }}
    >
      {/* ─── HEADER ─── */}
      <div
        className="relative px-5 md:px-6 py-2 flex items-center gap-3 border-b border-orange-100/80 justify-center"
        style={{
          background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
        }}
      >
        {/* Avatar */}
        <div
          className="relative w-11 h-11 flex items-center justify-center flex-shrink-0"
        >
          <div className="relative w-9 h-9">
            <Image
              src="/assets/Logos/Logo.webp"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Name + Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-darkerGray">Bea</div>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            </div>
            <div className="text-[11px] text-lightGray">
              Online
            </div>
          </div>
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <div className="relative px-5 md:px-6 py-5 md:py-6 space-y-3 min-h-[420px] bg-white">
        <AnimatePresence>
          {CONVERSATION.map((msg, idx) => {
            const messageNum = idx + 1;
            if (messageNum > visibleCount) return null;

            return (
              <motion.div
                key={`msg-${idx}`}
                initial={
                  messageNum === 1
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 12, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm md:text-[15px] leading-snug ${
                    msg.sender === "user"
                      ? "rounded-2xl rounded-tr-md text-white font-medium"
                      : "rounded-2xl rounded-tl-md text-darkerGray"
                  }`}
                  style={
                    msg.sender === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
                          boxShadow: "0 4px 12px rgba(232,119,32,0.22)",
                        }
                      : {
                          background: "#F9FAFB",
                          border: "1px solid #F3F4F6",
                        }
                  }
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {typingFor !== null && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex justify-start"
            >
              <div
                className="rounded-2xl rounded-tl-md px-4 py-3"
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #F3F4F6",
                }}
              >
                <div className="flex items-center gap-1">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primaryOrange"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="relative px-5 md:px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primaryOrange animate-pulse" />
          <div className="text-[11px] font-medium text-lightGray">
            Live Demo
          </div>
        </div>

        <Link
          href="/unlimited"
          className="group inline-flex items-center gap-1 text-xs font-bold text-primaryOrange transition-all"
        >
          Selbst ausprobieren
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
