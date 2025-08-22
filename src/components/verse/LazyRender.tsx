"use client";
import { memo, useEffect, useRef } from "react";
import VersesLoadingSkeleton from "./VersesLoadingSkeleton";
import { Verse } from "@/types/verse";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";

interface LazyRenderProps {
  children: React.ReactNode;
  verse: Verse;
  className?: string;
  isTarget?: boolean;
  onVerseView?: (data: {
    hizb_number: number;
    juz_number: number;
    page_number: number;
  }) => void;
  onAttemptSave?: (verseData: Verse) => void;
  isLastReadPage?: boolean;
}

const LazyRender = memo(
  ({
    children,
    verse,
    isTarget,
    isLastReadPage,
    className,
    onVerseView,
    onAttemptSave,
  }: LazyRenderProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const hasTriggeredView = useRef(false);
    const { isIntersecting: isCurrentlyInView, wasIntersected } =
      useIntersectionObserver(containerRef, "300px");

    const { isIntersecting: isVerseInView } = useIntersectionObserver(
      containerRef,
      "0px",
      0.75
    );

    useEffect(() => {
      if (isVerseInView && !hasTriggeredView.current && onVerseView) {
        onVerseView({
          hizb_number: verse.hizb_number,
          juz_number: verse.juz_number,
          page_number: verse.page_number,
        });
        hasTriggeredView.current = true;
      } else if (!isVerseInView) {
        hasTriggeredView.current = false;
      }
    }, [isVerseInView, onVerseView, verse]);

    useEffect(() => {
      if (isCurrentlyInView && onAttemptSave) {
        onAttemptSave(verse);
      }
    }, [isCurrentlyInView, verse, onAttemptSave]);

    const showContent = isTarget || wasIntersected || isLastReadPage;

    return (
      <div ref={containerRef} className={` ${className}`}>
        {showContent ? <>{children}</> : <VersesLoadingSkeleton />}
      </div>
    );
  }
);
LazyRender.displayName = "LazyRender";

export default LazyRender;
