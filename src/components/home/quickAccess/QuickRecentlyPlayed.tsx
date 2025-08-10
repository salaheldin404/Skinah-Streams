"use client";
import { useTranslations } from "next-intl";
import { LuClock } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import {
  setIsPlaying,
  setOpenAudioPlayer,
} from "@/lib/store/slices/audio-slice";

import { setSurahInfo } from "@/lib/store/slices/surah-slice";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import SurahPlayButton from "@/components/surah/SurahPlayButton";
import QuickRecentlyPlayedSkeleton from "./loading/QuickRecentlyPlayedSkeleton";

const QuickRecentlyPlayed = memo(() => {
  const t = useTranslations("QuickAccess");
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  // It safely flags that we are now on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { lastPlay, isOpen, isPlaying } = useAppSelector(
    (state) => state.audio
  );
  const { surahInfo } = useAppSelector((state) => state.surah);
  // const surah = useMemo(() => lastPlay[0] || null, [lastPlay]);
  const surah = isClient ? lastPlay[0] || null : null;

  const currentSurah = useMemo(
    () => isClient && !!surah && surahInfo?.id === surah.number,
    [surahInfo?.id, surah, isClient]
  );

  const handlePlay = useCallback(() => {
    if (lastPlay.length > 0) {
      if (!isOpen) {
        dispatch(setOpenAudioPlayer(true));
      }
      if (currentSurah) {
        dispatch(setIsPlaying(!isPlaying));
      } else {
        dispatch(
          setSurahInfo({
            id: lastPlay[0].number,
            name: lastPlay[0].name,
          })
        );
        dispatch(setIsPlaying(false));
      }
    }
  }, [dispatch, lastPlay, isOpen, isPlaying, currentSurah]);
  if (!isClient) {
    return <QuickRecentlyPlayedSkeleton />;
  }
  return (
    <div className="surah-card flex items-center group justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 gradient-blue rounded-lg flex items-center justify-center">
          <LuClock size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-medium">{t("recent")}</h3>
          {lastPlay.length > 0 ? (
            <p className="text-sm text-gray-500">{lastPlay[0].name}</p>
          ) : (
            <p className="text-sm text-gray-500">{t("no-recently")}</p>
          )}
        </div>
      </div>
      {surah && (
        <SurahPlayButton
          isPlaying={isPlaying}
          currentSurah={currentSurah}
          handleTogglePlay={handlePlay}
        />
      )}
    </div>
  );
});

QuickRecentlyPlayed.displayName = "QuickRecentlyPlayed";

export default QuickRecentlyPlayed;
