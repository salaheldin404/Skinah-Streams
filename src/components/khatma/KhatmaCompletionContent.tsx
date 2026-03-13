"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, RotateCcw, Home, Star } from "lucide-react";
import { useCallback } from "react";

/** Dua al-Khatm split at the ۞ separator */
const DUA_SECTIONS = [
  "اللَّهُمَّ ارْحَمْنِي بالقُرْءَانِ وَاجْعَلهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً",
  "اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَانَسِيتُ وَعَلِّمْنِي مِنْهُ مَاجَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَارَبَّ العَالَمِينَ",
  "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ ",
  "اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ وَخَيْرَ عَمَلِي خَوَاتِمَهُ وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ",
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً وَمِيتَةً سَوِيَّةً وَمَرَدًّا غَيْرَ مُخْزٍ وَلاَ فَاضِحٍ",
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ المَسْأَلةِ وَخَيْرَ الدُّعَاءِ وَخَيْرَ النَّجَاحِ وَخَيْرَ العِلْمِ وَخَيْرَ العَمَلِ وَخَيْرَ الثَّوَابِ وَخَيْرَ الحَيَاةِ وَخيْرَ المَمَاتِ وَثَبِّتْنِي وَثَقِّلْ مَوَازِينِي وَحَقِّقْ إِيمَانِي وَارْفَعْ دَرَجَتِي وَتَقَبَّلْ صَلاَتِي وَاغْفِرْ خَطِيئَاتِي وَأَسْأَلُكَ العُلَا مِنَ الجَنَّةِ",
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمِ مَغْفِرَتِكَ وَالسَّلاَمَةَ مِنْ كُلِّ إِثْمٍ وَالغَنِيمَةَ مِنْ كُلِّ بِرٍّ وَالفَوْزَ بِالجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ",
  "اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الأُمُورِ كُلِّهَا وَأجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الآخِرَةِ",
  "اللَّهُمَّ اقْسِمْ لَنَا مِنْ خَشْيَتِكَ مَاتَحُولُ بِهِ بَيْنَنَا وَبَيْنَ مَعْصِيَتِكَ وَمِنْ طَاعَتِكَ مَاتُبَلِّغُنَا بِهَا جَنَّتَكَ وَمِنَ اليَقِينِ مَاتُهَوِّنُ بِهِ عَلَيْنَا مَصَائِبَ الدُّنْيَا وَمَتِّعْنَا بِأَسْمَاعِنَا وَأَبْصَارِنَا وَقُوَّتِنَا مَاأَحْيَيْتَنَا وَاجْعَلْهُ الوَارِثَ مِنَّا وَاجْعَلْ ثَأْرَنَا عَلَى مَنْ ظَلَمَنَا وَانْصُرْنَا عَلَى مَنْ عَادَانَا وَلاَ تجْعَلْ مُصِيبَتَنَا فِي دِينِنَا وَلاَ تَجْعَلِ الدُّنْيَا أَكْبَرَ هَمِّنَا وَلَا مَبْلَغَ عِلْمِنَا وَلاَ تُسَلِّطْ عَلَيْنَا مَنْ لَا يَرْحَمُنَا",
  "اللَّهُمَّ لَا تَدَعْ لَنَا ذَنْبًا إِلَّا غَفَرْتَهُ وَلَا هَمَّا إِلَّا فَرَّجْتَهُ وَلَا دَيْنًا إِلَّا قَضَيْتَهُ وَلَا حَاجَةً مِنْ حَوَائِجِ الدُّنْيَا وَالآخِرَةِ إِلَّا قَضَيْتَهَا يَاأَرْحَمَ الرَّاحِمِينَ",
  "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ وَصَلَّى اللهُ عَلَى سَيِّدِنَا وَنَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَأَصْحَابِهِ الأَخْيَارِ وَسَلَّمَ تَسْلِيمًا كَثِيراً",
];
const STAR_POSITIONS = [
  { top: "8%", left: "12%", size: 8, duration: "2.5s", delay: "0s" },
  { top: "15%", left: "82%", size: 4, duration: "3s", delay: "0.4s" },
  { top: "4%", left: "48%", size: 6, duration: "2.1s", delay: "0.9s" },
  { top: "18%", left: "33%", size: 5, duration: "3.4s", delay: "0.2s" },
  { top: "6%", left: "66%", size: 7, duration: "2.8s", delay: "0.7s" },
  { top: "22%", left: "92%", size: 4, duration: "2.3s", delay: "1.4s" },
  { top: "2%", left: "24%", size: 6, duration: "3.1s", delay: "0.3s" },
  { top: "20%", left: "72%", size: 5, duration: "2.6s", delay: "0.8s" },
  { top: "11%", left: "4%", size: 4, duration: "3.0s", delay: "1.1s" },
  { top: "5%", left: "56%", size: 8, duration: "2.4s", delay: "0.5s" },
  { top: "24%", left: "41%", size: 5, duration: "2.9s", delay: "0.6s" },
  { top: "28%", left: "10%", size: 3, duration: "3.3s", delay: "1.0s" },
];

