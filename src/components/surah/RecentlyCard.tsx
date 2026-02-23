"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { Surah } from "@/types/surah";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import SurahPlayButton from "./SurahPlayButton";

import { Link } from "@/i18n/navigation";
import { LuMic } from "react-icons/lu";
import useAudio from "@/hooks/useAudio";

const RecentlyCard = ({ surah }: { surah: Surah }) => {
  const t = useTranslations("Surah");
  const locale = useLocale();
  const { isPlaying, isAudioLoading, reciter } = useAppSelector(
    (state) => state.audio,
  );
  const { play } = useAudio();
  const { surahInfo } = useAppSelector((state) => state.surah);

  const currentSurah = useMemo(
    () => surahInfo?.id === surah.number,
    [surahInfo?.id, surah.number],
  );

  // Check if same reciter
  const isSameReciter = useMemo(() => {
    return !surah.reciterId || reciter.id === surah.reciterId;
  }, [surah.reciterId, reciter.id]);

  // const handlePlay = useCallback(() => {
  //   if (!isOpen) {
  //     dispatch(setOpenAudioPlayer(true));
  //   }

  //   // If same surah but different reciter, play the new reciter's version
  //   if (currentSurah && !isSameReciter) {
  //     if (surah.serverLink && surah.reciterName && surah.reciterId) {
  //       dispatch(
  //         setAudioData({
  //           audio_url: surah.serverLink,
  //           timestamps: [],
  //           chapter_id: surah.number,
  //         }),
  //       );
  //       dispatch(setReciter({ id: surah.reciterId, name: surah.reciterName }));
  //       dispatch(setCurrentVerse(null));
  //     }
  //   } else if (currentSurah) {
  //     // Same surah and same reciter - toggle play/pause
  //     dispatch(setIsPlaying(!isPlaying));
  //   } else {
  //     // Different surah
  //     if (surah.serverLink && surah.reciterName && surah.reciterId) {
  //       dispatch(
  //         setAudioData({
  //           audio_url: surah.serverLink,
  //           timestamps: [],
  //           chapter_id: surah.number,
  //         }),
  //       );
  //       dispatch(setReciter({ id: surah.reciterId, name: surah.reciterName }));
  //       dispatch(setCurrentVerse(null));
  //     } else if (surah.reciterId && surah.reciterName) {
  //       dispatch(setReciter({ id: surah.reciterId, name: surah.reciterName }));
  //     }
  //     dispatch(
  //       setSurahInfo({
  //         id: surah.number,
  //         name: surah.name,
  //       }),
  //     );
  //     dispatch(setIsPlaying(false));
  //   }
  // }, [dispatch, surah, isOpen, isPlaying, currentSurah, isSameReciter]);

  return (
    <div
      key={surah.number}
      className="surah-card relative group flex items-center justify-between group"
    >
      <div className="flex items-center gap-2">
        <SurahPlayButton
          isPlaying={isPlaying}
          currentSurah={currentSurah}
          handleTogglePlay={() => play(surah)}
          className={`${locale == "ar" ? "ml-2" : "mr-2"}`}
          isLoading={isAudioLoading}
          isSameReciter={isSameReciter}
        />

        <div className="">
          <Link className="w-fit" href={`/surahs/${surah.number}`}>
            <h3
              className={`font-bold ${locale == "ar" && "font-sans text-xl"}`}
            >
              {locale === "ar" ? surah.name : surah.englishName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">
            {surah.numberOfAyahs} {t("verses")}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 text-sm text-gray-500 min-w-0 max-w-[40%]">
        {surah?.reciterName && surah?.serverLink ? (
          <Link
            href={`/reciters/${surah.reciterId}`}
            className="flex  items-center gap-1 text-xs truncate w-full text-end hover:text-primary transition-colors font-medium"
          >
            <LuMic size={12} />
            <span className="truncate max-w-[120px]" title={surah.reciterName}>
              {surah.reciterName}
            </span>
          </Link>
        ) : (
          <div className="flex  items-center gap-1 text-xs truncate w-full text-end hover:text-primary transition-colors font-medium">
            <LuMic size={12} />
            <span className="truncate max-w-[120px]" title={surah.reciterName}>
              {surah.reciterName}
            </span>
          </div>
        )}
        <span className="text-xs opacity-75">
          {t(surah.revelationType.toLowerCase())}
        </span>
      </div>
    </div>
  );
};

export default RecentlyCard;
