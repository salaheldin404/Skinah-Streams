"use client";
import React, { Fragment, memo, useEffect } from "react";
import VerseDisplay from "../verse/VerseDisplay";
import { Verse } from "@/types/verse";
import { toArabicNumber } from "@/lib/utils/surah";
import LazyRender from "../verse/LazyRender";
import { Surah } from "@/types/surah";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useFont } from "@/hooks/useFont";

interface ReadingContentProps {
  pageNumber: string;
  verses: Verse[];
  locale: string;
  surah: Surah;
}

const ReadingContent = memo(
  ({ pageNumber, verses, locale, surah }: ReadingContentProps) => {
    const { lastRead, goToVerse } = useAppSelector((state) => state.surah);
    const { fontSize } = useFont();
    const dispatch = useAppDispatch();
    useEffect(() => {
      const targetId = goToVerse || lastRead?.verse_key; // Example: "1:31"
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
    }, [lastRead, goToVerse, dispatch]);
    return (
      <Fragment key={pageNumber}>
        <div className="py-2  ">
          <div className="">
            <div
              dir="rtl"
              className={`${fontSize}  leading-relaxed md:leading-loose`}
            >
              {verses.map((verse) => {
                const isTarget =
                  verse.verse_key === goToVerse ||
                  verse.verse_key === lastRead?.verse_key;
                const scrollId = isTarget ? `${verse.verse_key}` : undefined;

                return (
                  <LazyRender
                    className="inline"
                    verse={verse}
                    key={verse.verse_key}
                    isTarget={isTarget}
                  >
                    <VerseDisplay
                      key={verse.verse_key}
                      verse={verse}
                      surah={surah}
                      scrollId={scrollId}
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
