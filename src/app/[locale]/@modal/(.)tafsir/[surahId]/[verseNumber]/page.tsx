"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import DOMPurify from "dompurify";
import { LuX } from "react-icons/lu";

import { useRouter } from "@/i18n/navigation";
import SurahAyahSelectors from "@/components/surah/SurahAyaSelectors";
import TafsirCarousel from "@/components/surah/TafsirCarousel";
import TafsirSkeleton from "@/components/surah/TafsirSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useTafsirSelection } from "@/hooks/useTafsirSelection";

import { useGetTafsirsQuery } from "@/lib/store/features/tafsirsApi";

const TafsirModal = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("TafsirPage");

  const { surahId, verseNumber } = useParams<{
    surahId: string;
    verseNumber: string;
  }>();
  const [isMounted, setIsMounted] = useState(false);
  const [currentSurahId, setCurrentSurahId] = useState(surahId || "1");
  const [currentVerseNumber, setCurrentVerseNumber] = useState(
    parseInt(verseNumber, 10) || 1
  );

  const { data: allTafsirs, isFetching: isTafsirsFetching } =
    useGetTafsirsQuery({});
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
    allTafsirs: allTafsirs,
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid server-side rendering of the dialog
  }

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent
        aria-describedby={undefined}
        className={`overflow-y-auto md:min-h-[55vh] max-h-[80vh] lg:!max-w-none !w-[90%] !md:w-[80%] lg:!w-[800px]  flex flex-col`}
      >
        <DialogHeader>
          <DialogTitle className="hidden"></DialogTitle>
          <SurahAyahSelectors
            surahs={surahs}
            selectedSurah={currentSurahId}
            onSelectSurah={handleSelectSurah}
            ayahCount={ayahCount}
            selectedAyah={currentVerseNumber}
            onSelectAyah={handleSelectAyah}
          />
        </DialogHeader>
        <DialogClose
          className={`cursor-pointer grid place-content-center w-8 h-8 rounded-full hover:bg-secondary transition-colors absolute top-2 ${
            locale === "en" ? "right-4" : "left-4"
          }`}
        >
          <LuX size={24} />
        </DialogClose>
        <TafsirCarousel
          arabicTafsirs={arabicTafsirs}
          selectedTafsirId={selectedTafsirId}
          onSelectTafsir={handleSelectTafsir}
          isTafsirsLoading={isTafsirsFetching}
        />

        {isTafsirFetching ? (
          <TafsirSkeleton />
        ) : (
          <div dir="rtl" className="md:overflow-y-auto">
            <div className="pb-6 border-b">
              <p className="font-uthmanic text-2xl">
                {tafsirForAyah?.verses?.[ayahKey]?.text_qpc_hafs}
              </p>
            </div>
            <div className=" p-4 tajwal-text">
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

        <DialogFooter className="flex items-center justify-between w-full">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TafsirModal;
