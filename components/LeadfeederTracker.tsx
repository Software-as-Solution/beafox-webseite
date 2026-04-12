"use client";

import { useEffect } from "react";

// ─── Leadfeeder (Dealfront) Website Tracker ───
// Identifiziert B2B-Besucher auf Firmenebene.
// Tracker-ID: ywVkO4XJ9KW8Z6Bj
const LEADFEEDER_ID = "ywVkO4XJ9KW8Z6Bj";

export default function LeadfeederTracker() {
  useEffect(() => {
    // Check cookie consent before loading
    try {
      const consent = JSON.parse(
        localStorage.getItem("cookieConsent") || "{}",
      );
      if (!consent?.preferences?.analytics) return;
    } catch {
      return;
    }

    // Don't load twice
    if (
      document.querySelector(
        `script[src*="lftracker_v1_${LEADFEEDER_ID}"]`,
      )
    )
      return;

    // Initialize Leadfeeder queue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ldfdr =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ldfdr ||
      function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-rest-params
        (((window as any).ldfdr._q =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).ldfdr._q || []) as unknown[]).push(
          [].slice.call(arguments),
        );
      };

    // Load the tracker script
    const firstScript = document.getElementsByTagName("script")[0];
    const trackerScript = document.createElement("script");
    trackerScript.src = `https://sc.lfeeder.com/lftracker_v1_${LEADFEEDER_ID}.js`;
    trackerScript.async = true;
    firstScript.parentNode?.insertBefore(trackerScript, firstScript);
  }, []);

  return null;
}
