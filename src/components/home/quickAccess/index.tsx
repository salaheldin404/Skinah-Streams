"use client";
import { useTranslations } from "next-intl";

import QuickRecentlyPlayed from "./QuickRecentlyPlayed";
import LastRead from "./LastRead";
import FavouriteSurahs from "./FavouriteSurahs";
import { KhatmaPlan } from "@/types/khatma";
import KhatmaCardClient from "./KhatmaCardClient";
import KhatmaCardStart from "./KhatmaCardStart";
// import RecentKhatma from "./RecentKhatma";
interface QuickAccessProps {
  khatma: KhatmaPlan | null;
}
const QuickAccess = ({ khatma }: QuickAccessProps) => {
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

          <LastRead />

          {khatma && !khatma.isCompleted ? (
            <KhatmaCardClient plan={khatma} />
          ) : (
            <KhatmaCardStart />
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
