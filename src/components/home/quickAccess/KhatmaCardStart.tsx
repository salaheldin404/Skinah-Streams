
"use client";

import { BookOpen, ChevronRight, ChevronLeft, Plus, Sparkles } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";

const KhatmaCardStart = () => {
  const t = useTranslations("Khatma");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <Link
      href="/khatma"
      className="surah-card w-full text-start cursor-pointer group relative overflow-hidden flex items-start gap-3"
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Dashed border hint */}
      <div className="absolute inset-0 rounded-lg border-2 border-dashed border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors duration-300 pointer-events-none" />

      {/* Icon */}
      <div className="relative w-12 h-12 gradient-emerald rounded-lg flex items-center justify-center shrink-0">
        <BookOpen size={20} className="text-white" />
        <span className="absolute -top-1.5 -end-1.5 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center border-2 border-background shadow-sm">
          <Plus size={8} className="text-white" strokeWidth={3} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5 py-0.5">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium text-sm truncate">{t("noPlansYet")}</h2>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shrink-0">
            {t("title")}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {t("noPlansDescription")}
        </p>

        {/* CTA hint */}
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all duration-200">
          <Sparkles size={10} className="shrink-0" />
          <span>{t("createFirstPlan")}</span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center self-center shrink-0 text-muted-foreground group-hover:text-emerald-500 transition-colors duration-200">
        <ChevronIcon size={16} />
      </div>
    </Link>
  );
};

export default KhatmaCardStart;
