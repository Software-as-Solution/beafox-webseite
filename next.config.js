const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["beafox.app"],
  },
  async redirects() {
    return [
      {
        source: "/ios",
        destination: "https://apps.apple.com/app/id6746110612",
        permanent: false,
      },
      {
        source: "/android",
        destination:
          "https://play.google.com/store/apps/details?id=com.tapelea.beafox",
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);