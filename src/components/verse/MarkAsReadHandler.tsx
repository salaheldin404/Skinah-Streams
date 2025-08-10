"use client";

import { memo, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Verse } from "@/types/verse";
import { setLastRead, setSaveMarkRead } from "@/lib/store/slices/surah-slice";
const MarkAsReadHandler = memo(
  ({
    verse,
    isCurrentlyInView,
  }: {
    verse: Verse;
    isCurrentlyInView: boolean;
  }) => {
    const dispatch = useAppDispatch();
    const { saveMarkRead } = useAppSelector((state) => state.surah);

    const lastReadData = useMemo(() => {
      if (!verse) return null;
      return {
        chapter_id: verse.chapter_id,
        verse_number: verse.verse_number,
        page_number: verse.page_number,
        qpc_uthmani_hafs: verse.qpc_uthmani_hafs,
        verse_key: verse.verse_key,
      };
    }, [verse]);

    useEffect(() => {
      if (isCurrentlyInView && saveMarkRead && lastReadData) {
        console.log({ isCurrentlyInView, verse, saveMarkRead });
        dispatch(setLastRead(lastReadData));
        dispatch(setSaveMarkRead(false));
      }
    }, [isCurrentlyInView, saveMarkRead, lastReadData, dispatch, verse]);

    return null; // This component doesn't render anything
  }
);

MarkAsReadHandler.displayName = "MarkAsReadHandler";
export default MarkAsReadHandler;
