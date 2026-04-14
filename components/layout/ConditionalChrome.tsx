"use client";

// ─────────────────────────────────────────────────────────────
// ConditionalChrome — Route-basierter Shell-Switch
// ─────────────────────────────────────────────────────────────
// Die Bea-AI-Page läuft als Standalone-App (ähnlich ChatGPT-Webbrowser):
// kein Marketing-Header, kein Footer, kein äußeres Scroll-Verhalten.
// Für alle anderen Pages wird die normale Website-Chrome gerendert.
//
// Die Entscheidung passiert client-seitig via `usePathname`.
// `ShopCartProvider` wird im Root-Layout eine Ebene höher gewrappt,
// damit der Context auch auf Bea-AI verfügbar bleibt, falls später
// dort Shop-Elemente auftauchen.
// ─────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopCart from "@/components/ShopCart";

// CONSTANTS
const STANDALONE_PREFIXES = ["/bea-ai"] as const;

function isStandaloneRoute(pathname: string): boolean {
  return STANDALONE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function ConditionalChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const standalone = isStandaloneRoute(pathname);

  if (standalone) {
    // Fullscreen-Standalone-Layout. Keine Header/Footer, kein äußerer
    // Scroll-Container. Die Page darf ihre eigene h-dvh-Höhe setzen.
    return (
      <div id="main-content" className="h-dvh overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primaryOrange focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Zum Inhalt springen
      </a>
      <Header />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <ShopCart />
      <Footer />
    </>
  );
}
