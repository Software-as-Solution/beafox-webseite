"use client";

import { type PortableTextBlock } from "@/lib/sanity-fetch";

interface PortableTextProps {
  blocks: PortableTextBlock[];
}

/**
 * Lightweight Portable Text renderer for Sanity body content.
 * Handles: h2, h3, h4, normal, blockquote, bold, italic, links.
 */
export default function PortableText({ blocks }: PortableTextProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="portable-text space-y-5">
      {blocks.map((block) => {
        if (block._type !== "block") return null;

        const children = block.children ?? [];
        const text = children.map((child, i) => {
          let el: React.ReactNode = child.text;
          const marks = child.marks ?? [];

          if (marks.includes("strong")) {
            el = (
              <strong key={i} className="font-bold text-darkerGray">
                {el}
              </strong>
            );
          }
          if (marks.includes("em")) {
            el = (
              <em key={i} className="italic">
                {el}
              </em>
            );
          }

          // Check for link annotations
          const linkMark = marks.find(
            (m) => m !== "strong" && m !== "em"
          );
          if (linkMark && block.markDefs) {
            const linkDef = block.markDefs.find(
              (def: any) => def._key === linkMark
            );
            if (linkDef?.href) {
              el = (
                <a
                  key={i}
                  href={linkDef.href}
                  target={linkDef.blank ? "_blank" : undefined}
                  rel={linkDef.blank ? "noopener noreferrer" : undefined}
                  className="text-primaryOrange hover:underline font-medium"
                >
                  {el}
                </a>
              );
            }
          }

          return <span key={i}>{el}</span>;
        });

        switch (block.style) {
          case "h2":
            return (
              <h2
                key={block._key}
                className="text-xl md:text-2xl font-bold text-darkerGray mt-8 mb-3 first:mt-0"
              >
                {text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={block._key}
                className="text-lg md:text-xl font-bold text-darkerGray mt-6 mb-2"
              >
                {text}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={block._key}
                className="text-base md:text-lg font-semibold text-darkerGray mt-4 mb-2"
              >
                {text}
              </h4>
            );
          case "blockquote":
            return (
              <blockquote
                key={block._key}
                className="border-l-4 border-primaryOrange pl-4 py-2 text-lightGray italic bg-primaryOrange/5 rounded-r-lg"
              >
                {text}
              </blockquote>
            );
          default:
            return (
              <p
                key={block._key}
                className="text-base text-lightGray leading-relaxed"
              >
                {text}
              </p>
            );
        }
      })}
    </div>
  );
}
