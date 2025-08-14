"use client";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useGetAllRectitationsDataQuery } from "@/lib/store/features/quranApi";

import { useMemo } from "react";
import { getReciterImage } from "@/lib/utils/reciters";
import RecitersList from "../reciter/RecitersList";
import ReciterCardSkeleton from "../reciter/ReciterCardSkeleton";

const reciterHasImage = (reciterName: string) => {
  return !!getReciterImage(reciterName);
};

const Reciters = () => {
  const t = useTranslations("Reciters");
  const locale = useLocale();

  const { data, isLoading } = useGetAllRectitationsDataQuery({
    language: locale,
  });

  const reciters = useMemo(
    () =>
      data?.filter((reciter) => reciterHasImage(reciter.name)).slice(0, 8) ||
      [],
    [data]
  );
  return (
    <section className="py-10">
      <div className="main-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <Link href="/reciters">
            <Button
              variant="ghost"
              className="text-sm font-medium text-gray-500 cursor-pointer"
            >
              {t("show-all")}
            </Button>
          </Link>
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <ReciterCardSkeleton key={index} />
            ))}
          </div>
        )}

        <RecitersList reciters={reciters} />
      </div>
    </section>
  );
};

export default Reciters;
