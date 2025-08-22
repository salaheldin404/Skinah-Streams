"use client";
import { Verse } from "@/types/verse";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setOpenAudioPlayer } from "@/lib/store/slices/audio-slice";

import {
  setSurahInfo,
  setClickedVerse,
  setCurrentVerseLocation,
  setLastRead,
  setSaveMarkRead,
} from "@/lib/store/slices/surah-slice";

import TranslationDisplay from "./TranslationDisplay";
import { useCallback, useEffect, useMemo, useRef } from "react";
import LazyRender from "../verse/LazyRender";
import { Surah } from "@/types/surah";
interface TranslationContentProps {
  verses: Verse[];
  surah: Surah;
}

const TranslationContent = ({ verses, surah }: TranslationContentProps) => {
  const dispatch = useAppDispatch();

  const {
    currentVerse,
    reciter,
    isOpen: isAudioPlayerOpen,
  } = useAppSelector((state) => state.audio);

  const { lastRead, currentVerseLocation, saveMarkRead } = useAppSelector(
    (state) => state.surah
  );
  const isSaveInProgress = useRef(false);

  const handleClickVerse = useCallback(
    (verse: Verse) => {
      if (!isAudioPlayerOpen) {
        dispatch(setOpenAudioPlayer(true));
        dispatch(setSurahInfo({ id: surah.number, name: surah.name }));
      }
      dispatch(setClickedVerse(verse.verse_key));
    },
    [dispatch, isAudioPlayerOpen, surah]
  );

  const handleClickCopy = useCallback((verse: Verse) => {
    navigator.clipboard.writeText(verse.qpc_uthmani_hafs);
  }, []);

  const isReciterDisabled = useMemo(() => reciter.id === 0, [reciter.id]);

  const handleVerseView = useCallback(
    (data: {
      hizb_number: number;
      juz_number: number;
      page_number: number;
    }) => {
      if (currentVerseLocation.page_number === data.page_number) return;
      dispatch(setCurrentVerseLocation(data));
    },
    [dispatch, currentVerseLocation.page_number]
  );
  const handleAttemptSave = useCallback(
    (verseData: Verse) => {
      if (saveMarkRead && !isSaveInProgress.current) {
        isSaveInProgress.current = true;

        const lastReadData = {
          chapter_id: verseData.chapter_id,
          verse_number: verseData.verse_number,
          page_number: verseData.page_number,
          qpc_uthmani_hafs: verseData.qpc_uthmani_hafs,
          verse_key: verseData.verse_key,
        };

        dispatch(setLastRead(lastReadData));
        dispatch(setSaveMarkRead(false));
      }
    },
    [saveMarkRead, dispatch]
  );
  useEffect(() => {
    const targetId = lastRead?.verse_key; // Example: "1:31"

    const timer = setTimeout(() => {
      if (!targetId) return;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);

    // Cleanup function to prevent errors if the component unmounts
    return () => clearTimeout(timer);
  }, [lastRead]);
  return (
    <div
      dir="rtl"
      className={`mt-6 bg-card rounded-md  py-4  lg:px-6  leading-relaxed md:leading-loose space-y-6  `}
    >
      {verses?.map((verse) => {
        const isTarget = verse.verse_key === lastRead?.verse_key;
        const scrollId = isTarget ? `${verse.verse_key}` : undefined;

        return (
          <LazyRender
            className="border-b last:border-b-0"
            verse={verse}
            key={verse.verse_key}
            isTarget={isTarget}
            onVerseView={handleVerseView}
            onAttemptSave={handleAttemptSave}
          >
            <TranslationDisplay
              verse={verse}
              isHighlighted={currentVerse?.verse_key === verse.verse_key}
              handleClickVerse={handleClickVerse}
              handleClickCopy={handleClickCopy}
              isReciterDisabled={isReciterDisabled}
              scrollId={scrollId}
            />
          </LazyRender>
        );
      })}
    </div>
  );
};

export default TranslationContent;
