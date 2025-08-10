"use client";
import { Link } from "@/i18n/navigation";
import { memo, useCallback, useMemo } from "react";

import { useLocale, useTranslations } from "next-intl";
import { getGradientClass } from "@/lib/utils/surah";
import { Surah } from "@/types/surah";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setIsPlaying,
  setOpenAudioPlayer,
  setAudioData,
  setReciter,
  setCurrentVerse,
  setLastPlay,
} from "@/lib/store/slices/audio-slice";
import { setSurahInfo } from "@/lib/store/slices/surah-slice";

import { Badge } from "../ui/badge";
import SurahPlayButton from "./SurahPlayButton";
import WishlistButton from "../WishlistButton";
import { useWishlist } from "@/hooks/useWishlist";
interface SurahCardProps {
  surah: Surah;
  isWishlistShow?: boolean;
}

const SurahCard = memo(({ surah, isWishlistShow }: SurahCardProps) => {
  const revelationTypeKey = surah.revelationType.toLowerCase();
  const t = useTranslations("Surah");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { isPlaying, audio_url, isOpen } = useAppSelector(
    (state) => state.audio
  );
  const { surahInfo } = useAppSelector((state) => state.surah);
  const currentSurah = useMemo(
    () => surahInfo?.id === surah.number,
    [surahInfo?.id, surah.number]
  );
  const { handleToggleAddSurahToWishlist, isSurahInWishlist, surahText } =
    useWishlist({
      surah,
    });

  const playNewSurah = useCallback(() => {
    dispatch(setSurahInfo({ name: surah.name, id: surah.number }));
    if (!isOpen) {
      dispatch(setOpenAudioPlayer(true));
    }
    dispatch(setIsPlaying(false));

    // If the surah has a specific server link (e.g., from a search result)
    if (surah.serverLink && surah.reciterName) {
      dispatch(
        setAudioData({
          audio_url: surah.serverLink,
          timestamps: [],
          chapter_id: surah.number,
        })
      );
      dispatch(setReciter({ id: 0, name: surah.reciterName }));
      dispatch(setCurrentVerse(null));
      // dispatch(setIsPlaying(true)); // Start playing the new source
    } else {
      dispatch(setReciter({ id: 7, name: "مشاري راشد العفاسي" }));
    }
    dispatch(setLastPlay(surah));
  }, [dispatch, surah, isOpen]);

  const toggleCurrentSurah = useCallback(() => {
    // Edge case: If the current surah is selected, but the audio source is different
    // (e.g., user clicks a different reciter's version of the same surah).
    if (surah.serverLink && surah.serverLink !== audio_url) {
      dispatch(
        setAudioData({
          audio_url: surah.serverLink,
          timestamps: [],
          chapter_id: surah.number,
        })
      );
      if (surah.reciterName) {
        dispatch(setReciter({ id: 0, name: surah.reciterName }));
      }
      dispatch(setCurrentVerse(null));
    } else {
      // Standard play/pause toggle
      dispatch(setIsPlaying(!isPlaying));
    }
    if (!isOpen) {
      dispatch(setOpenAudioPlayer(true));
    }
  }, [dispatch, isPlaying, surah, audio_url, isOpen]);

  const handleTogglePlay = useCallback(() => {
    if (currentSurah) {
      toggleCurrentSurah();
    } else {
      playNewSurah();
    }
  }, [toggleCurrentSurah, playNewSurah, currentSurah]);

  return (
    <div className="surah-card group relative">
      <Link href={`/surahs/${surah.number}`} className="">
        <div
          className={`w-full h-32 ${getGradientClass(
            surah.number
          )} rounded-lg mb-4 flex items-center justify-center relative`}
        >
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-white font-uthmanic">
              {surah.name}
            </div>
            <div className="text-sm text-white opacity-80">{surah.number}</div>
            {surah.mushafName && (
              <p className="text-[9px] text-white opacity-80">
                {surah.mushafName}
              </p>
            )}
          </div>
        </div>
      </Link>
      <div className="space-y-3 flex items-center justify-between gap-2">
        <div className="space-y-2 ">
          <h3 className="font-medium ">
            {locale === "ar" ? surah.shortName : surah.englishName}
          </h3>
          <p className="text-sm  text-gray-500">
            {surah.numberOfAyahs} {t("verses")}
          </p>
        </div>

        <div className=" truncate " title={surah?.reciterName || ""}>
          {surah.reciterName && (
            <Link
              href={`/reciters/${surah.reciterId}`}
              className="text-[10px] md:text-sm   transition-colors text-gray-500 hover:text-gray-600"
            >
              <p className="">{surah.reciterName}</p>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Badge variant={"secondary"}>{t(revelationTypeKey)}</Badge>
        <div className="flex items-center gap-2">
          <SurahPlayButton
            handleTogglePlay={handleTogglePlay}
            currentSurah={currentSurah}
            isPlaying={isPlaying}
          />

          {isWishlistShow && (
            <WishlistButton
              handleToggle={handleToggleAddSurahToWishlist}
              isItemInWishlist={isSurahInWishlist}
              textContent={surahText}
            />
          )}
        </div>
      </div>
    </div>
  );
});

SurahCard.displayName = "SurahCard";

export default SurahCard;
