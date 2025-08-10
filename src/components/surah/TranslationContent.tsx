"use client";
import { Verse } from "@/types/verse";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setOpenAudioPlayer } from "@/lib/store/slices/audio-slice";

import { setSurahInfo, setClickedVerse } from "@/lib/store/slices/surah-slice";

import TranslationDisplay from "./TranslationDisplay";
import { useCallback, useEffect, useMemo } from "react";
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

  const { lastRead } = useAppSelector((state) => state.surah);

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
