"use client";
import { LuHeart } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/store/hooks";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import FavoriteSurahsSkeleton from "./loading/FavoriteSurahsSkeleton";
const FavouriteSurahs = () => {
  const t = useTranslations("QuickAccess");
  const [isClient, setIsClient] = useState(false);
  // It safely flags that we are now on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { surahs } = useAppSelector((state) => state.wishlist);
  if (!isClient) return <FavoriteSurahsSkeleton />;
  return (
    <div className="surah-card group relative">
      <Link href="/favorites" className="absolute inset-0 cursor-pointer" />
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 gradient-green rounded-lg flex items-center justify-center ">
          <LuHeart size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-medium">{t("favorite-surahs")}</h3>
          <p className="text-sm text-gray-500">
            {surahs.length} {t("surahs")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavouriteSurahs;
