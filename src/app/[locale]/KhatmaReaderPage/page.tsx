"use client";

import { useTranslations } from "next-intl";
import KhatmaReaderCarousel from "@/components/khatma/KhatmaReaderCarousel";
import React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { parsePageRange } from "@/lib/utils/khatma";
import { Link } from "@/i18n/navigation";

const KhatmaReaderPage = () => {
  const t = useTranslations("KhatmaReader");
  const { khatmaPagesRange, isKhatmaActive, khatmaId } = useAppSelector(
    (state) => state.khatma,
  );
  const range = parsePageRange(khatmaPagesRange);

  if (!isKhatmaActive || !khatmaId.length || !range) {
    return (
      <div className="py-10  flex flex-col gap-3 items-center justify-center">
        <p className="text-gray-500 text-sm text-center md:text-base">
          {t("noActiveKhatma")}
        </p>
        <Link
          href="/khatma"
          className="ml-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          {t("goToKhatma")}
        </Link>
      </div>
    );
  }

  const { start, end } = range;
  const count = end - start + 1;
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Page header */}
        <div className="mb-4 px-2">
          <h1 className="text-lg font-bold font-cairo leading-snug">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground font-cairo mt-0.5">
            {t("pagesRangeInfo", {
              start,
              end,
              count,
            })}
          </p>
        </div>

        {/* Carousel reader */}
        <KhatmaReaderCarousel start={start} end={end} />
      </div>
    </div>
  );
};

export default KhatmaReaderPage;
