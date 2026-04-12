"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

// ─── Constants ───
const AHREFS_KEY = "mMapwn0RAf7ZHLUpNCIWiQ";
const AHREFS_SCRIPT_URL = "https://analytics.ahrefs.com/analytics.js";

// ─── Page category mapping for data-prop segmentation ───
function getPageCategory(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/unlimited")) return "pricing";
  if (pathname.startsWith("/checkout")) return "checkout";
  if (pathname.startsWith("/unternehmen")) return "b2b";
  if (pathname.startsWith("/schulen")) return "b2b";
  if (pathname.startsWith("/bildungshaus")) return "b2b";
  if (pathname.startsWith("/magazin")) return "content";
  if (pathname.startsWith("/ratgeber")) return "content";
  if (pathname.startsWith("/news")) return "content";
  if (pathname.startsWith("/finanzrechner")) return "tools";
  if (pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/ueber-uns")) return "about";
  if (pathname.startsWith("/kontakt")) return "contact";
  if (pathname.startsWith("/faq")) return "support";
  if (pathname.startsWith("/registrierung") || pathname.startsWith("/onboarding")) return "signup";
  if (pathname.startsWith("/login")) return "login";
  // Content categories (guide articles)
  if (pathname.startsWith("/finanzen-fuer-") || pathname.startsWith("/investieren-")) return "content";
  return "other";
}

function getPageType(pathname: string): string {
  if (pathname === "/") return "landing";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1) return "category";
  if (segments.length >= 2) return "article";
  return "page";
}

// ─── Ahrefs JS API helpers ───
declare global {
  interface Window {
    ahrefs?: {
      track: (eventName: string, properties?: Record<string, string>) => void;
    };
  }
}

/**
 * Track a custom event in Ahrefs Web Analytics.
 * Can be called from anywhere in the app.
 */
export function trackAhrefsEvent(
  eventName: string,
  properties?: Record<string, string>,
) {
  if (typeof window !== "undefined" && window.ahrefs) {
    window.ahrefs.track(eventName, properties);
  }
}

// ─── Predefined event trackers ───

/** Track CTA button clicks */
export function trackCtaClick(ctaName: string, location: string) {
  trackAhrefsEvent("cta_click", { cta: ctaName, location });
}

/** Track pricing plan selection */
export function trackPricingClick(plan: string) {
  trackAhrefsEvent("pricing_click", { plan });
}

/** Track app download link clicks */
export function trackDownloadClick(platform: string) {
  trackAhrefsEvent("download_click", { platform });
}

/** Track newsletter signup */
export function trackNewsletterSignup() {
  trackAhrefsEvent("newsletter_signup");
}

/** Track contact form submission */
export function trackContactSubmit() {
  trackAhrefsEvent("contact_submit");
}

/** Track registration start */
export function trackRegistrationStart() {
  trackAhrefsEvent("registration_start");
}

/** Track demo booking click */
export function trackDemoBooking(target: string) {
  trackAhrefsEvent("demo_booking", { target });
}

/** Track shop add to cart */
export function trackAddToCart(product: string) {
  trackAhrefsEvent("add_to_cart", { product });
}

/** Track Bea AI chat interaction */
export function trackBeaChatInteraction() {
  trackAhrefsEvent("bea_chat_interaction");
}

/** Track scroll depth milestones */
export function trackScrollDepth(depth: string) {
  trackAhrefsEvent("scroll_depth", { depth });
}

// ─── Component ───
export default function AhrefsAnalytics() {
  const pathname = usePathname();

  // Load the Ahrefs script with correct data attributes
  const loadAhrefsScript = useCallback(() => {
    // Check cookie consent
    try {
      const consent = JSON.parse(
        localStorage.getItem("cookieConsent") || "{}",
      );
      if (!consent?.preferences?.analytics) return;
    } catch {
      return;
    }

    // Don't load twice
    if (document.querySelector(`script[data-key="${AHREFS_KEY}"]`)) return;

    const script = document.createElement("script");
    script.src = AHREFS_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    // ── Core attribute ──
    script.dataset.key = AHREFS_KEY;

    // ── Custom properties for segmentation in Ahrefs Dashboard ──
    // These appear on every pageview and can be used for filtering/funnels
    const category = getPageCategory(pathname);
    const pageType = getPageType(pathname);
    script.dataset.propPagecategory = category;
    script.dataset.propPagetype = pageType;
    script.dataset.propLocale = document.documentElement.lang || "de";
    script.dataset.propPlatform = "web";

    document.head.appendChild(script);
  }, [pathname]);

  // Initialize on mount
  useEffect(() => {
    loadAhrefsScript();
  }, [loadAhrefsScript]);

  // Update custom properties on route change (SPA navigation)
  useEffect(() => {
    const existingScript = document.querySelector(
      `script[data-key="${AHREFS_KEY}"]`,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      const category = getPageCategory(pathname);
      const pageType = getPageType(pathname);
      existingScript.dataset.propPagecategory = category;
      existingScript.dataset.propPagetype = pageType;
    }
  }, [pathname]);

  // ── Scroll depth tracking ──
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const reached = new Set<number>();

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackScrollDepth(`${threshold}%`);
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // ── Auto-track outbound link clicks via CSS classes ──
  // Ahrefs auto-tracks outbound links & form submissions natively.
  // We add CSS classes for custom events on key interactive elements.
  useEffect(() => {
    // Track clicks on elements with data-ahrefs-event attribute
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-ahrefs-event]");
      if (!target) return;

      const eventName = target.getAttribute("data-ahrefs-event") || "";
      const eventProps: Record<string, string> = {};

      // Collect all data-ahrefs-prop-* attributes
      for (const attr of Array.from(target.attributes)) {
        if (attr.name.startsWith("data-ahrefs-prop-")) {
          const propName = attr.name.replace("data-ahrefs-prop-", "");
          eventProps[propName] = attr.value;
        }
      }

      trackAhrefsEvent(eventName, eventProps);
    }

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null; // This is a tracking-only component, no UI
}
