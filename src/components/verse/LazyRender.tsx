"use client";
import { memo, useEffect, useRef, useState } from "react";
import VersesLoadingSkeleton from "./VersesLoadingSkeleton";
import { Verse } from "@/types/verse";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import MarkAsReadHandler from "./MarkAsReadHandler";

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
}

const LazyRender = memo(
  ({ children, verse, isTarget, className, onVerseView }: LazyRenderProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [hasTriggeredView, setHasTriggeredView] = useState(false);

    const { isIntersecting: isCurrentlyInView, wasIntersected } =
      useIntersectionObserver(containerRef);

    const { isIntersecting: isVerseInView } = useIntersectionObserver(
      containerRef,
      "0px",
      0.75
    );

    useEffect(() => {
      if (isVerseInView && !hasTriggeredView && onVerseView) {
        onVerseView({
          hizb_number: verse.hizb_number,
          juz_number: verse.juz_number,
          page_number: verse.page_number,
        });
        setHasTriggeredView(true);
      } else if (!isVerseInView) {
        setHasTriggeredView(false);
      }
    }, [isVerseInView, onVerseView, verse, hasTriggeredView]);

    useEffect(() => {
      if (isTarget && containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [isTarget]);
    const showContent = isTarget || wasIntersected;

    return (
      <div ref={containerRef} className={` ${className}`}>
        {showContent ? <>{children}</> : <VersesLoadingSkeleton />}
        {isCurrentlyInView && (
          <MarkAsReadHandler
            verse={verse}
            isCurrentlyInView={isCurrentlyInView}
          />
        )}
      </div>
    );
  }
);
LazyRender.displayName = "LazyRender";

export default LazyRender;
