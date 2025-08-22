"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Verse } from "@/types/verse";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setOpenAudioPlayer,
  setIsPlaying,
  setLastPlay,
} from "@/lib/store/slices/audio-slice";

import { setClickedVerse, setSurahInfo } from "@/lib/store/slices/surah-slice";

import VerseAction from "./VerseAction";
import { Surah } from "@/types/surah";
import { useFont } from "@/hooks/useFont";

interface VerseDisplayProps {
  verse: Verse;
  surah: Surah;
  scrollId?: string;
}
const VerseDisplay = memo(({ verse, surah, scrollId }: VerseDisplayProps) => {
  const dispatch = useAppDispatch();

  const isAudioPlayerOpen = useAppSelector((state) => state.audio.isOpen);
  const reciter = useAppSelector((state) => state.audio.reciter);
  const currentVerse = useAppSelector((state) => state.audio.currentVerse);
  const surahInfo = useAppSelector((state) => state.surah.surahInfo);

  const { fontFamily, ayahNumberStyle } = useFont();
  const [isOpen, setIsOpen] = useState(false);
  const [savedVerseActive, setSavedVerseActive] = useState(false);

  const verseRef = useRef<HTMLButtonElement>(null);
  const isHighlighted = useMemo(
    () => currentVerse && currentVerse.verse_key === verse.verse_key,
    [currentVerse, verse]
  );
  const { text, number, splText } = useMemo(() => {
    const verseText = verse.qpc_uthmani_hafs;
    const match = verseText.match(/^(.*?)(\s*[\d\u0660-\u0669]+)$/);
    if (!match) {
      return { text: verseText, number: "", splText: [verseText] };
    }
    return {
      text: match[1],
      number: match[2].trim(),
      splText: match[1].split(" "),
    };
  }, [verse.qpc_uthmani_hafs]);

  const isReciterDisabled = useMemo(() => reciter.id === 0, [reciter.id]);

  useEffect(() => {
    if (isHighlighted && verseRef.current) {
      verseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (scrollId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollId);
        if (element) {
          requestAnimationFrame(() => {
            element.scrollIntoView({
              behavior: "auto", // 'auto' is better for an initial load scroll
              block: "start",
            });
          });
          setSavedVerseActive(true);
          setTimeout(() => {
            setSavedVerseActive(false);
          }, 1000);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [scrollId]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);
  const handleClickVerse = useCallback(() => {
    if (!isAudioPlayerOpen) {
      dispatch(setOpenAudioPlayer(true));
    }
    if (surah.number !== surahInfo?.id) {
      dispatch(setSurahInfo({ id: surah.number, name: surah.name }));
      dispatch(setLastPlay(surah));
    }
    dispatch(setClickedVerse(verse.verse_key));
    dispatch(setIsPlaying(false));
    setIsOpen(false);
  }, [isAudioPlayerOpen, dispatch, verse, surah, surahInfo?.id]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(verse.qpc_uthmani_hafs);
  }, [verse.qpc_uthmani_hafs]);

  if (!number) {
    return <span className="inline-block text-justify mx-1">{text}</span>;
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger ref={verseRef} id={scrollId} asChild>
          <div
            className={`${fontFamily} transition-colors py-2 inline text-justify cursor-pointer   hover:bg-primary/10 dark:hover:bg-secondary 
                    data-[state=open]:bg-primary/10 dark:data-[state=open]:bg-secondary 
            ${isHighlighted && "bg-primary/10 dark:bg-secondary"} 
            ${savedVerseActive && "bg-primary/10 dark:bg-secondary"}`}
          >
            <span className="rounded-md inline ">
              {splText.map((word, index) => (
                <span
                  key={index}
                  className="inline-block  last:ml-0 ml-1 last:mr-1"
                >
                  {word}
                </span>
              ))}
            </span>
            <span className={`${ayahNumberStyle} mx-1`}>{number}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-fit py-2" side="top">
          <VerseAction
            isReciterDisabled={isReciterDisabled}
            verse={verse}
            onClickCopy={handleCopy}
            onClickVerse={handleClickVerse}
          />
        </PopoverContent>
      </Popover>
    </>
  );
});

VerseDisplay.displayName = "VerseDisplay";

export default VerseDisplay;
