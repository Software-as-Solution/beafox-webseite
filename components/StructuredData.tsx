import { useMemo } from "react";

// TYPES
type JsonLdData = Record<string, unknown>;
interface StructuredDataProps {
  id?: string;
  data: JsonLdData;
}

// ─── Component ───
/**
 * Renders a JSON-LD structured data script tag.
 *
 * Works as a Server Component — no useEffect, no DOM manipulation.
 * Safe to use multiple times on the same page (each gets its own script tag).
 *
 * @example
 * <StructuredData
 *   id="organization"
 *   data={{
 *     "@context": "https://schema.org",
 *     "@type": "Organization",
 *     name: "BeAFox",
 *   }}
 * />
 */
export default function StructuredData({ data, id }: StructuredDataProps) {
  // Stable serialization — only recompute when data changes
  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(data);
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.error("[StructuredData] Failed to serialize data:", data);
      }
      return null;
    }
  }, [data]);

  if (!jsonString) return null;

  return (
    <script
      type="application/ld+json"
      id={id ? `structured-data-${id}` : undefined}
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
