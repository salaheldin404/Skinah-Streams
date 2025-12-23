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

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: isArabic ? `/ar/reciters` : `/en/reciters`,
      languages: {
        en: `/en/reciters`,
        ar: `/ar/reciters`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/${locale}/reciters`,
      siteName: "Sakinah Streams",
    },
  };
}

const RecitersPage = () => {
  return <RecitersClientPage />;
};

export default RecitersPage;
