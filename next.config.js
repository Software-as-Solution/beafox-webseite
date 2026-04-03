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

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async redirects() {
    // Ratgeber short → full slug redirects
    const ratgeberRedirects = [];
    for (const [shortSlug, fullSlug] of ratgeberShortToFull) {
      ratgeberRedirects.push(
        {
          source: `/ratgeber/${shortSlug}`,
          destination: `/ratgeber/${fullSlug}`,
          permanent: true,
        },
        {
          source: `/ratgeber/${shortSlug}/:slug`,
          destination: `/ratgeber/${fullSlug}/:slug`,
          permanent: true,
        },
      );
    }

    return [
      // ── URL-Restructure 2026 ──
      { source: "/beafox-unlimited", destination: "/unlimited", permanent: true },
      { source: "/fuer-unternehmen", destination: "/unternehmen", permanent: true },
      { source: "/fuer-schulen", destination: "/schulen", permanent: true },
      { source: "/app-updates", destination: "/updates", permanent: true },
      { source: "/vhs", destination: "/bildungshaus", permanent: true },
      { source: "/vhs/:path*", destination: "/bildungshaus/:path*", permanent: true },

      // ── Ratgeber Kurzlinks ──
      ...ratgeberRedirects,

      // ── Legacy /news/kategorie/slug → /ratgeber ──
      {
        source: `/news/:kategorie(${RATGEBER_CATEGORY_SOURCE})/:slug`,
        destination: "/ratgeber/:kategorie/:slug",
        permanent: true,
      },

      // ── Ratgeber updates → app-updates (old) → /updates (new) ──
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