import { Metadata } from "next";
import RadiosClientPage from "./_components/RadiosClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === "ar") {
    return {
      title: "راديو القرآن الكريم",
      description:
        "استمع إلى راديو القرآن الكريم مباشر من سكينة ستريمز. مجموعة واسعة من المحطات الإذاعية القرآنية بمختلف القراء والتلاوات.",
      keywords: [
        "راديو قرآن",
        "راديو القرآن الكريم",
        "استماع مباشر",
        "محطات قرآنية",
        "إذاعة قرآن",
        "تلاوات مباشرة",
        "سكينة ستريمز",
      ].join(", "),
      alternates: {
        canonical: `/${locale}/radios`,
        languages: {
          en: `/en/radios`,
          ar: `/ar/radios`,
        },
      },
      openGraph: {
        title: "راديو القرآن الكريم",
        description:
          "استمع إلى راديو القرآن الكريم مباشر بمختلف المحطات والقراء",
        url: `/${locale}/radios`,
        siteName: "Sakinah Streams",
        type: "website",
      },
    };
  }

  return {
    title: "Quran Radio Stations",
    description:
      "Listen to live Quran radio stations on Sakinah Streams. Wide range of Islamic radio channels with various reciters and recitations.",
    keywords: [
      "quran radio",
      "islamic radio",
      "live quran",
      "radio stations",
      "quran streaming",
      "islamic channels",
      "Sakinah Streams",
    ].join(", "),
    alternates: {
      canonical: `/en/radios`,
      languages: {
        en: `/en/radios`,
        ar: `/ar/radios`,
      },
    },
    openGraph: {
      title: "Quran Radio Stations",
      description:
        "Listen to live Quran radio stations with various channels and reciters",
      url: `/en/radios`,
      siteName: "Sakinah Streams",
      type: "website",
    },
  };
}

const RadiosPage = () => {
  return <RadiosClientPage />;
};

export default RadiosPage;
