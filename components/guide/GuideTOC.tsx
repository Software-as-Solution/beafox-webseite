"use client";

// IMPORTS
import { useState, useEffect } from "react";
// ICONS
import { Check, List } from "lucide-react";

// TYPES
export interface TOCItem {
  id: string;
  label: string;
  level?: number; // 2 = h2, 3 = h3
}
interface GuideTOCProps {
  title?: string;
  items: TOCItem[];
}

// GUIDE_TOC
export default function GuideTOC({
  items,
  title = "Inhaltsverzeichnis",
}: GuideTOCProps) {
  // STATES
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // CONSTANTS
  const activeIndex = items.findIndex((it) => it.id === activeId);

  // FUNCTIONS
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Fixed navbar ~96px + Abstand (aligned mit sticky TOC top-28 ≈112px viewport offset)
    const scrollOffset = 112;
    const y = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(
        docHeight > 0 ? Math.min(100, (scrolled / docHeight) * 100) : 0,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="relative overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_4px_20px_-8px_rgba(17,24,39,0.06)]">
      {/* ─── READING PROGRESS BAR ─── */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-[3px] bg-gray-100"
      >
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-primaryOrange to-[#E87720] transition-[width] duration-150 ease-out"
        />
      </div>

      <div className="p-6 pt-7">
        {/* ─── HEADER ─── */}
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primaryOrange/15 ring-1 ring-primaryOrange/25">
            <List className="h-4 w-4 text-primaryOrange" aria-hidden="true" />
          </span>
          <div className="flex flex-col leading-none">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-darkerGray">
              {title}
            </h4>
            <span className="mt-1.5 text-[11px] text-gray-400">
              Klick zum Springen
            </span>
          </div>
        </div>

        {/* ─── STEPPER ─── */}
        <ol className="relative">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const isActive = activeId === item.id;
            const isVisited = activeIndex > i;

            return (
              <li key={item.id} className="relative">
                {/* Connecting line — runs node-center to node-center */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-[27px] top-[28px] h-full w-[2px] rounded-full transition-colors duration-300 ${
                      isVisited || isActive
                        ? "bg-primaryOrange/30"
                        : "bg-gray-200/70"
                    }`}
                  />
                )}

                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`group relative flex w-full items-start gap-3.5 rounded-xl px-2.5 py-2.5 text-left transition-colors duration-200 ${
                    isActive ? "bg-primaryOrange/5" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Node — number or check */}
                  <span
                    className={`relative z-[1] flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-primaryOrange text-white"
                        : isVisited
                          ? "bg-primaryOrange text-white"
                          : "bg-white text-gray-500 ring-1 ring-gray-200 group-hover:ring-gray-300"
                    }`}
                  >
                    {isVisited ? (
                      <Check
                        className="h-4 w-4"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : (
                      i + 1
                    )}
                  </span>

                  {/* Label — vertically centered against the node */}
                  <span
                    className={`flex min-h-9 items-center text-[14px] leading-snug transition-colors duration-200 ${
                      isActive
                        ? "font-semibold text-primaryOrange"
                        : isVisited
                          ? "text-gray-500"
                          : "text-gray-700 group-hover:text-darkerGray"
                    }`}
                  >
                    {item.label}
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
