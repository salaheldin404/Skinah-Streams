"use client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

const useSurahNavigation = (chapterId: number) => {
  const router = useRouter();

  const handleNextSurah = useCallback(() => {
    if (chapterId < 114) {
      router.push(`/surahs/${chapterId + 1}`);
    }
  }, [chapterId, router]);

  const handlePreviousSurah = useCallback(() => {
    if (chapterId > 1) {
      router.push(`/surahs/${chapterId - 1}`);
    }
  }, [chapterId, router]);

  const navigationState = useMemo(
    () => ({
      isPreviousDisabled: chapterId === 1,
      isNextDisabled: chapterId === 114,
    }),
    [chapterId]
  );

  return {
    handleNextSurah,
    handlePreviousSurah,
    navigationState,
  };
};

export default useSurahNavigation;
