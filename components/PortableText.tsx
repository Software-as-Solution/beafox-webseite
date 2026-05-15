"use client";

// IMPORTS
import { type ReactNode } from "react";
import { type PortableTextBlock } from "@/lib/sanity-fetch";

// TYPES
type PortableTextVariant = "default" | "guide";

interface PortableTextProps {
  blocks: PortableTextBlock[];
  variant?: PortableTextVariant;
}

interface RenderedBlock {
  key: string;
  node: ReactNode;
  mt: string;
}

// HELPERS FUNCTIONS
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getHeadingId(text: string, seen: Map<string, number>): string {
  const fallback = "abschnitt";
  const base = slugifyHeading(text) || fallback;
  const currentCount = seen.get(base) ?? 0;
  seen.set(base, currentCount + 1);
  return currentCount === 0 ? base : `${base}-${currentCount + 1}`;
}

/** Renders the inline children of a block (strong, em, links). */
function renderChildren(block: PortableTextBlock): ReactNode[] {
  const children = block.children ?? [];
  return children.map((child, i) => {
    let el: ReactNode = child.text;
    const marks = child.marks ?? [];

    if (marks.includes("strong")) {
      el = (
        <strong key={`s-${i}`} className="font-bold text-darkerGray">
          {el}
        </strong>
      );
    }
    if (marks.includes("em")) {
      el = (
        <em key={`e-${i}`} className="italic">
          {el}
        </em>
      );
    }

    const linkMark = marks.find((m) => m !== "strong" && m !== "em");
    if (linkMark && block.markDefs) {
      const linkDef = block.markDefs.find(
        (def: { _key?: string }) => def._key === linkMark,
      );
      if (linkDef?.href) {
        el = (
          <a
            key={`a-${i}`}
            href={linkDef.href}
            target={linkDef.blank ? "_blank" : undefined}
            rel={linkDef.blank ? "noopener noreferrer" : undefined}
            className="font-medium text-primaryOrange hover:underline"
          >
            {el}
          </a>
        );
      }
    }

    return <span key={i}>{el}</span>;
  });
}

/** Plain-text content of a block — used to build heading anchor ids. */
function plainText(block: PortableTextBlock): string {
  return (block.children ?? [])
    .map((child) => child.text)
    .join(" ")
    .trim();
}

// PORTABLE_TEXT
/**
 * Lightweight Portable Text renderer for Sanity body content.
 * Handles headings (h2–h4), normal paragraphs, blockquote, and
 * bullet/number lists.
 *
 * `variant="guide"` switches to the richer guide typography used on
 * Ratgeber pages; `variant="default"` keeps the lighter magazin styling.
 */
export default function PortableText({
  blocks,
  variant = "default",
}: PortableTextProps) {
  // CONSTANTS
  const isGuide = variant === "guide";
  const headingIds = new Map<string, number>();
  const bodyClass = isGuide
    ? "text-[17px] leading-[1.9] text-[#374151]"
    : "text-base text-lightGray leading-relaxed";
  const listTextClass = isGuide
    ? "text-[17px] leading-[1.8] text-[#374151]"
    : "text-base text-lightGray leading-relaxed";

  if (!blocks || blocks.length === 0) return null;

  // FUNCTIONS
  /** Render a single non-list block to a node. */
  function renderBlock(block: PortableTextBlock): ReactNode {
    const text = renderChildren(block);

    switch (block.style) {
      case "h2":
        return (
          <h2
            id={getHeadingId(plainText(block), headingIds)}
            className="mb-3 scroll-mt-28 text-xl font-bold text-darkerGray md:text-2xl"
          >
            {text}
          </h2>
        );
      case "h3":
        return (
          <h3
            id={getHeadingId(plainText(block), headingIds)}
            className={`scroll-mt-28 text-lg font-bold text-darkerGray md:text-xl ${
              isGuide ? "mb-0.5" : "mb-2"
            }`}
          >
            {text}
          </h3>
        );
      case "h4":
        return (
          <h4
            id={getHeadingId(plainText(block), headingIds)}
            className={`scroll-mt-28 text-base font-semibold text-darkerGray md:text-lg ${
              isGuide ? "mb-0.5" : "mb-2"
            }`}
          >
            {text}
          </h4>
        );
      case "blockquote":
        return (
          <blockquote className="rounded-r-lg border-l-4 border-primaryOrange bg-primaryOrange/5 py-2 pl-4 italic text-lightGray">
            {text}
          </blockquote>
        );
      default:
        return <p className={bodyClass}>{text}</p>;
    }
  }

  /**
   * Walk the blocks once, grouping consecutive `listItem` blocks of the
   * same kind into a single <ul>/<ol>, and rendering everything else
   * inline. Returns an array of keyed nodes.
   */
  function renderAll(): RenderedBlock[] {
    const out: RenderedBlock[] = [];
    let i = 0;
    let firstDone = false;
    let prevWasHeading = false;

    // Top margin for a block's wrapper: large space *before* a heading,
    // a tight gap *after* a heading, normal rhythm everywhere else.
    const marginFor = (block: PortableTextBlock): string => {
      if (!firstDone) return "";
      if (block.style === "h2") return "mt-8";
      if (block.style === "h3") return "mt-6";
      if (block.style === "h4") return "mt-4";
      return prevWasHeading ? (isGuide ? "mt-1.5" : "mt-2") : "mt-5";
    };

    while (i < blocks.length) {
      const block = blocks[i];

      if (block._type !== "block") {
        i += 1;
        continue;
      }

      // Group a run of list items of the same listItem kind.
      if (block.listItem === "bullet" || block.listItem === "number") {
        const kind = block.listItem;
        const listBlock = block;
        const items: PortableTextBlock[] = [];
        while (
          i < blocks.length &&
          blocks[i]._type === "block" &&
          blocks[i].listItem === kind
        ) {
          items.push(blocks[i]);
          i += 1;
        }

        const ListTag = kind === "number" ? "ol" : "ul";
        const listClass =
          kind === "number"
            ? "list-decimal space-y-2 pl-6 marker:font-semibold marker:text-primaryOrange"
            : "list-disc space-y-2 pl-6 marker:text-primaryOrange";

        out.push({
          key: listBlock._key,
          mt: marginFor(listBlock),
          node: (
            <ListTag className={listClass}>
              {items.map((item) => (
                <li key={item._key} className={listTextClass}>
                  {renderChildren(item)}
                </li>
              ))}
            </ListTag>
          ),
        });
        firstDone = true;
        prevWasHeading = false;
        continue;
      }

      out.push({
        key: block._key,
        mt: marginFor(block),
        node: renderBlock(block),
      });
      firstDone = true;
      prevWasHeading =
        block.style === "h2" || block.style === "h3" || block.style === "h4";
      i += 1;
    }

    return out;
  }

  return (
    <div className="portable-text">
      {renderAll().map(({ key, node, mt }) => (
        <div key={key} className={mt}>
          {node}
        </div>
      ))}
    </div>
  );
}
