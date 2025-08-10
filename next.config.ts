import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextIntlPlugin = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  async rewrites() {
    return [
      {
        source: "/api/content/:path*",
        destination: "https://mp3quran.net/api/v3/:path*",
      },
      // {
      //   source: "/api/v4/:path*",
      //   destination:
      //     "https://apis-prelive.quran.foundation/content/api/v4/:path*",
      // },
      {
        source: "/api/oauth/oauth2/token",
        destination: "https://prelive-oauth2.quran.foundation/oauth2/token",
      },
      {
        source: "/api/proxy/oauth/token",
        destination: "https://oauth2.quran.foundation",
      },
    ];
  },
};

export default nextIntlPlugin(nextConfig);
