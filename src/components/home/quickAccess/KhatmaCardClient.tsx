"use client";

import { useTranslations } from "next-intl";
import { BookOpen, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { useLocale } from "next-intl";

import { useAppSelector } from "@/lib/store/hooks";
import { KhatmaPlan } from "@/types/khatma";
import { Link } from "@/i18n/navigation";
import { getKhatmaRange } from "@/lib/utils/khatma";
import BackgroundOverlay from "@/components/common/BackgroundOverlay";
import { useEffect, useState } from "react";
import RecentKhatmaSkeleton from "./loading/RecentKhatmaSkeleton";

interface KhatmaCardClientProps {
  plan: KhatmaPlan;
}

const KhatmaCardClient = ({ plan }: KhatmaCardClientProps) => {
  const t = useTranslations("Khatma");
  const locale = useLocale();
  const [isClient, setIsClient] = useState(false);
  const isRTL = locale === "ar";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pagesRange = getKhatmaRange(plan.currentPage, plan.pagesPerDay);
  const khatmaBookmarkIndex = useAppSelector(
    (state) => state.khatma.khatmaBookmarkIndex,
  );

  const progressPercentage = Math.round(
    (plan.completedPages / plan.totalPages) * 100,
  );
  const remainingPages = plan.totalPages - plan.completedPages;

  const [startPage, endPage] = pagesRange.split("-").map(Number);
  const totalSlides = endPage - startPage + 1;

  // The bookmark page within today's range (1-based label)
  const bookmarkedPage =
    khatmaBookmarkIndex > 0 && khatmaBookmarkIndex < totalSlides
      ? khatmaBookmarkIndex + startPage
      : null;

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  if (!isClient) return <RecentKhatmaSkeleton/>;
  return (
    <div
      className="surah-card w-full text-start cursor-pointer group relative overflow-hidden"
      aria-label={t("readWird")}
    >
      {plan.isActive ? (
        <Link href="/KhatmaReaderPage" className="absolute inset-0 z-10" />
      ) : (
        <div className="absolute inset-0 z-10 bg-black/30 flex items-center justify-center text-white font-semibold">
          {t("paused")}
        </div>
      )}
      {/* Subtle shimmer accent on hover */}
      <BackgroundOverlay className="bg-gradient-to-r from-emerald-500/20 to-transparent" />
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-12 h-12 gradient-emerald  rounded-lg flex items-center justify-center shrink-0">
          <BookOpen size={20} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-medium text-sm truncate">
              {plan.title ?? t("myKhatmaPlan")}
            </h2>
            {plan.isActive && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-white shrink-0">
                {t("active")}
              </span>
            )}
            {!plan.isActive && !plan.isCompleted && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 dark:text-white shrink-0">
                {t("paused")}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                {plan.completedPages}/{plan.totalPages} {t("pages")}
              </span>
              <span className="font-semibold text-foreground">
                {progressPercentage}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Today's range + bookmark info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-cairo">
                {isRTL
                  ? `اليوم: صفحة ${startPage}–${endPage}`
                  : `Today: p. ${startPage}–${endPage}`}
              </span>
              {bookmarkedPage && (
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Bookmark size={10} className="fill-current" />
                  <span>{bookmarkedPage}</span>
                </span>
              )}
            </div>
            <span className="text-[11px]">
              {remainingPages} {t("remaining")}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center self-center shrink-0 text-muted-foreground group-hover:text-emerald-500 transition-colors">
          <ChevronIcon size={16} />
        </div>
      </div>
    </div>
  );
};

export default KhatmaCardClient;
