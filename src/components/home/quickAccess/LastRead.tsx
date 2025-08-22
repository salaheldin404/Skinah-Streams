"use client";
import { useState, useEffect } from "react";

import { useAppSelector } from "@/lib/store/hooks";

import quranData from "@/data/all-quran-surah.json";
import { FaBookReader } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LuBookmark } from "react-icons/lu";
import LastReadSkeleton from "./loading/LastReadSkeleton";

const LastRead = () => {
  const t = useTranslations("QuickAccess");
  const [isClient, setIsClient] = useState(false);
  // It safely flags that we are now on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { lastRead } = useAppSelector((state) => state.surah);
  const chapterId = lastRead?.chapter_id;
  const surah = chapterId ? quranData.data[+chapterId - 1] : null;

  if (!isClient) return <LastReadSkeleton />;
  return (
    <div className="surah-card relative  flex items-center  justify-between">
      {lastRead && (
        <Link
          href={`/surahs/${chapterId}`}
          className="absolute inset-0 cursor-pointer"
        />
      )}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 gradient-teal rounded-lg flex items-center justify-center">
          <FaBookReader size={20} className="text-white" />
        </div>
        <div>
          <h2>{t("last-read")}</h2>
          <div className={`${!lastRead && "hidden"} flex items-center gap-2`}>
            <p className="text-sm text-gray-500">{surah?.name}</p>
            <span className="text-sm text-gray-500">{lastRead?.verse_key}</span>
            <span className="text-gray-500 text-sm">-</span>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {t("page")}
              <span>{lastRead?.page_number}</span>
            </p>
          </div>
          <p
            className={`text-sm text-gray-500  ${
              !lastRead ? "block" : "hidden"
            }`}
          >
            {t("no-last-read")}
          </p>
        </div>
      </div>

      <LuBookmark size={16} className="" />
    </div>
  );
};

export default LastRead;
