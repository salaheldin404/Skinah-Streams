"use client";

import SearchInput from "@/components/common/SearchInput";

import React, { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

import quranData from "@/data/all-quran-surah.json";
import { useDebounce } from "@uidotdev/usehooks";
import SurahList from "@/components/surah/SurahList";

import { normalizeArabic } from "@/lib/utils/index";

const SurahsClientPage = () => {
  const originalSurahs = quranData.data;
  const t = useTranslations("Surahs");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const enhancedSurahs = useMemo(() => {
    return originalSurahs.map((surah) => ({
      ...surah,
      // Add new properties for efficient searching
      searchableArabicName: normalizeArabic(surah.name).toLowerCase(),
      searchableEnglishName: surah.englishName.toLowerCase(),
    }));
  }, [originalSurahs]); // Dependency on originalSurahs ensures it runs only if the base data changes.

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const filteredSurahs = useMemo(() => {
    if (!debouncedSearchTerm) {
      return enhancedSurahs;
    }
    const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();

    return enhancedSurahs.filter((surah) => {
      // Compare against the pre-computed, optimized fields
      return (
        surah.searchableArabicName.includes(lowercasedSearchTerm) ||
        surah.searchableEnglishName.includes(lowercasedSearchTerm)
      );
    });
  }, [debouncedSearchTerm, enhancedSurahs]);

  const renderContent = () => {
    if (filteredSurahs.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold">{t("no-surahs")}</h3>
          <p className="text-gray-500">{t("no-surahs-description")}</p>
        </div>
      );
    }

    return <SurahList surahs={filteredSurahs} />;
  };
  return (
    <div className="py-10">
      <div className="main-container">
        <div className="text-center space-y-6 mb-12">
          <h1 className="font-bold text-primary text-4xl">{t("header")}</h1>
          <p className="text-gray-500 leading-relaxed">{t("description")}</p>
        </div>
        <SearchInput
          onChange={handleSearchChange}
          value={searchTerm}
          placeholder={t("input")}
        />

        {renderContent()}
      </div>
    </div>
  );
};

export default SurahsClientPage;