interface Props {
  mode?: "dialog" | "page";
}

export default function KhatmaCompletionContent({ mode = "dialog" }: Props) {
  const locale = useLocale();
  const t = useTranslations("KhatmaFinish");
  const isRTL = locale === "ar";
  const handleNav = useCallback(
    (href: string) => (e: React.MouseEvent) => {
      if (mode === "dialog") {
        e.preventDefault();
        window.location.href = href;
      }
    },
    [mode],
  );
  return (
    <div className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Celebration sparkle particles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {STAR_POSITIONS.map((star, i) => (
          <span
            key={i}
            className="khatma-star absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Primary glow background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ─── Header ─────────────────────── */}
      <div className="relative text-center px-6 pt-8 pb-4">
        {/* Glowing Quran icon */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute w-24 h-24 rounded-full bg-violet-400/20 dark:bg-violet-500/15 blur-xl animate-pulse" />
          <div className="relative z-10 p-4 rounded-full border border-violet-300/40 dark:border-violet-700/40 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/60 dark:to-purple-950/40 shadow-lg shadow-violet-100 dark:shadow-violet-950/20">
            <BookOpen className="w-12 h-12 text-violet-600 dark:text-violet-400" />
          </div>
          {/* Small decorative stars around icon */}
          <Star
            className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 fill-amber-400 animate-spin"
            style={{ animationDuration: "8s" }}
          />
          <Star
            className="absolute -bottom-1 -left-1 w-3 h-3 text-amber-400 fill-amber-400 animate-spin"
            style={{ animationDuration: "6s", animationDirection: "reverse" }}
          />
        </div>
        {mode === "dialog" && (
          <>
            {/* Achievement label */}
            <p className="text-xs font-semibold tracking-[0.2em] uppercase font-cairo text-violet-500 dark:text-violet-400 mb-1">
              {t("achievement")}
            </p>

            {/* Main congratulations heading */}
            <h1 className="tajwal-text text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 dark:from-violet-400 dark:via-purple-300 dark:to-violet-300 bg-clip-text text-transparent leading-snug">
              {t("congratulations")}
            </h1>
          </>
        )}
        {/* Subtitle */}
        <p className="text-sm text-muted-foreground font-cairo mt-1.5">
          {t("subtitle")}
        </p>
      </div>

      {/* ─── Decorative divider ──────────── */}
      <div className="flex items-center gap-3 px-6 py-2">
        <div className="flex-1 h-px bg-gradient-to-l from-violet-300/60 via-violet-200/30 to-transparent dark:from-violet-600/40 dark:via-violet-800/20 dark:to-transparent" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200/50 dark:border-violet-800/30">
          <span className="text-violet-400 text-sm">✦</span>
          <span className="text-xs font-semibold font-cairo text-violet-700 dark:text-violet-400 whitespace-nowrap">
            {t("duaTitle")}
          </span>
          <span className="text-violet-400 text-sm">✦</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-violet-300/60 via-violet-200/30 to-transparent dark:from-violet-600/40 dark:via-violet-800/20 dark:to-transparent" />
      </div>

      {/* ─── Dua content ─────────────────── */}
      <div
        className={`px-4 md:px-6 space-y-3 hide-scrollbar overflow-y-auto pb-2 ${
          mode === "dialog" ? "max-h-[40vh]" : "max-h-none"
        }`}
      >
        {DUA_SECTIONS.map((section, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl p-2.5 md:p-4 bg-primary/10 dark:bg-primary/5 border border-violet-100/60 dark:border-violet-900/30 hover:border-violet-200/80 dark:hover:border-violet-800/50 transition-colors"
          >
            <p className="tajwal-text text-xl leading-[2.2] text-center text-foreground/90 dark:text-foreground/80">
              {section}
            </p>
          </div>
        ))}

        {/* Closing seal */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200/50 dark:border-violet-800/30">
            <span className="text-violet-600 dark:text-violet-400 text-sm font-cairo font-semibold">
              آمين يا رب العالمين
            </span>
          </div>
        </div>
      </div>

      {/* ─── Action buttons ──────────────── */}
      <div className="flex flex-wrap gap-3 px-6 py-5 border-t border-border/30">
        <Link href="/khatma" onClick={handleNav("/khatma")} className="flex-1 ">
          <Button
            variant="outline"
            className="w-full cursor-pointer font-cairo gap-2 "
          >
            <RotateCcw className="w-4 h-4" />
            {t("startNewKhatma")}
          </Button>
        </Link>
        <Link
          href="/"
          onClick={handleNav("/")}
          className="flex-1 block  relative"
        >
          <Button className="w-full font-cairo gap-2 cursor-pointer">
            <Home className="w-4 h-4" />
            {t("backHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
