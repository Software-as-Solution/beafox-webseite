"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown } from "lucide-react";

export interface WissenTOCItem {
  text: string;
  level: "h2" | "h3";
  id: string;
}

interface WissenTOCProps {
  items: WissenTOCItem[];
  title?: string;
}

export default function WissenTOC({ items, title = "Inhaltsverzeichnis" }: WissenTOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible section heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
      {/* Mobile: Collapsible toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden flex items-center justify-between mb-0"
      >
        <h4 className="text-xs font-bold text-lightGray uppercase tracking-wide flex items-center gap-2">
          <List className="w-3.5 h-3.5" />
          {title}
        </h4>
        <ChevronDown
          className={`w-4 h-4 text-lightGray transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Desktop: Always visible heading */}
      <h4 className="hidden md:flex text-xs font-bold text-lightGray uppercase tracking-wide mb-4 items-center gap-2">
        <List className="w-3.5 h-3.5" />
        {title}
      </h4>

      {/* Content: Mobile only when open, desktop always visible */}
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <p className="hidden md:block text-[10px] text-gray-400 mb-3">Klick um zu springen</p>
        <ol className="space-y-1">
          {items.map((item, i) => {
            const isActive = activeId === item.id;
            const indent = item.level === "h3";
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    scrollTo(item.id);
                    setIsOpen(false); // Close mobile menu after click
                  }}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all duration-200 ${
                    indent ? "ml-3" : ""
                  } ${
                    isActive
                      ? "bg-primaryOrange/5 text-primaryOrange"
                      : "text-lightGray hover:text-darkerGray hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0 ${
                      isActive
                        ? "bg-primaryOrange text-white"
                        : "bg-gray-100 text-lightGray"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed line-clamp-2">
                    {item.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
