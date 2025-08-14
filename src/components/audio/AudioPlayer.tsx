"use client";
import {
  useGetAllRectitationsQuery,
  useGetAudioChapterQuery,
} from "@/lib/store/features/audioApi";

import {
  setAudioData,
  setReciter,
  setOpenAudioPlayer,
  setIsPlaying,
  setCurrentVerse,
  setAudioLoading,
} from "@/lib/store/slices/audio-slice";

import { setClickedVerse, setSurahInfo } from "@/lib/store/slices/surah-slice";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale, useTranslations } from "next-intl";
import { LuUser, LuX } from "react-icons/lu";

// import { MdPlaylistPlay } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { VerseTiming } from "@/types/verse";

import PlayButton from "./PlayButton";
// import SkipForwardButton from "./SkipForwardButton";
// import SkipBackButton from "./SkipBackButton";
import VolumeControl from "./VolumeControl";
import useVolume from "@/hooks/useVolume";
import { Link } from "@/i18n/navigation";
import { getCurrentVerse, getVerseByKey } from "@/lib/utils/verse";
import { toast } from "sonner";
const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioPlayer = memo(
  ({ isSpecificReciters }: { isSpecificReciters: boolean }) => {
    const t = useTranslations("AudioPlayer");
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const audioState = useAppSelector(useCallback((state) => state.audio, []));
    const surahState = useAppSelector(useCallback((state) => state.surah, []));
    const [isSeeking, setIsSeeking] = useState(false);
    const [reciterListOpen, setReciterListOpen] = useState(false);
    const [isReciterChanging, setIsReciterChanging] = useState(false);
    const savedVerseRef = useRef<VerseTiming | null>(null);
    const pendingSeekRef = useRef<VerseTiming | null>(null); // New ref for pending seek operations

    const {
      reciter,
      isOpen,
      isPlaying,
      audio_url,
      timestamps,
      currentVerse: currentAudioVerse,
    } = audioState;

    const { clickedVerse, surahInfo } = surahState;

    const { data: reciters } = useGetAllRectitationsQuery(
      { language: locale },
      {
        skip: !isOpen,
      }
    );
    const { data: chapterAudio, isFetching: isApiFetching } =
      useGetAudioChapterQuery(
        {
          chapterId: surahInfo.id,
          reciterId: reciter.id,
          segments: true,
        },
        {
          skip: surahInfo.id === 0 || !isOpen || isSpecificReciters,
          refetchOnMountOrArgChange: true,
        }
      );
    const {
      audioRef,
      currentTime,
      duration,
      isLoading: isAudioPlayerLoading,
      handleSeek: performSeek,
      isError: isAudioPlayerError,
    } = useAudioPlayer({
      src: audio_url || null,
      isPlaying,
      onEnded: () => dispatch(setIsPlaying(false)),
      setPlaying: (isPlaying) => dispatch(setIsPlaying(isPlaying)),
      onSeeked: useCallback(() => {
        setIsSeeking(false);
        if (isReciterChanging) {
          setIsReciterChanging(false);
        }
      }, [isReciterChanging]),
    });
    const { VolumeIcon, volume, handleVolumeChange } = useVolume();
    const isLoading = useMemo(
      () => isApiFetching || isAudioPlayerLoading,
      [isApiFetching, isAudioPlayerLoading]
    );
    const progress = useMemo(() => {
      return duration > 0 ? (currentTime / duration) * 100 : 0;
    }, [duration, currentTime]);
    const direction = useMemo(() => {
      return locale === "ar" ? "rtl" : "ltr";
    }, [locale]);

    const timestampsMap = useMemo(() => {
      const map = new Map<string, VerseTiming>();
      timestamps.forEach((ts) => map.set(ts.verse_key, ts));
      return map;
    }, [timestamps]);

    const currentVerse = useMemo(() => {
      return getCurrentVerse(timestamps, currentTime);
    }, [timestamps, currentTime]);

    const handleSeek = useCallback(
      (value: number) => {
        if (duration > 0) {
          setIsSeeking(true);
          performSeek(value);
        }
      },
      [performSeek, duration]
    );
    const handleSelectReciter = useCallback(
      ({ id, name }: { id: number; name: string }) => {
        setIsReciterChanging(true);
        if (savedVerseRef.current) {
          console.log(
            savedVerseRef.current.verse_key,
            "verse key from select reciter"
          );
          pendingSeekRef.current = savedVerseRef.current;
        }
        dispatch(setIsPlaying(false));
        dispatch(setReciter({ id, name }));
        setReciterListOpen(false);
      },
      [dispatch]
    );

    const handleCloseAudioPlayer = useCallback(() => {
      dispatch(setOpenAudioPlayer(false));
      dispatch(setIsPlaying(false));
      dispatch(setSurahInfo({ name: "", id: 0 }));
      dispatch(setAudioData({ audio_url: "", timestamps: [], chapter_id: 0 }));
      dispatch(setCurrentVerse(null));
      if (reciter.id === 0) {
        dispatch(setReciter({ id: 7, name: "مشاري راشد العفاسي" }));
      }
    }, [dispatch, reciter]);

    const handleTogglePlay = useCallback(() => {
      dispatch(setIsPlaying(!isPlaying));
    }, [dispatch, isPlaying]);

    useEffect(() => {
      if (chapterAudio && !isSpecificReciters) {
        dispatch(
          setAudioData({
            audio_url: chapterAudio.audio_url,
            timestamps: chapterAudio.timestamps,
            chapter_id: chapterAudio.chapter_id,
          })
        );
      }
    }, [chapterAudio, dispatch, audio_url, isSpecificReciters]);

    useEffect(() => {
      if (
        pendingSeekRef.current &&
        timestampsMap.has(pendingSeekRef.current.verse_key)
      ) {
        const verseToSeek = getVerseByKey(
          pendingSeekRef.current.verse_key,
          timestampsMap
        );

        if (verseToSeek) {
          const seekTime = (verseToSeek.timestamp_from / 1000 / duration) * 100;
          // dispatch(setCurrentVerse(verseToSeek));
          // savedVerseRef.current = verseToSeek;
          performSeek(seekTime);

          // if (isFinite(seekTime)) {
          //   handleSeek(seekTime);
          // }
        }

        pendingSeekRef.current = null;
      }
    }, [timestampsMap, duration, performSeek, dispatch]);
    useEffect(() => {
      const reciterInNewLanguage = reciters?.find((r) => r.id === reciter.id);
      const newName = reciterInNewLanguage?.translated_name.name;

      // If the name for the current reciter ID in the new language is different,
      // update it in Redux. This will trigger a reload, but we save the time first.
      if (newName && newName !== reciter.name) {
        dispatch(setReciter({ id: reciter.id, name: newName }));
      }
    }, [reciters, reciter.id, reciter.name, dispatch]);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [audioRef, volume]);

    useEffect(() => {
      if (
        !isSeeking &&
        !isReciterChanging &&
        currentVerse &&
        currentVerse.verse_key != savedVerseRef.current?.verse_key &&
        currentAudioVerse?.verse_key != currentVerse.verse_key &&
        duration > 0
      ) {
        savedVerseRef.current = currentVerse;
        dispatch(setCurrentVerse(currentVerse));
      }
    }, [
      currentVerse,
      dispatch,
      isLoading,
      currentAudioVerse,
      isSeeking,
      isReciterChanging,
      duration,
    ]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore keyboard events if an input is focused.
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        // Handle "Escape" to close the player
        if (e.key === "Escape") {
          handleCloseAudioPlayer();
        }
        // Handle "Space" to toggle play/pause
        else if (e.key === " ") {
          e.preventDefault(); // Prevents the default spacebar action (e.g., scrolling).
          handleTogglePlay();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // The cleanup function correctly removes the exact listener that was added.
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleTogglePlay, handleCloseAudioPlayer]);

    useEffect(() => {
      const audio = audioRef.current;
      if (isOpen && audio && !isLoading) {
        const handleCanPlay = () => {
          audio.play();
          dispatch(setIsPlaying(true));
        };
        audio.addEventListener("canplay", handleCanPlay);

        return () => {
          audio.removeEventListener("canplay", handleCanPlay);
        };
      }
    }, [isOpen, audioRef, dispatch, isLoading]);

    useEffect(() => {
      if (clickedVerse && timestampsMap.size > 0 && duration > 0) {
        const verseToSeek = getVerseByKey(clickedVerse, timestampsMap);
        if (verseToSeek) {
          const seekTime = (verseToSeek.timestamp_from / 1000 / duration) * 100;
          dispatch(setCurrentVerse(verseToSeek));
          savedVerseRef.current = verseToSeek;
          handleSeek(seekTime);
        }
        const timer = setTimeout(() => {
          if (isPlaying) {
            dispatch(setClickedVerse(null));
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [
      clickedVerse,
      timestampsMap,
      handleSeek,
      duration,
      isPlaying,
      dispatch,
    ]);

    useEffect(() => {
      if (isAudioPlayerError) {
        dispatch(setIsPlaying(false));
        toast.error(t("audio-player-error"));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAudioPlayerError, dispatch]);

    useEffect(() => {
      dispatch(setAudioLoading(isLoading));
    }, [isLoading, dispatch]);
    const reciterList = useMemo(() => {
      return reciters?.map((reciterItem) => (
        <div
          key={reciterItem.id}
          className={`p-2 rounded-md  cursor-pointer transition-colors flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-secondary ${
            reciterItem.id === reciter.id ? "bg-gray-100 dark:bg-secondary" : ""
          }`}
          onClick={() =>
            handleSelectReciter({
              id: reciterItem.id,
              name: reciterItem.translated_name.name,
            })
          }
        >
          <p className="font-medium">{reciterItem.translated_name.name}</p>
          <span className="text-sm text-gray-500">{reciterItem?.style}</span>
        </div>
      ));
    }, [reciters, reciter.id, handleSelectReciter]);
    return (
      <div
        className={`${
          isOpen
            ? "translate-y-0 opacity-100 visible"
            : "opacity-0 translate-y-[150%] invisible"
        } transition-all duration-300 fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-50`}
      >
        <audio ref={audioRef} preload="metadata" />
        <Slider
          min={0}
          className="absolute top-0  left-0 w-full h-1 cursor-pointer"
          defaultValue={[0]}
          value={[progress]}
          onValueChange={([value]) => handleSeek(value)}
          max={100}
          step={0.1}
          disabled={isLoading}
          dir={direction}
        />
        <div className="w-full flex justify-between items-center my-1">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {formatTime(duration)}
          </span>
        </div>
        <div className="justify-between flex items-center gap-2">
          <div className=" md:basis-[25%]  flex items-center">
            <div className="ml-3">
              <Link
                href={`/surahs/${surahInfo.id}`}
                className="font-bold text-sm text-gray-800 dark:text-white truncate"
              >
                {surahInfo.name}
              </Link>
              {/* <h3 className="font-bold text-sm text-gray-800 dark:text-white truncate">
              {surahInfo.name}
            </h3> */}
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {reciter.name}
              </p>
            </div>
          </div>
          <div className="md:basis-1/2 flex justify-center items-center space-x-2 md:space-x-4">
            {/* {locale === "ar" ? <SkipForwardButton /> : <SkipBackButton />} */}

            <PlayButton
              isPlaying={isPlaying}
              isLoading={isLoading}
              handleTogglePlay={handleTogglePlay}
            />

            {/* {locale === "ar" ? <SkipBackButton /> : <SkipForwardButton />} */}

            <Button
              variant="ghost"
              className="cursor-pointer w-8 h-8 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={handleCloseAudioPlayer}
            >
              <LuX className="w-5 h-5" />
            </Button>
          </div>
          <div className=" md:basis-[25%]  flex items-center space-x-2 md:space-x-3">
            <Popover open={reciterListOpen} onOpenChange={setReciterListOpen}>
              <PopoverTrigger className="cursor-pointer p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary transition-colors">
                <LuUser className="w-5 h-5" />
              </PopoverTrigger>
              <PopoverContent className="w-80 h-80 overflow-y-auto space-y-2">
                {reciterList}
              </PopoverContent>
            </Popover>

            <VolumeControl
              volume={volume}
              VolumeIcon={VolumeIcon}
              handleVolumeChange={handleVolumeChange}
            />
            {/* <Popover>
              <PopoverTrigger className="cursor-pointer p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary transition-colors">
                <MdPlaylistPlay className="w-5 h-5" />
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                playlist
              </PopoverContent>
            </Popover> */}
          </div>
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
