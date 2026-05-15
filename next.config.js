const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

// CONSTANTS
const RATGEBER_CATEGORY_SOURCE =
  "schueler|azubis|studenten|berufseinsteiger|lebenssituation|investieren";

// ─── Security Headers ───
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beafox.app",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // ── URL-Restructure 2026 ──
      { source: "/beafox-unlimited", destination: "/unlimited", permanent: true },
      { source: "/fuer-unternehmen", destination: "/unternehmen", permanent: true },
      { source: "/fuer-schulen", destination: "/schulen", permanent: true },
      { source: "/fuer-clubs", destination: "/schulen", permanent: true },
      { source: "/app-updates", destination: "/updates", permanent: true },
      { source: "/vhs", destination: "/bildungshaus", permanent: true },
      { source: "/vhs/:path*", destination: "/bildungshaus/:path*", permanent: true },

      // ── Ratgeber: alte /ratgeber/kategorie/slug → /kategorie/slug ──
      {
        source: `/ratgeber/:kategorie(${RATGEBER_CATEGORY_SOURCE})/:slug`,
        destination: "/:kategorie/:slug",
        permanent: true,
      },
      {
        source: `/ratgeber/:kategorie(${RATGEBER_CATEGORY_SOURCE})`,
        destination: "/:kategorie",
        permanent: true,
      },

      // ── Legacy /news/kategorie/slug → /kategorie/slug ──
      {
        source: `/news/:kategorie(${RATGEBER_CATEGORY_SOURCE})/:slug`,
        destination: "/:kategorie/:slug",
        permanent: true,
      },

      // ── Community-Richtlinien: alte /guidelines → kanonisch ──
      { source: "/guidelines", destination: "/community-richtlinien", permanent: true },
      { source: "/guideline", destination: "/community-richtlinien", permanent: true },

      // ── Ratgeber updates → /updates ──
      { source: "/ratgeber/updates", destination: "/updates", permanent: true },

      // ── Wissen → Magazin Rebrand ──
      { source: "/wissen", destination: "/magazin", permanent: true },
      { source: "/wissen/:path*", destination: "/magazin/:path*", permanent: true },

      // ── Legacy /blog → /news ──
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/blog/:path*", destination: "/news/:path*", permanent: true },

      // ── App Store Deep Links (302 — external, nicht cachen) ──
      {
        source: "/ios",
        destination: "https://apps.apple.com/app/id6746110612",
        permanent: false,
      },
      {
        source: "/android",
        destination: "https://play.google.com/store/apps/details?id=com.tapelea.beafox",
        permanent: false,
      },

      // ── Merch / Shop → Shopify (shop.beafox.app) ──
      // Der Merch-Shop läuft als eigenständiger Shopify-Store auf shop.beafox.app.
      // Hinweis: alte Deep-Links (/shop/<slug>) hatten andere Slugs als Shopify
      // (/products/<slug>), deshalb landen Wildcards auf der Produktübersicht.
      // /checkout bleibt bewusst lokal — es ist die Subscription-Checkout-Seite
      // (Monats-/Jahresabo, Lifetime), NICHT der Merch-Checkout.
      { source: "/shop", destination: "https://shop.beafox.app", permanent: true },
      { source: "/shop/:path*", destination: "https://shop.beafox.app/collections/all", permanent: true },
    ];
  },
};

module.exports = withNextIntl(nextConfig);