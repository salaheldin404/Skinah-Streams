import React from "react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import quranData from "@/data/all-quran-surah.json";
import { useTranslations } from "next-intl";
import SurahCard from "../surah/SurahCard";

const FeaturedSurahs = () => {
  const t = useTranslations("FeaturedSurahs");
  const surahs = quranData.data.slice(0, 10);

  return (
    <section className="py-10">
      <div className="main-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <Link href="/surahs">
            <Button
              variant="ghost"
              className="text-sm font-medium text-gray-500 cursor-pointer"
            >
              {t("show-all")}
            </Button>
          </Link>
        </div>

        <div className="grid min-[370px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
          {surahs.map((surah) => (
            <SurahCard surah={surah} key={surah.number} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSurahs;
