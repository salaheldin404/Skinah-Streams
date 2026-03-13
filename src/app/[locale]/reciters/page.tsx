import { Metadata } from "next";
import RecitersClientPage from "./_components/RecitersClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic ? " قرّاء القرآن الكريم" : "Quran Reciters";
  const description = isArabic
    ? "استمع إلى تلاوات القرآن الكريم بأصوات أشهر القراء والمشايخ. اختر من بين مجموعة واسعة من القراء مع تلاوات عالية الجودة."
    : "Listen to Quran recitations by famous reciters and sheikhs. Choose from a wide range of reciters with high-quality recitations.";
  const keywords = isArabic
    ? [
        "القرآن الكريم",
        "قراء القرآن",
        "تلاوات القرآن",
        "مشايخ القرآن",
        "استماع للقرآن",
        "تلاوة عالية الجودة",
        "القرآن الكريم صوتي",
        "القرآن الكريم عبر الإنترنت",
        "القرآن الكريم مجانًا",
        "القرآن الكريم mp3",
      ].join(", ")
    : [
        "Quran",
        "Quran Reciters",
        "Quran Recitations",
        "Quran Sheikhs",
        "Listen to Quran",
        "High-Quality Recitations",
        "Quran Audio",
        "Online Quran",
        "Free Quran",
        "Quran MP3",
      ].join(", ");
  const canonicalPath = `/${locale}/reciters`;
  const ogLocale = isArabic ? "ar_EG" : "en_US";
  const alternateOgLocale = isArabic ? "en_US" : "ar_EG";
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/reciters`,
        ar: `/ar/reciters`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
      url: `/${locale}/reciters`,
      siteName: "Sakinah Streams",
      images: ["/og/reciters.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/reciters.png"],
    },
  };
}

const RecitersPage = () => {
  return <RecitersClientPage />;
};

export default RecitersPage;
