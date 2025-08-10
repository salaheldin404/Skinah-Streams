"use client";
import { useTranslations } from "next-intl";

import QuickRecentlyPlayed from "./QuickRecentlyPlayed";

import LastRead from "./LastRead";
import FavouriteSurahs from "./FavouriteSurahs";

const QuickAccess = () => {
  const t = useTranslations("QuickAccess");
  return (
    <section className={`py-10 `}>
      <div className="main-container">
        <div className="mb-8">
          <p className="text-gray-500">{t("message")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <FavouriteSurahs />

          <QuickRecentlyPlayed />

          {/* <div className="surah-card flex items-center group justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-purple rounded-lg flex items-center justify-center ">
                <LuMoon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium">{t("night-recitation")}</h3>
                <p className="text-sm text-gray-500">{t("short-surahs")}</p>
              </div>
            </div>
            <div className=" opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" className="play-button">
                <LuPlay size={16} className="" />
              </Button>
            </div>
          </div> */}

          <LastRead />
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
