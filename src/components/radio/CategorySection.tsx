"use client";
import { Category, Station } from "@/types/radio";
import { useMemo, memo, useState } from "react";
import ReciterRadioCard from "./ReciterRadioCard";
import RadioCard from "./RadioCard";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import LazyRenderRadio from "./LazyRenderRadio";

interface CategorySectionProps {
  category: Category;
  language: "ar" | "en";
}

const CategorySection = memo(({ category, language }: CategorySectionProps) => {
  const t = useTranslations("RadiosPage");
  const [visibleCount, setVisibleCount] = useState(15);
  const isRecitersCategory = category.category_id === "reciters";
  const stationsToShow = isRecitersCategory
    ? category.stations.slice(0, visibleCount)
    : category.stations;

  const totalStations =
    (isRecitersCategory && category.stations.length) ||
    category.stations.length;
  const canShowMore = isRecitersCategory && visibleCount < totalStations;

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Update state to show all stations.
  };
  return (
    <div key={category.category_id} className="mb-6">
      <h2 className="text-xl font-bold mb-3">
        {category.category_name[language]}
      </h2>
      <div className="grid min-[370px]:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-3">
        {stationsToShow.map((station) =>
          isRecitersCategory ? (
            <LazyRenderRadio key={station.id}>
              <ReciterRadioCard station={station} language={language} />
            </LazyRenderRadio>
          ) : (
            <RadioCard key={station.id} station={station} language={language} />
          )
        )}
      </div>
      {canShowMore && (
        <div className="text-center mt-6">
          <Button
            onClick={handleShowMore}
            className="bg-primary  font-bold py-2 px-6 rounded-lg cursor-pointer"
          >
            {t("show-more")}
          </Button>
        </div>
      )}
    </div>
  );
});

CategorySection.displayName = "CategorySection";

export default CategorySection;
