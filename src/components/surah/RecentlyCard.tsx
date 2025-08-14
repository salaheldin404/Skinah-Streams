"use client";
import {
  setOpenAudioPlayer,
  setIsPlaying,
} from "@/lib/store/slices/audio-slice";

import { setSurahInfo } from "@/lib/store/slices/surah-slice";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Surah } from "@/types/surah";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useCallback, useMemo } from "react";
import SurahPlayButton from "./SurahPlayButton";

import { Link } from "@/i18n/navigation";

const RecentlyCard = ({ surah }: { surah: Surah }) => {
  const t = useTranslations("Surah");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { isOpen, isPlaying, isAudioLoading } = useAppSelector(
    (state) => state.audio
  );
  const { surahInfo } = useAppSelector((state) => state.surah);

  const currentSurah = useMemo(
    () => surahInfo?.id === surah.number,
    [surahInfo?.id, surah.number]
  );

  const handlePlay = useCallback(() => {
    if (!isOpen) {
      dispatch(setOpenAudioPlayer(true));
    }
    if (currentSurah) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(
        setSurahInfo({
          id: surah.number,
          name: surah.name,
        })
      );
      dispatch(setIsPlaying(false));
    }
  }, [dispatch, surah, isOpen, isPlaying, currentSurah]);

  return (
    <div
      key={surah.number}
      className="surah-card flex items-center justify-between group"
    >
      <div className="flex items-center gap-2">
        <SurahPlayButton
          isPlaying={isPlaying}
          currentSurah={currentSurah}
          handleTogglePlay={handlePlay}
          className={`${locale == "ar" ? "ml-2" : "mr-2"}`}
          isLoading={isAudioLoading}
        />

        <div className="">
          <Link className="w-fit" href={`/surahs/${surah.number}`}>
            <h3
              className={`font-bold ${
                locale == "ar" && "font-uthmanic text-2xl"
              }`}
            >
              {locale === "ar" ? surah.name : surah.englishName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">
            {surah.numberOfAyahs} {t("verses")}
          </p>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {t(surah.revelationType.toLowerCase())}
      </div>
    </div>
  );
};

export default RecentlyCard;
