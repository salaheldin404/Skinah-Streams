"use client";
import {
  setOpenAudioPlayer,
  setLastPlay,
  setCurrentVerse,
} from "@/lib/store/slices/audio-slice";
import { setSurahInfo } from "@/lib/store/slices/surah-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Surah } from "@/types/surah";
import { toArabicNumber } from "@/lib/utils/surah";
import { Badge } from "../ui/badge";

import {
  setReciter,
  setIsPlaying,
  setAudioData,
} from "@/lib/store/slices/audio-slice";
import { memo, useCallback, useMemo } from "react";
import SurahPlayButton from "./SurahPlayButton";
import useIsSpecificReciter from "@/hooks/useIsSpecificReciter";
import { useSearchParams } from "next/navigation";
interface SurahInfoProps {
  surah: Surah;
  locale: string;
  t: (key: string) => string;
  t2: (key: string) => string;
}

const SurahInfo = memo(({ surah, locale, t, t2 }: SurahInfoProps) => {
  const dispatch = useAppDispatch();
  const { isPlaying, isOpen, isAudioLoading, reciter } = useAppSelector(
    (state) => state.audio,
  );
  const isSpecificReciter = useIsSpecificReciter();
  const { surahInfo } = useAppSelector((state) => state.surah);
  const searchParams = useSearchParams();

  const currentSurah = useMemo(() => {
    return surahInfo?.id === surah.number;
  }, [surahInfo?.id, surah.number]);

  // Extract reciter info from URL params (from reciter page)
  const searchParamReciter = useMemo(() => {
    if (!searchParams) return null;
    const reciterId = searchParams.get("reciterId");
    const reciterName = searchParams.get("reciterName");
    const serverLink = searchParams.get("serverLink");

    if (reciterId && reciterName && serverLink) {
      return { reciterId: Number(reciterId), reciterName, serverLink };
    }
    return null;
  }, [searchParams]);

  // Check if same reciter (considering URL params)
  const isSameReciter = useMemo(() => {
    if (searchParamReciter) {
      return reciter.id === searchParamReciter.reciterId;
    }
    return true;
  }, [searchParamReciter, reciter.id]);

  const handlePlay = useCallback(() => {
    if (!isOpen) {
      dispatch(setOpenAudioPlayer(true));
    }

    // If same surah but different reciter, play the new reciter's version
    if (currentSurah && !isSameReciter && searchParamReciter) {
      dispatch(
        setAudioData({
          audio_url: searchParamReciter.serverLink,
          timestamps: [],
          chapter_id: surah.number,
        }),
      );
      dispatch(
        setReciter({
          id: searchParamReciter.reciterId,
          name: searchParamReciter.reciterName,
        }),
      );
      dispatch(setCurrentVerse(null));
    } else if (currentSurah) {
      // Same surah and same reciter - toggle play/pause
      dispatch(setIsPlaying(!isPlaying));
    } else {
      // New surah
      dispatch(setSurahInfo({ name: surah.name, id: surah.number }));
      dispatch(setIsPlaying(false));

      // Determine reciter data (priority: URL params > default > current)
      const hasUrlReciter = !!searchParamReciter;
      const reciterData = hasUrlReciter
        ? {
            id: searchParamReciter!.reciterId,
            name: searchParamReciter!.reciterName,
          }
        : isSpecificReciter
          ? { id: 7, name: "مشاري راشد العفاسي" }
          : { id: reciter.id, name: reciter.name };

      // Set audio data if URL has a specific server link
      if (hasUrlReciter) {
        dispatch(
          setAudioData({
            audio_url: searchParamReciter!.serverLink,
            timestamps: [],
            chapter_id: surah.number,
          }),
        );
        dispatch(setCurrentVerse(null));
      } else if (isSpecificReciter) {
        dispatch(setReciter(reciterData));
      }

      dispatch(setReciter(reciterData));
      dispatch(
        setLastPlay({
          ...surah,
          reciterName: reciterData.name,
          reciterId: reciterData.id,
        }),
      );
    }
  }, [
    currentSurah,
    dispatch,
    isPlaying,
    surah,
    isOpen,
    reciter,
    isSpecificReciter,
    searchParamReciter,
    isSameReciter,
  ]);
  return (
    <header className="p-6  mx-auto bg-card rounded-md">
      <div className="flex justify-between">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold font-sans">
            {surah.name}
          </h2>
          {locale === "en" && (
            <>
              <p className="text-gray-500">{surah.englishName}</p>
              <p className="text-gray-500">{surah.englishNameTranslation}</p>
            </>
          )}
          <div className="flex items-center gap-3">
            <Badge variant={"secondary"}>
              {t(surah.revelationType.toLocaleLowerCase())}
            </Badge>
            <p className="text-gray-500 flex items-center gap-1">
              {locale === "en"
                ? surah.numberOfAyahs
                : toArabicNumber(surah.numberOfAyahs)}
              <span>{t("verses")}</span>
            </p>
          </div>
        </div>
        <div>
          {/* <Button onClick={handlePlay} className="cursor-pointer">
            {t2("play")}
            {currentSurah && isPlaying ? (
              <LuPause className="" />
            ) : (
              <LuPlay className="" />
            )}
          </Button> */}
          <SurahPlayButton
            isPlaying={isPlaying}
            currentSurah={currentSurah}
            handleTogglePlay={handlePlay}
            className="!w-auto"
            isLoading={isAudioLoading}
            isSameReciter={isSameReciter}
          >
            {t2("play")}
          </SurahPlayButton>
        </div>
      </div>
    </header>
  );
});

SurahInfo.displayName = "SurahInfo";

export default SurahInfo;
