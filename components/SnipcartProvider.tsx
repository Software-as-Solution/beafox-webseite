"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function SnipcartProvider() {
  useEffect(() => {
    // Stelle sicher, dass das Snipcart-DIV nur einmal erstellt wird
    if (typeof window !== "undefined") {
      // Prüfe, ob Snipcart-DIV bereits existiert
      let snipcartDiv = document.getElementById("snipcart");

      if (!snipcartDiv) {
        // Erstelle das DIV nur wenn es nicht existiert
        snipcartDiv = document.createElement("div");
        snipcartDiv.id = "snipcart";
        snipcartDiv.setAttribute(
          "data-api-key",
          process.env.NEXT_PUBLIC_SNIPCART_API_KEY || ""
        );
        snipcartDiv.setAttribute("data-config-modal-style", "side");
        snipcartDiv.setAttribute("data-config-add-product-behavior", "none");
        // Stripe-spezifische Konfiguration (optional)
        // Snipcart verwendet automatisch die Stripe-Konfiguration aus dem Dashboard
        document.body.appendChild(snipcartDiv);
      }

      // Cleanup: Entferne das DIV nicht beim Unmount, da Snipcart es benötigt
      return () => {
        // Snipcart-DIV sollte nicht entfernt werden, da es persistent sein muss
        // Snipcart verwaltet das DOM selbst
      };
    }
  }, []);

  useEffect(() => {
    // Füge CSS-Link zum Head hinzu
    if (typeof document !== "undefined") {
      const linkId = "snipcart-css";
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href =
          "https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.css";
        document.head.appendChild(link);
      }
    }
  }, []);

  return (
    <>
      {/* Snipcart JavaScript */}
      <Script
        src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Snipcart ist geladen
          if (typeof window !== "undefined" && (window as any).Snipcart) {
            console.log("Snipcart loaded successfully");
          }
        }}
        onError={(e) => {
          console.error("Snipcart failed to load:", e);
        }}
      />
    </>
  );
}
