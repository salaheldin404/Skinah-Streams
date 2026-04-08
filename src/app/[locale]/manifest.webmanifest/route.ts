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
        src: "/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
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
