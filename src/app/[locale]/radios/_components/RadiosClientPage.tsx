"use client";

import SearchInput from "@/components/common/SearchInput";
import CategorySection from "@/components/radio/CategorySection";

import radiosData from "@/data/radios.json";
import { useDebounce } from "@uidotdev/usehooks";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const RadiosClientPage = () => {
  const categories = radiosData.categories;
  const t = useTranslations("RadiosPage");
  const locale = useLocale();
  const language = useMemo(() => {
    return locale === "ar" ? "ar" : "en";
  }, [locale]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredRadios = useMemo(() => {
    if (!debouncedSearchTerm) return categories;
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();

    return (
      categories
        // First, map over each category to filter its stations.
        .map((category) => {
          const filteredStations = category.stations.filter(
            (station) =>
              station.name.ar.toLowerCase().includes(lowercasedTerm) ||
              station.name.en.toLowerCase().includes(lowercasedTerm)
          );

          // Return a new category object with only the filtered stations.
          return { ...category, stations: filteredStations };
        })
        // Finally, filter out any categories that have no stations left after filtering.
        .filter((category) => category.stations.length > 0)
    );
  }, [debouncedSearchTerm, categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className="py-10">
      <div className="main-container">
        <div className="flex gap-4 flex-col md:flex-row justify-between md:items-center mb-8">
          <h1 className="text-2xl font-bold ">{t("title")}</h1>
          <div className="flex-1">
            <SearchInput
              placeholder={t("search-input")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="!mb-0"
            />
          </div>
        </div>

        <div className="">
          {filteredRadios.map((category) => (
            <CategorySection
              key={category.category_id}
              category={category}
              language={language}
            />
          ))}
          {filteredRadios.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold">{t("no-stations")}</h3>
              <p className="text-gray-500">{t("no-stations-description")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadiosClientPage;
