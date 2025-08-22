"use client";
import React, { Fragment, memo, useCallback, useRef } from "react";
import VerseDisplay from "../verse/VerseDisplay";
import { Verse } from "@/types/verse";
import { toArabicNumber } from "@/lib/utils/surah";
import LazyRender from "../verse/LazyRender";
import { Surah } from "@/types/surah";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useFont } from "@/hooks/useFont";
import {
  setCurrentVerseLocation,
  setLastRead,
  setSaveMarkRead,
} from "@/lib/store/slices/surah-slice";

interface ReadingContentProps {
  pageNumber: string;
  verses: Verse[];
  locale: string;
  surah: Surah;
}

const ReadingContent = memo(
  ({ pageNumber, verses, locale, surah }: ReadingContentProps) => {
    const { goToVerse, saveMarkRead, currentVerseLocation, lastRead } =
      useAppSelector((state) => state.surah);
    const { fontSize } = useFont();
    const dispatch = useAppDispatch();
    const isSaveInProgress = useRef(false);
    const isLastReadPage = lastRead?.page_number === Number(pageNumber);

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

    return (
      <Fragment key={pageNumber}>
        <div className="py-2" id={`${surah.number}-${pageNumber}`}>
          <div className="">
            <div
              dir="rtl"
              className={`${fontSize}  leading-relaxed md:leading-loose`}
            >
              {verses.map((verse) => {
                const isVerseTarget = verse.verse_key === goToVerse;

                const scrollVerseId = isVerseTarget
                  ? `${verse.verse_key}`
                  : undefined;

                return (
                  <LazyRender
                    className="inline"
                    verse={verse}
                    key={verse.verse_key}
                    isTarget={isVerseTarget}
                    onVerseView={handleVerseView}
                    onAttemptSave={handleAttemptSave}
                    isLastReadPage={isLastReadPage}
                  >
                    <VerseDisplay
                      key={verse.verse_key}
                      verse={verse}
                      surah={surah}
                      scrollId={scrollVerseId}
                    />
                  </LazyRender>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-b  border-gray-200 dark:border-secondary py-2">
          <span className="font-cairo text-gray-500 text-sm text-center block font-medium">
            {locale === "ar" ? toArabicNumber(+pageNumber) : pageNumber}
          </span>
        </div>
      </Fragment>
    );
  }
);

ReadingContent.displayName = "ReadingContent";

export default ReadingContent;
