"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations("breadcrumbs");
  const breadcrumbItems = [{ label: t("home"), href: "/" }, ...items];
  const baseUrl = "https://beafox.app";

  // JSON-LD BreadcrumbList Schema
  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `${baseUrl}${item.href}`,
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(breadcrumbSchema);
    script.id = "breadcrumb-schema";

    // Entferne vorheriges Script falls vorhanden
    const existingScript = document.getElementById("breadcrumb-schema");
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("breadcrumb-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [items, breadcrumbItems, baseUrl]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <ol className="flex items-center space-x-2 text-sm text-lightGray">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.href} className="flex items-center">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-primaryOrange transition-colors"
                  aria-label={t("homeAria")}
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mx-2 text-lightGray" />
                  {isLast ? (
                    <span
                      className="text-darkerGray font-medium"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-primaryOrange transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
