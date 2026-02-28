const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wow.zamimg.com",
        pathname: "/images/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Serve empty bone files (don't exist on wrath CDN, crash viewer)
        source: "/modelviewer/:env/bone/:id.bone",
        destination: "/api/modelviewer/bone/:id",
      },
      {
        source: "/modelviewer/:path*",
        destination: "https://wow.zamimg.com/modelviewer/:path*",
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
