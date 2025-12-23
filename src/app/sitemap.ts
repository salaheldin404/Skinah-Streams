import { MetadataRoute } from "next";
import surahData from "@/data/all-quran-surah.json";

const BASE_URL = process.env.SITE_URL || "https://sakinah-streams.vercel.app";

const locales = ["ar", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const surahs = surahData.data;

  // Static pages for each locale
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/${locale}/surahs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${locale}/reciters`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${locale}/radios`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${locale}/hisn-muslim`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  // Surah detail pages for each locale
  const surahPages = locales.flatMap((locale) =>
    surahs.map((surah) => ({
      url: `${BASE_URL}/${locale}/surahs/${surah.number}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...surahPages];
}
