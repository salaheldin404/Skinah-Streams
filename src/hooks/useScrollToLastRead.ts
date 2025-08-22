"use client";

import { LastRead } from "@/types/surah";
import { useEffect } from "react";

interface UseScrollToLastReadProps {
  lastRead: LastRead | null;
  isFetching: boolean;
  verseQuery: string | null;
}
const useScrollToLastRead = ({
  lastRead,
  isFetching,
  verseQuery,
}: UseScrollToLastReadProps) => {
  useEffect(() => {
    if (!lastRead || isFetching || verseQuery) return;

    const targetId = `${lastRead.chapter_id}-${lastRead.page_number}`;
    const timer = setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: "auto", // 'auto' is better for an initial load scroll
            block: "start",
          });
        });
      }
    }, 150);
    return () => clearTimeout(timer);
    // This effect should only run when the data needed to scroll changes
  }, [isFetching, lastRead, verseQuery]);
};

export default useScrollToLastRead;
