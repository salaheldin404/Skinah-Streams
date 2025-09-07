"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import DOMPurify from "dompurify";

import SurahAyahSelectors from "@/components/surah/SurahAyaSelectors";
import TafsirCarousel from "@/components/surah/TafsirCarousel";
import TafsirSkeleton from "@/components/surah/TafsirSkeleton";
import { Button } from "@/components/ui/button";

import { useTafsirSelection } from "@/hooks/useTafsirSelection";

import { useGetTafsirsQuery } from "@/lib/store/features/tafsirsApi";

const TafsirPage = () => {
  const { surahId, verseNumber } = useParams<{
    surahId: string;
    verseNumber: string;
  }>();

  const t = useTranslations("TafsirPage");
  const locale = useLocale();
  const [currentSurahId, setCurrentSurahId] = useState(surahId || "1");
  const [currentVerseNumber, setCurrentVerseNumber] = useState(
    parseInt(verseNumber, 10) || 1
  );

  const { data: tafsirs, isFetching: isTafsirsFetching } = useGetTafsirsQuery(
    {}
  );
  const {
    selectedTafsirId,
    surahs,
    ayahCount,
    ayahKey,
    arabicTafsirs,
    tafsirForAyah,
    isTafsirFetching,
    handleSelectTafsir,
  } = useTafsirSelection({
    initialSurahId: currentSurahId,
    initialVerseNumber: currentVerseNumber,
    allTafsirs: tafsirs,
  });
  const handleSelectSurah = (newSurahId: string) => {
    setCurrentSurahId(newSurahId);
    setCurrentVerseNumber(1);
  };

  const handleSelectAyah = (newAyahNumber: string) => {
    setCurrentVerseNumber(parseInt(newAyahNumber, 10));
  };
  const handleNextAyah = () => {
    setCurrentVerseNumber((prev) => prev + 1);
  };
  const handlePreviousAyah = () => {
    setCurrentVerseNumber((prev) => prev - 1);
  };

  useEffect(() => {
    const newUrl = `/${locale}/tafsir/${currentSurahId}/${currentVerseNumber}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
  }, [currentSurahId, currentVerseNumber, locale]);

  return (
    <main className=" py-10 ">
      <div className="main-container">
        <div className="p-4  rounded-lg bg-card">
          <SurahAyahSelectors
            surahs={surahs}
            selectedSurah={currentSurahId}
            onSelectSurah={handleSelectSurah}
            ayahCount={ayahCount}
            selectedAyah={currentVerseNumber}
            onSelectAyah={handleSelectAyah}
          />
          <TafsirCarousel
            arabicTafsirs={arabicTafsirs}
            onSelectTafsir={handleSelectTafsir}
            selectedTafsirId={selectedTafsirId}
            isTafsirsLoading={isTafsirsFetching}
          />

          {isTafsirFetching ? (
            <TafsirSkeleton />
          ) : (
            <div dir="rtl" className="">
              <div className="pb-6 border-b">
                <p className="font-uthmanic text-2xl">
                  {tafsirForAyah?.verses?.[ayahKey]?.text_qpc_hafs}
                </p>
              </div>
              <div className=" p-4 overflow-y-auto tajwal-text">
                <div
                  className="text-lg leading-8"
                  dangerouslySetInnerHTML={{
                    __html: tafsirForAyah?.text
                      ? DOMPurify.sanitize(tafsirForAyah.text)
                      : "Select a surah and ayah to view the tafsir.",
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Button
              disabled={currentVerseNumber === 1 || isTafsirFetching}
              onClick={handlePreviousAyah}
              variant="outline"
              className="cursor-pointer"
            >
              {t("previous")}
            </Button>
            <Button
              disabled={currentVerseNumber === ayahCount || isTafsirFetching}
              onClick={handleNextAyah}
              className="cursor-pointer"
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TafsirPage;
