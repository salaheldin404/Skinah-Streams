"use client";
import { Link } from "@/i18n/navigation";
import { memo, useCallback, useMemo } from "react";

import { useLocale, useTranslations } from "next-intl";
import { getGradientClass, getGradientOverlayClass } from "@/lib/utils/surah";
import { Surah } from "@/types/surah";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setLastPlay } from "@/lib/store/slices/audio-slice";

import { Badge } from "../ui/badge";
import SurahPlayButton from "./SurahPlayButton";
import WishlistButton from "../WishlistButton";
import { useWishlist } from "@/hooks/useWishlist";
import useIsSpecificReciter from "@/hooks/useIsSpecificReciter";
import useAudio from "@/hooks/useAudio";
import AudioPlayerService from "@/lib/utils/audio";
import BackgroundOverlay from "../common/BackgroundOverlay";
interface SurahCardProps {
  surah: Surah;
  isWishlistShow?: boolean;
}

const SurahCard = memo(({ surah, isWishlistShow }: SurahCardProps) => {
  const revelationTypeKey = surah.revelationType.toLowerCase();
  const t = useTranslations("Surah");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { isPlaying, isAudioLoading, reciter } = useAppSelector(
    (state) => state.audio,
  );
  const { surahInfo } = useAppSelector((state) => state.surah);
  const { play } = useAudio();
  const isSpecificReciter = useIsSpecificReciter();
  const currentSurah = useMemo(
    () => surahInfo?.id === surah.number,
    [surahInfo?.id, surah.number],
  );

  // Check if same reciter
  const isSameReciter = useMemo(() => {
    return !surah.reciterId || reciter.id === surah.reciterId;
  }, [surah.reciterId, reciter.id]);

  const { handleToggleAddSurahToWishlist, isSurahInWishlist, surahText } =
    useWishlist({
      surah,
    });
  // const isSpecificReciter = useIsSpecificReciter();

  // const playNewSurah = useCallback(() => {
  //   dispatch(setSurahInfo({ name: surah.name, id: surah.number }));

  //   if (!isOpen) {
  //     dispatch(setOpenAudioPlayer(true));
  //   }
  //   dispatch(setIsPlaying(false));

  //   // Determine reciter data to use (priority: surah's reciter > default > current)
  //   const hasCustomReciter = !!(surah.serverLink && surah.reciterName && surah.reciterId);
  //   const reciterData = hasCustomReciter
  //     ? { id: surah.reciterId!, name: surah.reciterName! }
  //     : isSpecificReciter
  //       ? { id: 7, name: "مشاري راشد العفاسي" }
  //       : { id: reciter.id, name: reciter.name };

  //   // Set audio data if surah has a specific server link
  //   if (hasCustomReciter) {
  //     dispatch(
  //       setAudioData({
  //         audio_url: surah.serverLink!,
  //         timestamps: [],
  //         chapter_id: surah.number,
  //       }),
  //     );
  //     dispatch(setCurrentVerse(null));
  //   }

  //   dispatch(setReciter(reciterData));
  //   dispatch(setLastPlay({ ...surah, reciterName: reciterData.name, reciterId: reciterData.id }));
  // }, [dispatch, surah, isOpen, isSpecificReciter, reciter]);

  // const toggleCurrentSurah = useCallback(() => {
  //   // Edge case: If the current surah is selected, but the reciter is different
  //   // (e.g., user clicks a different reciter's version of the same surah).
  //   if (!isSameReciter && surah.serverLink && surah.reciterName && surah.reciterId) {
  //     dispatch(
  //       setAudioData({
  //         audio_url: surah.serverLink,
  //         timestamps: [],
  //         chapter_id: surah.number,
  //       }),
  //     );
  //     dispatch(setReciter({ id: surah.reciterId, name: surah.reciterName }));
  //     dispatch(setCurrentVerse(null));
  //   } else {
  //     // Standard play/pause toggle (same reciter or no reciter info)
  //     dispatch(setIsPlaying(!isPlaying));
  //   }
  //   if (!isOpen) {
  //     dispatch(setOpenAudioPlayer(true));
  //   }
  // }, [dispatch, isPlaying, surah, isSameReciter, isOpen]);

  // const handleTogglePlay = useCallback(() => {
  //   if (currentSurah) {
  //     toggleCurrentSurah();
  //   } else {
  //     playNewSurah();
  //   }
  // }, [toggleCurrentSurah, playNewSurah, currentSurah]);

  // Build the URL with optional query params for serverLink and reciter info

  const handlePlay = useCallback(() => {
    play(surah);
    const reciterData = AudioPlayerService.resolveReciterData(
      surah,
      reciter,
      isSpecificReciter,
    );
    dispatch(
      setLastPlay({
        ...surah,
        reciterName: reciterData.name,
        reciterId: reciterData.id,
      }),
    );
  }, [dispatch, play, surah, reciter, isSpecificReciter]);
  const surahUrl = useMemo(() => {
    const baseUrl = `/surahs/${surah.number}`;
    if (surah.serverLink && surah.reciterName && surah.reciterId) {
      const params = new URLSearchParams({
        serverLink: surah.serverLink,
        reciterId: surah.reciterId.toString(),
        reciterName: surah.reciterName,
      });
      return `${baseUrl}?${params.toString()}`;
    }
    return baseUrl;
  }, [surah.number, surah.serverLink, surah.reciterName, surah.reciterId]);

  return (
    <div className="surah-card group relative overflow-hidden">
      {/* Per-gradient shimmer on hover */}

      <BackgroundOverlay
        className={`bg-gradient-to-br ${getGradientOverlayClass(surah.number)} to-transparent`}
      />
      <Link href={surahUrl} className="">
        <div
          className={`w-full h-32 ${getGradientClass(
            surah.number,
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
            handleTogglePlay={handlePlay}
            currentSurah={currentSurah}
            isPlaying={isPlaying}
            isLoading={isAudioLoading}
            isSameReciter={isSameReciter}
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
