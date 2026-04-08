"use client";
import { Surah, SurahSearchResult } from "@/types/surah";
import { useMemo } from "react";
export const useSurahSearch = ({
  searchTerm,
  limit,
  surahs,
}: {
  searchTerm: string;
  limit?: number;
  surahs?: Surah[];
}) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return [];
    if (!surahs) return [];
    return surahs
      .map((surah) => {
        let matchType: SurahSearchResult["matchType"] | null = null;

        // Search by number
        if (surah.number.toString() === searchTerm) {
          matchType = "number";
        }
        // Search by Arabic name (full or short)
        else if (
          surah.name.toLowerCase().includes(searchTerm) ||
          surah.shortName.toLowerCase().includes(searchTerm)
        ) {
          matchType = "name";
        }
        // Search by English name
        else if (surah.englishName.toLowerCase().includes(searchTerm)) {
          matchType = "englishName";
        }
        // Search by English translation
        else if (
          surah.englishNameTranslation.toLowerCase().includes(searchTerm)
        ) {
          matchType = "translation";
        }

        if (matchType) {
          return { ...surah, matchType } as SurahSearchResult;
        }
        return null;
      })
      .filter((item): item is SurahSearchResult => item !== null)
      .sort((a, b) => {
        // Prioritize exact number matches
        if (a.matchType === "number") return -1;
        if (b.matchType === "number") return 1;
        // Then sort by surah number
        return a.number - b.number;
      })
      .slice(0, limit); // Limit results if limit is provided, otherwise default to 10
  }, [searchTerm, limit, surahs]);
};
