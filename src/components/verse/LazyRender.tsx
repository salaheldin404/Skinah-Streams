"use client";
import { memo, useEffect, useRef } from "react";
import VersesLoadingSkeleton from "./VersesLoadingSkeleton";
import { Verse } from "@/types/verse";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import MarkAsReadHandler from "./MarkAsReadHandler";

interface LazyRenderProps {
  children: React.ReactNode;
  verse: Verse;
  className?: string;
  isTarget?: boolean;
}

const LazyRender = memo(
  ({ children, verse, isTarget, className }: LazyRenderProps) => {
    // const dispatch = useAppDispatch();
    // const saveMarkRead = useAppSelector((state) => state.audio.saveMarkRead);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { isIntersecting: isCurrentlyInView, wasIntersected } =
      useIntersectionObserver(containerRef);

    const isCurrentlyInViewRef = useRef(isCurrentlyInView);

    useEffect(() => {
      isCurrentlyInViewRef.current = isCurrentlyInView;
    }, [isCurrentlyInView]);

    // useEffect(() => {
    //   if (isCurrentlyInView && verse) {
    //     if (saveMarkRead) {
    //       const lastReadData = {
    //         chapter_id: verse.chapter_id,
    //         verse_number: verse.verse_number,
    //         page_number: verse.page_number,
    //         qpc_uthmani_hafs: verse.qpc_uthmani_hafs,
    //         verse_key: verse.verse_key,
    //       };
    //       console.log({ lastReadData });
    //       dispatch(setLastRead(lastReadData));
    //       dispatch(setSaveMarkRead(false));
    //     }
    //   }
    // }, [isCurrentlyInView, verse, dispatch, saveMarkRead]);

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
