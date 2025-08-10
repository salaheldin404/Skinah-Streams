"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuBookOpen } from "react-icons/lu";
import { useGetTafsirsQuery } from "@/lib/store/features/tafsirsApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { memo } from "react";
import { useLocale } from "next-intl";

import { useParams } from "next/navigation";
import { useTafsirSelection } from "@/hooks/useTafsirSelection";
import SurahAyahSelectors from "./SurahAyaSelectors";
import TafsirCarousel from "./TafsirCarousel";
const TafsirDialog = memo(({ verseNumber }: { verseNumber: number }) => {
  const { id } = useParams();

  const { data: tafsirs } = useGetTafsirsQuery({});
  const {
    selectedTafsirId,
    selectedSurah,
    selectedAyah,
    surahs,
    ayahCount,
    ayahKey,
    arabicTafsirs,
    tafsirForAyah,
    isTafsirFetching,
    handleSelectTafsir,
    handleSelectSurah,
    handleSelectAyah,
  } = useTafsirSelection({
    initialSurahId: id,
    initialVerseNumber: verseNumber,
    allTafsirs: tafsirs,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <LuBookOpen />
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="md:min-h-[55vh] max-h-[80vh] lg:!max-w-none !w-[90%] !md:w-[80%] lg:!w-[800px]  flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Select a Tafsir</DialogTitle>
          <SurahAyahSelectors
            surahs={surahs}
            selectedSurah={selectedSurah}
            onSelectSurah={handleSelectSurah}
            ayahCount={ayahCount}
            selectedAyah={selectedAyah}
            onSelectAyah={handleSelectAyah}
          />

          <TafsirCarousel
            arabicTafsirs={arabicTafsirs}
            onSelectTafsir={handleSelectTafsir}
            selectedTafsirId={selectedTafsirId}
          />
        </DialogHeader>
        {isTafsirFetching ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <>
            <div className="pb-6 border-b">
              <p className="font-uthmanic text-2xl">
                {tafsirForAyah?.verses?.[ayahKey]?.text_qpc_hafs}
              </p>
            </div>
            <div className=" p-4 overflow-y-auto">
              <p className="text-lg leading-8 ">
                {tafsirForAyah?.text ||
                  "Select a surah and ayah to view the tafsir."}
              </p>
            </div>
          </>
        )}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

TafsirDialog.displayName = "TafsirDialog";

export default TafsirDialog;
