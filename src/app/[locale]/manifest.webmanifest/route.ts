type RouteContext = {
  params: Promise<{ locale: string }>;
};

export async function GET(_: Request, { params }: RouteContext): Promise<Response> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const manifest = {
    name: isArabic
      ? "Sakinah Streams | تلاوات قرآنية خاشعة"
      : "Sakinah Streams | Peaceful Quran Recitations",
    short_name: "Sakinah Streams",
    description: isArabic
      ? "استمع لتلاوات القرآن الكريم بجودة عالية تبعث السكينة والطمأنينة في قلبك."
      : "Listen to the Holy Quran recited beautifully to bring calm and spiritual peace to your day.",
    start_url: `/${locale}`,
    scope: `/${locale}`,
    lang: locale,
    dir: isArabic ? "rtl" : "ltr",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#7c3aed",
    background_color: "#f3f4f6",
    icons: [
      {
        src: "/icons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/icon-70x70.png",
        sizes: "70x70",
        type: "image/png",
      },
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icons/icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/icon-150x150.png",
        sizes: "150x150",
        type: "image/png",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "/icons/icon-167x167.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        src: "/icons/icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-310x310.png",
        sizes: "310x310",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
