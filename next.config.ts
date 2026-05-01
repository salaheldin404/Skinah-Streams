import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const CACHE_NAMES = {
  surahContent: "surah-content-v4",
  rsc: "rsc-payload-cache",
  nextImage: "next-image-cache",
  externalImage: "external-image-cache",
  userData: "dynamic-user-data",
  fontCss: "google-fonts-stylesheets",
  fontFiles: "google-fonts-webfonts",
  appShell: "next-static-assets",
  pages: "pages-cache",
  contentApi: "content-api-cache",
} as const;

const nextIntlPlugin = createNextIntlPlugin();
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  customWorkerDest: "public",
  customWorkerSrc: "src/worker",

  fallbacks: {
    document: "/ar/offline",
  },
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  extendDefaultRuntimeCaching: false,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    exclude: [
      /middleware-manifest\.json$/,
      /_app-build-manifest\.json$/,
      /.*\/@.*\/.*/i, // Ignores chunks from parallel/intercepting routes
      /\.(mp3|ogg|wav|aac|m4a|webm)$/i,
      /_next\/static\/media\/.*\.(mp3|wav)$/i,
      /^https:\/\/server\d+\.mp3quran\.net\/.*/i,
      /^https:\/\/download\.quranicaudio\.com\/.*\.mp3$/i,
    ],

    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: CACHE_NAMES.pages,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [200],
          },
        },
      },
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: "CacheFirst",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.appShell,
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/v4\/verses\/by_chapter\/.*/i,
        handler: "StaleWhileRevalidate",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.surahContent,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\/api\/v4\/chapter_recitations\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /.*(\?|&)_rsc=.*/i,
        handler: "NetworkFirst",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.rsc,
          expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
          networkTimeoutSeconds: 3,
        },
      },
      {
        urlPattern: /\/_next\/image\?url=.+/i,
        handler: "StaleWhileRevalidate",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.nextImage,
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|webp|gif)$/i,
        handler: "StaleWhileRevalidate",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.externalImage,
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] }, // For external images
        },
      },
      {
        urlPattern: /\/api\/(?:khatma(?:\/.*)?|user\/settings(?:\/.*)?)$/i,
        handler: "NetworkFirst",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.userData,
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 3 * 24 * 60 * 60,
          },
          cacheableResponse: { statuses: [200] },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.fontCss,
          expiration: { maxEntries: 5, maxAgeSeconds: 365 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        method: "GET",
        options: {
          cacheName: CACHE_NAMES.fontFiles,
          expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});

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

export default withPWA(nextIntlPlugin(nextConfig));
