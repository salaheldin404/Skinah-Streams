import React from "react";
import { FaArrowLeft } from "react-icons/fa";

import type { Hisn } from "@/types/hisn-muslim";
import { Link } from "@/i18n/navigation";
import {
  getItemCountText,
  hisnCategoryIconMap,
  hisnUnitMap,
} from "@/lib/utils/hisn";

interface CategoryCardProps {
  category: Hisn;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const categoryCount = category?.items.length;
  const categoryName = category?.categoryName;
  const units = hisnUnitMap[category.slug] || {
    singular: "عنصر",
    dual: "عنصران",
    plural: "عناصر",
  };

  const Icon =
    hisnCategoryIconMap[category.slug] || hisnCategoryIconMap.default;

  return (
    <div className=" bg-card relative p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ">
      <Link
        href={`/hisn-muslim/${category.slug}`}
        className="absolute inset-0 w-full"
      />
      <div className="flex gap-4">
        <div className="bg-primary/20 text-primary dark:bg-primary dark:text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
          <Icon />
        </div>
        <div className="mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
            {categoryName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {getItemCountText(categoryCount, units)}
          </p>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 text-xs text-primary font-semibold mt-2">
        <span>عرض القسم</span>
        <FaArrowLeft />
      </div>
    </div>
  );
};

export default CategoryCard;
