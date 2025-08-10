import { TafsirData } from "@/types/tafsir";
import { useState, useMemo, useCallback } from "react";
import quranData from "@/data/all-quran-surah.json";
import { useGetTafsirAyahQuery } from "@/lib/store/features/tafsirsApi";

interface UseTafsirSelectionProps {
  initialSurahId: string;
  initialVerseNumber: number;
  allTafsirs: TafsirData[] | undefined;
}

export const useTafsirSelection = ({
  initialSurahId,
  initialVerseNumber,
  allTafsirs,
}: UseTafsirSelectionProps) => {
  const [selectedTafsirId, setSelectedTafsirId] = useState(926); // Default to a known ID

  // Memoize the list of all surahs
  const surahs = useMemo(() => quranData.data, []);
  const currentSurah = useMemo(() => {
    const surahIndex = Number(initialSurahId) - 1;
    return surahs?.[surahIndex] || null;
  }, [surahs, initialSurahId]);

  const ayahCount = useMemo<number>(
    () => currentSurah?.numberOfAyahs || 0,
    [currentSurah]
  );
  const arabicTafsirs = useMemo<TafsirData[]>(() => {
    if (!allTafsirs) return [];
    return allTafsirs.filter((tafsir) => tafsir.language_name === "arabic");
  }, [allTafsirs]);

  const ayahKey = useMemo(() => {
    return `${initialSurahId}:${initialVerseNumber}`;
  }, [initialSurahId, initialVerseNumber]);

  const { data: tafsirForAyah, isFetching: isTafsirFetching } =
    useGetTafsirAyahQuery({
      id: selectedTafsirId,
      ayahKey,
    });

  const handleSelectTafsir = useCallback(
    (id: number) => setSelectedTafsirId(id),
    []
  );

  return useMemo(
    () => ({
      selectedTafsirId,
      surahs,
      ayahCount,
      ayahKey,
      arabicTafsirs,
      tafsirForAyah,
      isTafsirFetching,
      handleSelectTafsir,
    }),
    [
      selectedTafsirId,
      surahs,
      ayahCount,
      ayahKey,
      arabicTafsirs,
      tafsirForAyah,
      isTafsirFetching,
      handleSelectTafsir,
    ]
  );
};
