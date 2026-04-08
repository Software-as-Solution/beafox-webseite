"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  text?: string;
  children?: any[];
  [key: string]: any;
}

interface WissenPortableTextProps {
  blocks: PortableTextBlock[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function renderText(text: string, marks?: any[]): React.ReactNode {
  if (!marks || marks.length === 0) {
    return text;
  }

  let result: any = text;

  marks.forEach((mark) => {
    if (mark._type === "strong") {
      result = <strong>{result}</strong>;
    } else if (mark._type === "em") {
      result = <em>{result}</em>;
    } else if (mark._type === "underline") {
      result = <u>{result}</u>;
    } else if (mark._type === "code") {
      result = (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">
          {result}
        </code>
      );
    } else if (mark._type === "link") {
      const href = mark.href;
      result = (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primaryOrange hover:text-orange-600 underline transition-colors"
        >
          {result}
        </a>
      );
    } else if (mark._type === "highlight") {
      result = <mark className="bg-yellow-100">{result}</mark>;
    }
  });

  return result;
}

function renderChildren(children?: any[]): React.ReactNode {
  if (!children) return null;

  return children.map((child, idx) => {
    if (typeof child === "string") {
      return child;
    }

    if (child._type === "span") {
      return (
        <React.Fragment key={idx}>
          {renderText(child.text, child.marks)}
        </React.Fragment>
      );
    }

    return null;
  });
}

function renderHeading(
  block: PortableTextBlock,
  level: number
): React.ReactNode {
  const text = block.children?.map((child) => child.text).join("") || "";
  const id = slugify(text);
  const className =
    level === 2
      ? "text-2xl md:text-3xl font-bold text-darkerGray mt-10 mb-4"
      : "text-xl md:text-2xl font-semibold text-darkerGray mt-8 mb-3";

  const headingTag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return React.createElement(
    headingTag,
    { key: block._key, className, id },
    renderChildren(block.children)
  );
}

function renderCallout(block: PortableTextBlock): React.ReactNode {
  const calloutType = block.calloutType || "info";

  const config: Record<
    string,
    {
      bgColor: string;
      borderColor: string;
      textColor: string;
      icon: React.ReactNode;
      label: string;
    }
  > = {
    tip: {
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-900",
      icon: <CheckCircle2 size={20} className="text-green-500" />,
      label: "Tipp",
    },
    warning: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-900",
      icon: <AlertTriangle size={20} className="text-red-500" />,
      label: "Warnung",
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-900",
      icon: <Info size={20} className="text-blue-500" />,
      label: "Info",
    },
    stat: {
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-900",
      icon: <TrendingUp size={20} className="text-orange-500" />,
      label: "Statistik",
    },
  };

  const cfg = config[calloutType] || config.info;

  return (
    <div
      key={block._key}
      className={`${cfg.bgColor} border-l-4 ${cfg.borderColor} p-4 rounded-r-lg my-6 flex gap-4`}
    >
      <div className="flex-shrink-0">{cfg.icon}</div>
      <div className="flex-1">
        {block.title && (
          <p className={`font-semibold ${cfg.textColor} mb-2`}>
            {block.title}
          </p>
        )}
        <p className={`text-base ${cfg.textColor} leading-relaxed`}>
          {block.text}
        </p>
      </div>
    </div>
  );
}

function renderCtaBanner(block: PortableTextBlock): React.ReactNode {
  return (
    <div
      key={block._key}
      className="bg-darkerGray text-white rounded-xl p-8 my-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex-1">
        {block.heading && (
          <h3 className="text-xl font-bold mb-2">{block.heading}</h3>
        )}
        {block.text && <p className="text-base leading-relaxed">{block.text}</p>}
      </div>
      {block.buttonUrl && (
        <a
          href={block.buttonUrl}
          target={block.buttonOpenNewTab ? "_blank" : "_self"}
          rel={block.buttonOpenNewTab ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center px-6 py-3 bg-primaryOrange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
        >
          {block.buttonText || "Mehr erfahren"}
        </a>
      )}
    </div>
  );
}

function renderYoutubeEmbed(block: PortableTextBlock): React.ReactNode {
  let videoId = block.youtubeUrl || "";

  // Extract video ID from various YouTube URL formats
  if (videoId.includes("youtube.com/watch?v=")) {
    videoId = videoId.split("v=")[1]?.split("&")[0] || "";
  } else if (videoId.includes("youtu.be/")) {
    videoId = videoId.split("youtu.be/")[1]?.split("?")[0] || "";
  }

  if (!videoId) return null;

  return (
    <div key={block._key} className="my-8">
      <div className="relative w-full bg-gray-900 rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Video"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {block.caption && (
        <p className="text-sm text-lightGray mt-3 text-center italic">
          {block.caption}
        </p>
      )}
    </div>
  );
}

function renderDataTable(block: PortableTextBlock): React.ReactNode {
  const { rows = [], headers = [] } = block;

  if (!rows || rows.length === 0) return null;

  return (
    <div
      key={block._key}
      className="my-8 overflow-x-auto rounded-xl border border-gray-200"
    >
      <table className="w-full text-left text-sm">
        {headers && headers.length > 0 && (
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header: string, idx: number) => (
                <th
                  key={idx}
                  className="px-6 py-4 font-semibold text-darkerGray text-base"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row: any, ridx: number) => (
            <tr key={ridx} className="border-b border-gray-200 hover:bg-gray-50">
              {(Array.isArray(row) ? row : Object.values(row)).map(
                (cell: any, cidx: number) => (
                  <td
                    key={cidx}
                    className="px-6 py-4 text-lightGray leading-relaxed"
                  >
                    {typeof cell === "string" ? cell : JSON.stringify(cell)}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderList(block: PortableTextBlock): React.ReactNode {
  const { children = [], listType = "bullet" } = block;

  if (!children || children.length === 0) return null;

  const Tag = listType === "number" ? "ol" : "ul";

  return (
    <Tag
      key={block._key}
      className={`my-6 pl-6 text-base text-lightGray leading-relaxed space-y-2 ${
        listType === "number" ? "list-decimal" : "list-disc"
      }`}
    >
      {children.map((item: any, idx: number) => (
        <li key={idx}>{renderChildren(item.children)}</li>
      ))}
    </Tag>
  );
}

function renderImage(block: PortableTextBlock): React.ReactNode {
  if (!block.asset?.url) return null;

  return (
    <figure key={block._key} className="my-8">
      <div className="relative w-full bg-gray-200 rounded-xl overflow-hidden">
        <Image
          src={block.asset.url}
          alt={block.alt || "Article image"}
          width={800}
          height={600}
          className="w-full h-auto"
        />
      </div>
      {block.caption && (
        <figcaption className="text-sm text-lightGray mt-3 text-center italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function renderParagraph(block: PortableTextBlock): React.ReactNode {
  const text = block.children?.map((child) => child.text).join("") || "";

  // Skip empty paragraphs
  if (!text || text.trim() === "") return null;

  return (
    <p
      key={block._key}
      className="text-base text-lightGray leading-relaxed mb-4"
    >
      {renderChildren(block.children)}
    </p>
  );
}

function renderBlockquote(block: PortableTextBlock): React.ReactNode {
  return (
    <blockquote
      key={block._key}
      className="my-6 pl-6 border-l-4 border-gray-300 text-lg text-darkerGray italic font-medium leading-relaxed"
    >
      {renderChildren(block.children)}
    </blockquote>
  );
}

export default function WissenPortableText({
  blocks,
}: WissenPortableTextProps): React.ReactNode {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="prose prose-lg max-w-none prose-a:text-primaryOrange prose-a:no-underline hover:prose-a:text-orange-600">
      {blocks.map((block) => {
        if (!block._type) return null;

        switch (block._type) {
          case "h2":
            return renderHeading(block, 2);

          case "h3":
            return renderHeading(block, 3);

          case "h4":
            return renderHeading(block, 4);

          case "normal":
            return renderParagraph(block);

          case "blockquote":
            return renderBlockquote(block);

          case "image":
            return renderImage(block);

          case "callout":
            return renderCallout(block);

          case "ctaBanner":
            return renderCtaBanner(block);

          case "youtubeEmbed":
            return renderYoutubeEmbed(block);

          case "dataTable":
            return renderDataTable(block);

          case "ul":
          case "ol":
            return renderList(block);

          default:
            // Fallback for unknown block types
            return null;
        }
      })}
    </div>
  );
}
