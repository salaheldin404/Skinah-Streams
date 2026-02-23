"use client";

import useScrollDirection from "@/hooks/useScrollDirection";
import { toArabicNumber } from "@/lib/utils/surah";
import { Surah } from "@/types/surah";
import { CurrentVerseLocation } from "@/types/verse";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import Setting from "../header/Setting";

interface SurahTopBarProps {
  surah: Surah;
  currentVerseLocation: CurrentVerseLocation;
}
const SurahTopBar = ({ surah, currentVerseLocation }: SurahTopBarProps) => {
  const t = useTranslations("SurahPage");
  const locale = useLocale();
  const scrollDirection = useScrollDirection();

  const formattedLocation = useMemo(() => {
    // Helper to format a single number based on the current locale.
    const formatNumber = (num: number | null) => {
      if (num === null) return null;
      return locale === "ar" ? toArabicNumber(num) : num;
    };

    return {
      juz: formatNumber(currentVerseLocation.juz_number),
      hizb: formatNumber(currentVerseLocation.hizb_number),
      page: formatNumber(currentVerseLocation.page_number),
    };
  }, [currentVerseLocation, locale]);

  if (!surah || !formattedLocation.page) {
    return null;
  }
  return (
    <div
      className={` fixed z-40 border-t ${
        scrollDirection === "down" ? "top-0" : "top-14 sm:top-16 md:top-[70px]"
      }  left-0 w-full h-[40px] shadow-md bg-white dark:bg-muted  transition-all `}
    >
      <div className="main-container h-full flex justify-between items-center">
        <h1 className="text-lg ">
          {locale === "ar" ? surah.shortName : surah.englishName}
        </h1>
        <div className="flex items-center gap-2">
          <p>
            {t("juz")} {formattedLocation.juz} /
          </p>
          <p>
            {t("hizb")} {formattedLocation.hizb} /
          </p>
          <p>
            {t("page")} {formattedLocation.page}
          </p>
        </div>
        <Setting />
      </div>
    </div>
  );
};

export default SurahTopBar;
