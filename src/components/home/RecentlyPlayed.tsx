"use client";
import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";

import { useAppSelector } from "@/lib/store/hooks";
import RecentlyCard from "../surah/RecentlyCard";
import RecentlyPlayedSkeleton from "./quickAccess/loading/RecentlyPlayedSkeleton";
const RecentlyPlayed = () => {
  const t = useTranslations("RecentlyPlayed");
  const [isClient, setIsClient] = useState(false);
  // It safely flags that we are now on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { lastPlay } = useAppSelector((state) => state.audio);

  return (
    <section className="pt-10 pb-20">
      <div className="main-container">
        <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>
        {!isClient ? (
          <RecentlyPlayedSkeleton />
        ) : (
          <div className=" grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {lastPlay.length &&
              lastPlay.map((surah) => (
                <RecentlyCard key={surah.number} surah={surah} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyPlayed;
