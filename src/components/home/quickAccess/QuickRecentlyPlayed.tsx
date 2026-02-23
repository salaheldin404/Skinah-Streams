"use client";
import { useTranslations } from "next-intl";
import { LuClock, LuMic } from "react-icons/lu";
import { useAppSelector } from "@/lib/store/hooks";

import { memo, useEffect, useMemo, useState } from "react";
import SurahPlayButton from "@/components/surah/SurahPlayButton";
import QuickRecentlyPlayedSkeleton from "./loading/QuickRecentlyPlayedSkeleton";
import { Link } from "@/i18n/navigation";
import useAudio from "@/hooks/useAudio";
import BackgroundOverlay from "@/components/common/BackgroundOverlay";

const QuickRecentlyPlayed = memo(() => {
  const t = useTranslations("QuickAccess");
  const [isClient, setIsClient] = useState(false);
  // It safely flags that we are now on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { lastPlay, isPlaying, isAudioLoading, reciter } = useAppSelector(
    (state) => state.audio,
  );
  const { play } = useAudio();
  const { surahInfo } = useAppSelector((state) => state.surah);
  // const surah = useMemo(() => lastPlay[0] || null, [lastPlay]);
  const surah = isClient ? lastPlay[0] || null : null;

  const currentSurah = useMemo(
    () => isClient && !!surah && surahInfo?.id === surah.number,
    [surahInfo?.id, surah, isClient],
  );

  // Check if same reciter
  const isSameReciter = useMemo(() => {
    return !surah?.reciterId || reciter.id === surah.reciterId;
  }, [surah?.reciterId, reciter.id]);

  // const handlePlay = useCallback(() => {
  //   if (lastPlay.length > 0) {
  //     if (!isOpen) {
  //       dispatch(setOpenAudioPlayer(true));
  //     }

  //     // If same surah but different reciter, play the new reciter's version
  //     if (currentSurah && !isSameReciter) {
  //       const recentPlay = lastPlay[0];
  //       if (recentPlay.serverLink && recentPlay.reciterName && recentPlay.reciterId) {
  //         dispatch(
  //           setAudioData({
  //             audio_url: recentPlay.serverLink,
  //             timestamps: [],
  //             chapter_id: recentPlay.number,
  //           }),
  //         );
  //         dispatch(setReciter({ id: recentPlay.reciterId, name: recentPlay.reciterName }));
  //         dispatch(setCurrentVerse(null));
  //       }
  //     } else if (currentSurah) {
  //       dispatch(setIsPlaying(!isPlaying));
  //     } else {
  //       const recentPlay = lastPlay[0];

  //       if (recentPlay.serverLink) {
  //         dispatch(
  //           setAudioData({
  //             audio_url: recentPlay.serverLink,
  //             timestamps: [],
  //             chapter_id: recentPlay.number,
  //           }),
  //         );
  //       }
  //       if (recentPlay.reciterId && recentPlay.reciterName) {
  //         dispatch(setReciter({ id: recentPlay.reciterId, name: recentPlay.reciterName }));
  //       }
  //       dispatch(
  //         setSurahInfo({
  //           id: recentPlay.number,
  //           name: recentPlay.name,
  //         }),
  //       );
  //       dispatch(setIsPlaying(false));
  //     }
  //   }
  // }, [dispatch, lastPlay, isOpen, isPlaying, currentSurah, isSameReciter]);

  if (!isClient) {
    return <QuickRecentlyPlayedSkeleton />;
  }
  return (
    <div className="surah-card flex items-center group justify-between relative">
      <BackgroundOverlay className="bg-gradient-to-r from-blue-500/20 to-transparent" />
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 gradient-blue rounded-lg flex items-center justify-center">
          <LuClock size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium">{t("recent")}</h3>

          {lastPlay.length > 0 ? (
            <div className="flex flex-col text-gray-500 md:flex-row md:gap-2">
              <p className="text-sm  font-sans">{lastPlay[0].name}</p>
              {lastPlay[0].reciterName && lastPlay[0].serverLink ? (
                <Link
                  href={`/reciters/${lastPlay[0].reciterId}`}
                  className="flex items-center gap-1 font-medium text-xs  hover:text-primary transition-colors mt-0.5"
                >
                  <LuMic size={12} />
                  <span
                    className="truncate max-w-[120px]"
                    title={lastPlay[0].reciterName}
                  >
                    {lastPlay[0].reciterName}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-1 font-medium text-xs  hover:text-primary transition-colors mt-0.5">
                  <LuMic size={12} />
                  <span
                    className="truncate max-w-[120px]"
                    title={lastPlay[0].reciterName}
                  >
                    {lastPlay[0].reciterName}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t("no-recently")}</p>
          )}
        </div>
      </div>
      {surah && (
        <SurahPlayButton
          isPlaying={isPlaying}
          currentSurah={currentSurah}
          handleTogglePlay={() => play(surah)}
          isLoading={isAudioLoading}
          isSameReciter={isSameReciter}
        />
      )}
    </div>
  );
});

QuickRecentlyPlayed.displayName = "QuickRecentlyPlayed";

export default QuickRecentlyPlayed;
