import { Metadata } from "next";
import FeaturedSurahs from "@/components/home/FeaturedSurahs";
import QuickAccess from "@/components/home/quickAccess/index";
import RecentlyPlayed from "@/components/home/RecentlyPlayed";
import Reciters from "@/components/home/Reciters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "الرئيسية - تلاوات قرآنية خاشعة"
    : "Home - Soulful Quran Recitations";

  const description = isArabic
    ? "استمع لتلاوات القرآن الكريم بجودة عالية تبعث السكينة والطمأنينة في قلبك. اختر من بين مجموعة واسعة من القراء والسور."
    : "Listen to high-quality Quran recitations that bring tranquility to your heart. Choose from a wide range of reciters and surahs.";

  const keywords = isArabic
    ? [
        "القرآن الكريم",
        "تلاوات قرآنية",
        "استماع للقرآن",
        "قراء القرآن",
        "سور القرآن",
        "تلاوة خاشعة",
        "سكينة ستريمز",
      ].join(", ")
    : [
        "Holy Quran",
        "Quran Recitations",
        "Listen to Quran",
        "Quran Reciters",
        "Quran Surahs",
        "Soulful Recitation",
        "Sakinah Streams",
      ].join(", ");

  const canonical = isArabic ? "/ar" : "/en";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Sakinah Streams",
      type: "website",
      locale: isArabic ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const baseUrl = "https://skinah-streams.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sakinah Streams",
    alternateName: isArabic ? "سكينة ستريمز" : "Sakinah Streams",
    url: baseUrl,
    description: isArabic
      ? "استمع لتلاوات القرآن الكريم بجودة عالية تبعث السكينة والطمأنينة في قلبك."
      : "Listen to high-quality Quran recitations that bring tranquility to your heart.",
    inLanguage: isArabic ? "ar" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${locale}/surahs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Sakinah Streams",
      url: baseUrl,
    },
    sameAs: [],
  };

  return (
    <div className="bg-ground ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="">
        {/* quick access */}
        <QuickAccess />

        {/* Featured Surahs */}
        <FeaturedSurahs />
        <Reciters />
        <RecentlyPlayed />
      </main>
    </div>
  );
}
