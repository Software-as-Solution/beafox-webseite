const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

// CONSTANTS
/** Kurz-URLs → kanonische Kategorie-Slugs */
const ratgeberShortToFull = [
  ["schueler", "finanzen-fuer-schueler"],
  ["azubis", "finanzen-fuer-azubis"],
  ["studenten", "finanzen-fuer-studenten"],
  ["berufseinsteiger", "finanzen-fuer-berufseinsteiger"],
  ["lebenssituationen", "finanzen-bei-lebensereignissen"],
  ["investieren", "investieren-fuer-anfaenger"],
];

const RATGEBER_CATEGORY_SOURCE =
  "finanzen-fuer-schueler|finanzen-fuer-azubis|finanzen-fuer-studenten|finanzen-fuer-berufseinsteiger|finanzen-bei-lebensereignissen|investieren-fuer-anfaenger";

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
    // Ratgeber short → full slug redirects (direkt auf Root-Level)
    const ratgeberShortRedirects = [];
    for (const [shortSlug, fullSlug] of ratgeberShortToFull) {
      ratgeberShortRedirects.push(
        {
          source: `/${shortSlug}`,
          destination: `/${fullSlug}`,
          permanent: true,
        },
        {
          source: `/${shortSlug}/:slug`,
          destination: `/${fullSlug}/:slug`,
          permanent: true,
        },
        // Alte /ratgeber/ Kurzlinks
        {
          source: `/ratgeber/${shortSlug}`,
          destination: `/${fullSlug}`,
          permanent: true,
        },
        {
          source: `/ratgeber/${shortSlug}/:slug`,
          destination: `/${fullSlug}/:slug`,
          permanent: true,
        },
      );
    }

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

      // ── Ratgeber Kurzlinks ──
      ...ratgeberShortRedirects,

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
    ];
  },
};

module.exports = withNextIntl(nextConfig);