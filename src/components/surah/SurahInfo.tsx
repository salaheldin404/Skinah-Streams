"use client";
import {
  setOpenAudioPlayer,
  setLastPlay,
} from "@/lib/store/slices/audio-slice";
import { setSurahInfo } from "@/lib/store/slices/surah-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Surah } from "@/types/surah";
import { toArabicNumber } from "@/lib/utils/surah";
import { Badge } from "../ui/badge";

import { setReciter, setIsPlaying } from "@/lib/store/slices/audio-slice";
import { memo, useCallback, useMemo } from "react";
import SurahPlayButton from "./SurahPlayButton";
interface SurahInfoProps {
  surah: Surah;
  locale: string;
  t: (key: string) => string;
  t2: (key: string) => string;
}

const SurahInfo = memo(({ surah, locale, t, t2 }: SurahInfoProps) => {
  const dispatch = useAppDispatch();
  const { reciter, isPlaying, isOpen, isAudioLoading } = useAppSelector(
    (state) => state.audio
  );
  const { surahInfo } = useAppSelector((state) => state.surah);

  const currentSurah = useMemo(() => {
    return surahInfo?.id === surah.number;
  }, [surahInfo?.id, surah.number]);

  const handlePlay = useCallback(() => {
    if (!currentSurah) {
      dispatch(setSurahInfo({ name: surah.name, id: surah.number }));
    } else {
      dispatch(setIsPlaying(!isPlaying));
    }
    if (reciter.id == 0) {
      dispatch(setReciter({ id: 7, name: "مشاري راشد العفاسي" }));
    }
    if (!isOpen) {
      dispatch(setOpenAudioPlayer(true));
    }
    dispatch(setLastPlay(surah));
  }, [currentSurah, dispatch, isPlaying, reciter.id, surah, isOpen]);
  return (
    <header className="p-6  mx-auto bg-card rounded-md">
      <div className="flex justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{surah.name}</h2>
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
